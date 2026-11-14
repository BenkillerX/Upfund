import axios from "axios";
import crypto from "crypto";
import mongoose from "mongoose";
import User from "../../models/User.js";
import Deposit from "../../models/Deposit.js";
import Withdrawal from "../../models/Withdrawal.js";


// 1. Initialize deposit
export async function deposit(req, res) {
  try {
    const { amount } = req.body;

    const depositAmount = Number(amount);

    const minDeposit = Number(process.env.MIN_DEPOSIT_NAIRA || 5000);

    if ( !Number.isFinite(depositAmount) || !Number.isSafeInteger(depositAmount) || depositAmount < minDeposit) {
      return res.status(400).json({
        message: `Deposit must be at least ₦${minDeposit.toLocaleString("en-NG")}.`,
      });
    }

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const reference = `UPFUND-${crypto.randomUUID()}`;

    const newDeposit = await Deposit.create({
      user: user._id,
      reference,
      amount: depositAmount,
    });

const response = await axios.post(
  "https://api.paystack.co/transaction/initialize",
  {
    email: user.email,
    amount: depositAmount * 100,
    currency: "NGN",
    reference,

    // Redirect user back to the deposit page after payment
    callback_url: `${process.env.FRONTEND_URL}/user/deposit`,

    metadata: {
      userId: user._id.toString(),
    },
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  }
);

    return res.status(200).json({
      message: "Deposit initialized successfully.",
      authorization_url: response.data.data.authorization_url,
      reference,
    });
  } catch (error) {
    console.error(
      "Deposit initialization error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "Unable to initialize deposit.",
    });
  }
}

// 2. Verify payment and process referral qualification
async function processSuccessfulDeposit(reference) {
    const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    }
  );

  const payment = response.data.data;

  if (
    !response.data.status ||
    payment.status !== "success" ||
    payment.currency !== "NGN"
  ) {
    throw new Error("Payment was not successful.");
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const existingDeposit = await Deposit.findOne({
        reference,
      }).session(session);

      if (!existingDeposit) {
        throw new Error("Deposit record not found.");
      }

      if (existingDeposit.status === "success") {
        return;
      }

      if (
        existingDeposit.status !== "pending" ||
        payment.reference !== reference ||
        payment.amount !== existingDeposit.amount * 100
      ) {
        throw new Error("Payment details do not match.");
      }

      const paidAt = new Date();
      const updatedDeposit = await Deposit.updateOne(
        {
          _id: existingDeposit._id,
          status: "pending",
        },
        {
          $set: {
            status: "success",
            paidAt,
          },
        },
        { session }
      );

      if (updatedDeposit.modifiedCount !== 1) {
        throw new Error("Deposit has already been processed.");
      }

      // Credit user's wallet
      const user = await User.findByIdAndUpdate(
        existingDeposit.user,
        {
          $inc: {
            balance: existingDeposit.amount,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!user) {
        throw new Error("User not found.");
      }

      // Check whether this is the user's first deposit
      const firstDeposit = await User.findOneAndUpdate(
        {
          _id: user._id,
          firstDepositAt: null,
        },
        {
          $set: {
            firstDepositAt: paidAt,
            firstDepositAmount: existingDeposit.amount,
            lastDailyEarningsAt: paidAt,
            withdrawalUsed: false,
          },
        },
        {
          new: true,
          session,
        }
      );

      if (!firstDeposit) {
        await User.findOneAndUpdate(
          {
            _id: user._id,
            withdrawalUsed: true,
          },
          {
            $set: {
              firstDepositAmount: existingDeposit.amount,
              lastDailyEarningsAt: paidAt,
              withdrawalUsed: false,
            },
          },
          { session }
        );
      }

      // First successful deposit qualifies the referral
      if (firstDeposit && firstDeposit.referredBy) {
        const reward = Number(
          process.env.REFERRAL_REWARD_NAIRA || 0
        );

        await User.updateOne(
          { _id: firstDeposit._id },
          {
            $set: {
              referralQualified: true,
              referralStatus: "qualified",
            },
          },
          { session }
        );

        // Credit the person who referred this user
        if (reward > 0) {
          await User.updateOne(
            { _id: firstDeposit.referredBy },
            {
              $inc: {
                balance: reward,
              },
            },
            { session }
          );
        }
      }
    });
  } finally {
    await session.endSession();
  }
}


// 3. Verify deposit from frontend callback
export async function verifyDeposit(req, res) {
  try {
    const { reference } = req.params;

    const deposit = await Deposit.findOne({
      reference,
      user: req.user.userId,
    });

    if (!deposit) {
      return res.status(404).json({
        message: "Deposit not found.",
      });
    }

    if (deposit.status !== "success") {
      await processSuccessfulDeposit(reference);
    }

    return res.status(200).json({
      message: "Payment verified successfully.",
    });
  } catch (error) {
    console.error("Payment verification error:", error.message);

    return res.status(400).json({
      message: "Payment verification failed.",
    });
  }
}


export async function paystackWebhook(req, res) {
  try {
    const signature = req.headers["x-paystack-signature"];

    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET)
      .update(req.rawBody)
      .digest("hex");

    if (
      !signature ||
      !req.rawBody ||
      signature.length !== hash.length ||
      !crypto.timingSafeEqual(
        Buffer.from(hash, "hex"),
        Buffer.from(signature, "hex")
      )
    ) {
      return res.sendStatus(401);
    }

    const event = req.body;

    if (event.event !== "charge.success") {
      return res.sendStatus(200);
    }

    await processSuccessfulDeposit(event.data.reference);

    return res.sendStatus(200);
  } catch (error) {
    console.error("Paystack webhook error:", error.message);

    return res.sendStatus(500);
  }
}


export async function withdraw(req, res) {
  const session = await mongoose.startSession();

  try {
    const { amount } = req.body;
    const userId = req.user.userId;

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Please enter a valid withdrawal amount.",
      });
    }

    session.startTransaction();

    const user = await User.findById(userId).session(session);

    if (!user) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "User not found.",
      });
    }

    const { accountName, accountNumber, bankName } =
      user.bankAccount || {};

    if (!accountName || !accountNumber || !bankName) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Please add your bank account details in Settings.",
      });
    }

    if (user.withdrawalUsed) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "You have already withdrawn for this deposit cycle. Make a new deposit to withdraw again.",
      });
    }

    if (amount !== user.balance) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "You must withdraw your full wallet balance in one request.",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
        balance: amount,
        withdrawalUsed: { $ne: true },
      },
      {
        $set: {
          balance: 0,
          withdrawalUsed: true,
          lastDailyEarningsAt: new Date(),
        },
      },
      {
        new: true,
        session,
      }
    );

    if (!updatedUser) {
      await session.abortTransaction();

      return res.status(409).json({
        message: "Your wallet changed. Refresh your balance and try again.",
      });
    }

    const [withdrawal] = await Withdrawal.create(
      [
        {
          user: user._id,
          accountDetails: {
            accountName,
            accountNumber,
            bankName,
          },
          amount,
          status: "pending",
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json({
      message: "Withdrawal request submitted successfully.",
      withdrawal,
      balance: updatedUser.balance,
    });
  } catch (error) {
    await session.abortTransaction();

    console.error("Withdrawal error:", error);

    return res.status(500).json({
      message: "Unable to process withdrawal request.",
    });
  } finally {
    await session.endSession();
  }
}
