import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { generateToken } from "../../utils/generateToken.js";
import { generateReferralCode } from "../../utils/generateReferralCode.js";
import Deposit from "../../models/Deposit.js";
import mongoose from "mongoose";
import { sendEmail } from "../../utils/sendEmail.js";

export async function register(req, res) {
  try {
    const { username, email, password, referralCode } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered.",
      });
    }

    let referredBy = null;

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });

      if (!referrer) {
        return res.status(400).json({
          message: "Invalid referral code.",
        });
      }

      referredBy = referrer._id;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      referralCode: generateReferralCode(),
      referredBy,
      referralStatus: referredBy ? "pending" : undefined,
    });

    const token = generateToken(user);

    return res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance,
        bankAccount: user.bankAccount,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Something went wrong during registration.",
    });
  }
}
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Generate JWT
    const token = generateToken(user);

   return res.status(200).json({
  message: "Login successful.",
  token,
  user: {
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  balance: user.balance,
  bankAccount: user.bankAccount,
  referralCode: user.referralCode,
},
});
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong during login.",
    });
  }
}

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. User ID not found.",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      user,
    });

  } catch (error) {
    console.error("Get current user error:", error);

    return res.status(500).json({
      message: "Failed to retrieve user",
    });
  }
};

export const updateBankAccount = async (req, res) => {
  try {
    const { accountName, accountNumber, bankName } = req.body;

    if (!accountName || !accountNumber || !bankName) {
      return res.status(400).json({
        message: "All bank account fields are required.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        bankAccount: {
          accountName: accountName.trim(),
          accountNumber: accountNumber.trim(),
          bankName: bankName.trim(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      message: "Bank account updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Update bank account error:", error);

    return res.status(500).json({
      message: "Failed to update bank account.",
    });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { username, phoneNumber } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized.",
      });
    }

    if (!username?.trim()) {
      return res.status(400).json({
        message: "Username is required.",
      });
    }

    const existingUsername = await User.findOne({
      username: username.trim(),
      _id: { $ne: userId },
    });

    if (existingUsername) {
      return res.status(409).json({
        message: "Username is already taken.",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        username: username.trim(),
        phoneNumber: phoneNumber?.trim() || null,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Failed to update profile.",
    });
  }
};
export const getReferralStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const totalReferrals = await User.countDocuments({
      referredBy: userId,
    });

    const qualified = await User.countDocuments({
      referredBy: userId,
      referralStatus: "qualified",
    });

    const pending = totalReferrals - qualified;

    return res.status(200).json({
      totalReferrals,
      qualified,
      pending,
    });
  } catch (error) {
    console.error("Get referral stats error:", error);

    return res.status(500).json({
      message: "Failed to retrieve referral statistics.",
    });
  }
};
export const getReferralHistory = async (req, res) => {
  try {
    const referrals = await User.find({
      referredBy: req.user.userId,
    })
      .select("username createdAt referralStatus")
      .sort({ createdAt: -1 });

    return res.status(200).json({ referrals });
  } catch (error) {
    console.error("Get referral history error:", error);

    return res.status(500).json({
      message: "Failed to retrieve referral history.",
    });
  }
};
export const getDashboardTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const [deposits, totalDeposits] = await Promise.all([
      Deposit.find({
        user: userId,
        status: "success",
      })
        .sort({ paidAt: -1 })
        .limit(5)
        .select("amount reference paidAt createdAt"),

      Deposit.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(userId),
            status: "success",
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    const user = await User.findById(userId).select("balance");

    return res.status(200).json({
      transactions: deposits,
      totalDeposits: totalDeposits[0]?.total || 0,
      totalWithdrawals: 0,
      currentBalance: user?.balance || 0,
    });
  } catch (error) {
    console.error("Dashboard transactions error:", error);

    return res.status(500).json({
      message: "Failed to retrieve dashboard transactions.",
    });
  }
};

export async function testEndpoint(req, res) {
  await sendEmail({
  to: "devben289@gmail.com",
  subject: "Upfund Email Test",
  html: "<h1>Email configuration works!</h1>",
});
}