import Deposit from "../models/Deposit.js";
import User from "../models/User.js";
import calculateDailyEarnings from "../services/earningsService.js";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const CHECK_INTERVAL_MILLISECONDS = 60 * 60 * 1000;

const initializeExistingUsers = async (now) => {
  const users = await User.find({
    firstDepositAt: { $ne: null },
    $or: [
      { firstDepositAmount: null },
      { lastDailyEarningsAt: null },
    ],
  }).select("_id firstDepositAmount lastDailyEarningsAt");

  for (const user of users) {
    let firstDepositAmount = user.firstDepositAmount;

    if (firstDepositAmount == null) {
      const firstSuccessfulDeposit = await Deposit.findOne({
        user: user._id,
        status: "success",
      })
        .sort({ paidAt: 1, createdAt: 1 })
        .select("amount");

      if (!firstSuccessfulDeposit) {
        console.error("Cannot initialize earnings: first successful deposit not found.", user._id);
        continue;
      }

      firstDepositAmount = firstSuccessfulDeposit.amount;
    }

    const filter = {
      _id: user._id,
      firstDepositAmount: user.firstDepositAmount,
      lastDailyEarningsAt: user.lastDailyEarningsAt ?? null,
    };
    const setFields = { firstDepositAmount };

    if (!user.lastDailyEarningsAt) {
      setFields.lastDailyEarningsAt = now;
    }

    await User.updateOne(filter, { $set: setFields });
  }
};

const processDailyEarnings = async () => {
  const now = new Date();
  await initializeExistingUsers(now);

  const dueUsers = await User.find({
    firstDepositAmount: { $gt: 0 },
    withdrawalUsed: { $ne: true },
    lastDailyEarningsAt: {
      $lte: new Date(now.getTime() - DAY_IN_MILLISECONDS),
    },
  }).select("_id firstDepositAmount lastDailyEarningsAt");

  for (const user of dueUsers) {
    const lastEarningsAt = user.lastDailyEarningsAt;
    const elapsedDays = Math.floor(
      (now.getTime() - lastEarningsAt.getTime()) / DAY_IN_MILLISECONDS
    );

    if (elapsedDays < 1) {
      continue;
    }

    const dailyEarnings = calculateDailyEarnings(user.firstDepositAmount);
    const totalEarnings = Math.round(dailyEarnings * elapsedDays * 100) / 100;
    const nextEarningsAt = new Date(
      lastEarningsAt.getTime() + elapsedDays * DAY_IN_MILLISECONDS
    );

    await User.updateOne(
      {
        _id: user._id,
        firstDepositAmount: user.firstDepositAmount,
        withdrawalUsed: { $ne: true },
        lastDailyEarningsAt: lastEarningsAt,
      },
      {
        $inc: { balance: totalEarnings },
        $set: { lastDailyEarningsAt: nextEarningsAt },
      }
    );
  }
};

const dailyEarningsJob = () => {
  let running = false;

  const run = async () => {
    if (running) {
      return;
    }

    running = true;

    try {
      await processDailyEarnings();
    } catch (error) {
      console.error("Daily earnings processing failed:", error);
    } finally {
      running = false;
    }
  };

  void run();
  setInterval(() => {
    void run();
  }, CHECK_INTERVAL_MILLISECONDS);
};

export default dailyEarningsJob;