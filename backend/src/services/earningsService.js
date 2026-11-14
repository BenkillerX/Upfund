const calculateDailyEarnings = (initialDepositAmount) => {
  if (!Number.isFinite(initialDepositAmount) || initialDepositAmount <= 0) {
    throw new Error("Initial deposit amount must be a positive number.");
  }

  return Math.round(initialDepositAmount * 0.1 * 100) / 100;
};

export default calculateDailyEarnings;