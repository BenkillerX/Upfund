import cron from "node-cron";
import Deposit from "../models/Deposit.js";
import calculateDailyEarnings from "../services/earningsService.js";

const dailyEarningsJob = () => {
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        const deposits = await Deposit.find({
          status: "success",
        });

        for (const deposit of deposits) {
          const earnings = calculateDailyEarnings(deposit.amount);

          console.log({
            userId: deposit.user,
            initialDeposit: deposit.amount,
            simulatedEarnings: earnings,
          });
        }

        console.log("Daily earnings simulation completed");
      } catch (error) {
        console.error("Earnings simulation failed:", error);
      }
    },
    {
      timezone: "Africa/Lagos",
    }
  );
};

export default dailyEarningsJob;