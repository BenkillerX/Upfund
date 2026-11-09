import mongoose from "mongoose";
import User from "../../models/User.js";
import Deposit from "../../models/Deposit.js";
import Withdrawal from "../../models/Withdrawal.js";

// 1. Dashboard statistics
export async function getDashboardStats(req, res) {
  try {
    const [
      totalUsers,
      depositStats,
      withdrawalStats,
      pendingWithdrawals,
    ] = await Promise.all([
      User.countDocuments(),

      Deposit.aggregate([
        {
          $match: {
            status: "success",
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            totalCount: { $sum: 1 },
          },
        },
      ]),

      Withdrawal.aggregate([
        {
          $match: {
            status: "successful",
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            totalCount: { $sum: 1 },
          },
        },
      ]),

      Withdrawal.aggregate([
        {
          $match: {
            status: "pending",
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            totalCount: { $sum: 1 },
          },
        },
      ]),
    ]);

    const deposits = depositStats[0] || {
      totalAmount: 0,
      totalCount: 0,
    };

    const withdrawals = withdrawalStats[0] || {
      totalAmount: 0,
      totalCount: 0,
    };

    const pending = pendingWithdrawals[0] || {
      totalAmount: 0,
      totalCount: 0,
    };

    return res.status(200).json({
      totalUsers,

      totalDeposits: deposits.totalAmount,
      totalDepositTransactions: deposits.totalCount,

      totalSuccessfulWithdrawals: withdrawals.totalAmount,
      successfulWithdrawalCount: withdrawals.totalCount,

      pendingWithdrawalAmount: pending.totalAmount,
      pendingWithdrawalCount: pending.totalCount,
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);

    return res.status(500).json({
      message: "Unable to fetch dashboard statistics.",
    });
  }
}

// 2. Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Fetch users error:", error);

    return res.status(500).json({
      message: "Unable to fetch users.",
    });
  }
}


// 3. Get one user's details, deposits and withdrawals
export async function getUserDetails(req, res) {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(userId)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const [deposits, withdrawals] = await Promise.all([
      Deposit.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean(),

      Withdrawal.find({ user: userId })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    return res.status(200).json({
      user,
      deposits,
      withdrawals,
    });
  } catch (error) {
    console.error("Fetch user details error:", error);

    return res.status(500).json({
      message: "Unable to fetch user details.",
    });
  }
}


// 4. Get all withdrawal requests
export async function getAllWithdrawals(req, res) {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      count: withdrawals.length,
      withdrawals,
    });
  } catch (error) {
    console.error("Fetch withdrawals error:", error);

    return res.status(500).json({
      message: "Unable to fetch withdrawal requests.",
    });
  }
}


// 5. Update withdrawal status
export async function updateWithdrawalStatus(req, res) {
  const session = await mongoose.startSession();

  try {
    const { withdrawalId } = req.params;
    const { status, adminNote } = req.body;

    if (!mongoose.Types.ObjectId.isValid(withdrawalId)) {
      return res.status(400).json({
        message: "Invalid withdrawal ID.",
      });
    }

    if (!["successful", "failed"].includes(status)) {
      return res.status(400).json({
        message: "Status must be successful or failed.",
      });
    }

    if (
      adminNote !== undefined &&
      typeof adminNote !== "string"
    ) {
      return res.status(400).json({
        message: "Admin note must be a string.",
      });
    }

    session.startTransaction();

    // Only pending requests can be processed.
    // This prevents processing or refunding the same request twice.
    const withdrawal = await Withdrawal.findOneAndUpdate(
      {
        _id: withdrawalId,
        status: "pending",
      },
      {
        $set: {
          status,
          adminNote: adminNote?.trim() || null,
          processedAt: new Date(),
        },
      },
      {
        session,
        returnDocument: "after",
      }
    );

    if (!withdrawal) {
      await session.abortTransaction();

      const existingWithdrawal = await Withdrawal.findById(
        withdrawalId
      );

      if (!existingWithdrawal) {
        return res.status(404).json({
          message: "Withdrawal request not found.",
        });
      }

      return res.status(409).json({
        message: "This withdrawal request has already been processed.",
      });
    }

    // Refund the user's wallet if the withdrawal failed.
    if (status === "failed") {
      const refund = await User.updateOne(
        {
          _id: withdrawal.user,
        },
        {
          $inc: {
            balance: withdrawal.amount,
          },
        },
        {
          session,
        }
      );

      if (refund.matchedCount !== 1) {
        throw new Error("User account not found during withdrawal refund.");
      }
    }

    await session.commitTransaction();

    return res.status(200).json({
      message:
        status === "successful"
          ? "Withdrawal marked as successful."
          : "Withdrawal marked as failed. User wallet refunded.",
      withdrawal,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Update withdrawal status error:", error);

    return res.status(500).json({
      message: "Unable to update withdrawal status.",
    });
  } finally {
    await session.endSession();
  }
}