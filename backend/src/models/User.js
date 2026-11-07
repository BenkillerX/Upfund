
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    bankAccount: {
  accountName: {
    type: String,
    default: null,
  },
  accountNumber: {
    type: String,
    default: null,
  },
  bankName: {
    type: String,
    default: null,
  },
  },
  phoneNumber: {
      type: String,
      default: null,
      trim: true,
    },
   referralCode: {
  type: String,
  unique: true,
  sparse: true,
},

referredBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},

referralQualified: {
  type: Boolean,
  default: false,
},

firstDepositAt: {
  type: Date,
  default: null,
},
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
