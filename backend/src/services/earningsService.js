import Deposit from "../models/Deposit.js";

const creditDailyEarnings = async (depositId) => {
  const deposit = await Deposit.findById(depositId);

  if (!deposit) {
    throw new Error("Deposit not found");
  }

  if (deposit.status !== "success") {
    throw new Error("Deposit is not successful");
  }

  const dailyEarnings = deposit.amount * 0.15;

  return {
    initialDeposit: deposit.amount,
    dailyEarnings,
  };
};

export default creditDailyEarnings;