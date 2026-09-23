import { useEffect, useRef, useState } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  type ISeriesApi,
  type CandlestickData,
  type Time,
} from "lightweight-charts";
import api from "../../services/api";
interface TwelveDataCandle {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
}
const LiveTradingChart = () => {
    const intervalMap: Record<string, string> = {
  "1m": "1min",
  "5m": "5min",
  "15m": "15min",
  "1H": "1h",
  "4H": "4h",
  "1D": "1day",
};

  const chartContainerRef = useRef<HTMLDivElement>(null);

const seriesRef =
  useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [pair, setPair] = useState("EUR/USD");
  const [timeframe, setTimeframe] = useState("5m");
    useEffect(() => {
  if (!chartContainerRef.current) return;

  const chart = createChart(chartContainerRef.current, {
    layout: {
      background: {
        type: ColorType.Solid,
        color: "#ffffff",
      },
      textColor: "#64748b",
    },

    grid: {
      vertLines: {
        color: "#f1f5f9",
      },
      horzLines: {
        color: "#f1f5f9",
      },
    },

    width: chartContainerRef.current.clientWidth,
    height: 400,

    rightPriceScale: {
      borderColor: "#e2e8f0",
    },

    timeScale: {
      borderColor: "#e2e8f0",
      timeVisible: true,
    },
  });

  const series = chart.addSeries(CandlestickSeries, {
    upColor: "#16a34a",
    downColor: "#ef4444",
    borderVisible: false,
    wickUpColor: "#16a34a",
    wickDownColor: "#ef4444",
  });

  seriesRef.current = series;

  const handleResize = () => {
    if (!chartContainerRef.current) return;

    chart.applyOptions({
      width: chartContainerRef.current.clientWidth,
    });
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);

    chart.remove();

    seriesRef.current = null;
  };
}, []);

useEffect(() => {
  const getCandles = async () => {
    try {
      const response = await api.get("/api/market/forex", {
        params: {
          symbol: pair,
          interval: intervalMap[timeframe],
        },
      });

      console.log("Market API response:", response.data);

      const candles: CandlestickData<Time>[] =
  response.data.values.map((candle: TwelveDataCandle) => ({
    time: Math.floor(
      new Date(candle.datetime).getTime() / 1000
    ) as Time,
    open: Number(candle.open),
    high: Number(candle.high),
    low: Number(candle.low),
    close: Number(candle.close),
  }));

      seriesRef.current?.setData(candles);
    } catch (error) {
      console.error("Failed to fetch market data:", error);
    }
  };

  getCandles();
}, [pair, timeframe]);
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Chart Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              {pair}
            </h2>

            <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Live
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Real-time market price
          </p>
        </div>

        {/* Pair Selector */}
        <div className="flex gap-2">
          {["EUR/USD", "GBP/USD", "USD/JPY", "XAU/USD"].map(
            (item) => (
              <button
                key={item}
                onClick={() => setPair(item)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                  pair === item
                    ? "bg-slate-900 text-white"
                    : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>

      {/* Timeframes */}
      <div className="flex gap-2 border-b border-gray-100 px-5 py-3">
        {["1m", "5m", "15m", "1H", "4H", "1D"].map(
          (item) => (
            <button
              key={item}
              onClick={() => setTimeframe(item)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                timeframe === item
                  ? "bg-amber-100 text-amber-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          )
        )}
      </div>

      {/* Chart */}
      <div
        ref={chartContainerRef}
        className="w-full"
      />

      {/* Bottom info */}
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
        <span className="text-xs text-gray-500">
          {timeframe} candles
        </span>

        <span className="text-xs text-gray-400">
          Market data updates automatically
        </span>
      </div>
    </div>
  );
};

export default LiveTradingChart;