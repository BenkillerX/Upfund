import axios from "axios";

export async function getForexCandles(req, res) {
  try {
    const { symbol, interval = "5min" } = req.query;

    const response = await axios.get(
      "https://api.twelvedata.com/time_series",
      {
        params: {
          symbol,
          interval,
          outputsize: 100,
          order: "asc",
          apikey: process.env.TWELVE_DATA_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Twelve Data error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Failed to fetch forex data",
    });
  }
}