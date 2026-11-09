import { useEffect, useRef, useState } from "react";
import { CandlestickSeries, ColorType, createChart, type ISeriesApi, type CandlestickData, type UTCTimestamp, } from "lightweight-charts";
import api from "../../services/api";

interface TwelveDataCandle {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

interface TwelveDataPrice {
  symbol: string;
  price: number;
  timestamp: number;
}

interface TwelveDataMessage {
  event?: string;
  status?: string;
  symbol?: string;
  price?: number;
  timestamp?: number;
  message?: string;
}

type ConnectionStatus =
  | "Connecting"
  | "Connected"
  | "Live"
  | "Disconnected"
  | "Error";

const API_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY;

const LiveTradingChart = () => {
  const intervalMap: Record<string, string> = {
    "1m": "1min",
    "5m": "5min",
    "15m": "15min",
    "1H": "1h",
    "4H": "4h",
    "1D": "1day",
  };

  const intervalSeconds: Record<string, number> = {
    "1m": 60,
    "5m": 300,
    "15m": 900,
    "1H": 3600,
    "4H": 14400,
    "1D": 86400,
  };

  const chartContainerRef = useRef<HTMLDivElement>(null);

  const seriesRef =
    useRef<ISeriesApi<"Candlestick"> | null>(null);

  const latestCandleRef =
    useRef<CandlestickData<UTCTimestamp> | null>(null);

  const pendingTickRef = useRef<TwelveDataPrice | null>(null);

  const [pair, setPair] = useState("EUR/USD");
  const [timeframe, setTimeframe] = useState("5m");

  const [connectionState, setConnectionState] = useState<{
    pair: string;
    timeframe: string;
    status: ConnectionStatus;
  }>(() => ({
    pair,
    timeframe,
    status: API_KEY ? "Connecting" : "Error",
  }));
  const connectionStatus =
    connectionState.pair === pair &&
    connectionState.timeframe === timeframe
      ? connectionState.status
      : API_KEY
        ? "Connecting"
        : "Error";

  // Update the currently forming candle with live prices.
  const applyLivePrice = (tick: TwelveDataPrice) => {
    const series = seriesRef.current;

    if (!series) return;

    const lastCandle = latestCandleRef.current;

    // Wait until historical candles have loaded.
    if (!lastCandle) {
      pendingTickRef.current = tick;
      return;
    }

    const seconds = intervalSeconds[timeframe];

    const candleTime = (
      Math.floor(tick.timestamp / seconds) * seconds
    ) as UTCTimestamp;

    const lastCandleTime = Number(lastCandle.time);

    // Ignore old ticks.
    if (Number(candleTime) < lastCandleTime) return;

    let updatedCandle: CandlestickData<UTCTimestamp>;

    if (Number(candleTime) === lastCandleTime) {
      // Update existing candle.
      updatedCandle = {
        ...lastCandle,
        high: Math.max(lastCandle.high, tick.price),
        low: Math.min(lastCandle.low, tick.price),
        close: tick.price,
      };
    } else {
      // Start a new candle.
      updatedCandle = {
        time: candleTime,
        open: tick.price,
        high: tick.price,
        low: tick.price,
        close: tick.price,
      };
    }

    series.update(updatedCandle);

    latestCandleRef.current = updatedCandle;
  };

  // 1. Initialize chart.
  useEffect(() => {
    const container = chartContainerRef.current;

    if (!container) return;

    const chart = createChart(container, {
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

      width: container.clientWidth,
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
      latestCandleRef.current = null;
    };
  }, []);

  // 2. Fetch historical candles.
  useEffect(() => {
    const controller = new AbortController();

    const getCandles = async () => {
      try {
        latestCandleRef.current = null;
        pendingTickRef.current = null;

        const response = await api.get("/api/market/forex", {
          params: {
            symbol: pair,
            interval: intervalMap[timeframe],
          },
          signal: controller.signal,
        });

        const candles: CandlestickData<UTCTimestamp>[] =
          response.data.values.map(
            (candle: TwelveDataCandle) => ({
              time: Math.floor(
                new Date(candle.datetime).getTime() / 1000
              ) as UTCTimestamp,

              open: Number(candle.open),
              high: Number(candle.high),
              low: Number(candle.low),
              close: Number(candle.close),
            })
          );

        // Lightweight Charts requires ascending timestamps.
        candles.sort(
          (a, b) => Number(a.time) - Number(b.time)
        );

        if (controller.signal.aborted) return;

        seriesRef.current?.setData(candles);

        latestCandleRef.current =
          candles[candles.length - 1] ?? null;

        // Apply any price tick received while history was loading.
        const pendingTick = pendingTickRef.current;

        pendingTickRef.current = null;

        if (pendingTick) {
          applyLivePrice(pendingTick);
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error(
          "Failed to fetch historical market data:",
          error
        );
      }
    };

    void getCandles();

    return () => {
      controller.abort();
    };
  }, [pair, timeframe]);

  // 3. Connect directly to Twelve Data WebSocket.
  useEffect(() => {
    if (!API_KEY) {
      console.error("Twelve Data API key is missing.");

      return;
    }

    const socket = new WebSocket(
      `wss://ws.twelvedata.com/v1/quotes/price?apikey=${API_KEY}`
    );

    let heartbeat: number | undefined;

    socket.onopen = () => {
      console.log("Connected to Twelve Data.");

      setConnectionState({ pair, timeframe, status: "Connected" });

      // Subscribe to the selected currency pair.
      socket.send(
        JSON.stringify({
          action: "subscribe",
          params: {
            symbols: pair,
          },
        })
      );

      // Keep the connection alive.
      heartbeat = window.setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              action: "heartbeat",
            })
          );
        }
      }, 10000);
    };

    socket.onmessage = (event: MessageEvent<string>) => {
      try {
        const message: TwelveDataMessage =
          JSON.parse(event.data);

        if (message.event === "subscribe-status") {
          if (message.status !== "ok") {
            console.error(
              "Subscription failed:",
              message
            );

            setConnectionState({ pair, timeframe, status: "Error" });
          }

          return;
        }

        if (
          message.event === "price" &&
          message.symbol === pair &&
          typeof message.price === "number" &&
          typeof message.timestamp === "number"
        ) {
          setConnectionState({ pair, timeframe, status: "Live" });

          applyLivePrice({
            symbol: message.symbol,
            price: message.price,
            timestamp: message.timestamp,
          });
        }
      } catch (error) {
        console.error("Failed to process live price:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("Twelve Data WebSocket error:", error);

      setConnectionState({ pair, timeframe, status: "Error" });
    };

    socket.onclose = () => {
      console.log("Twelve Data connection closed.");

      setConnectionState({ pair, timeframe, status: "Disconnected" });
    };

    return () => {
      if (heartbeat !== undefined) {
        window.clearInterval(heartbeat);
      }

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            action: "unsubscribe",
            params: {
              symbols: pair,
            },
          })
        );
      }

      socket.close();
    };
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
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  connectionStatus === "Live"
                    ? "bg-green-500"
                    : connectionStatus === "Error"
                    ? "bg-red-500"
                    : "bg-amber-500"
                }`}
              />

              {connectionStatus}
            </span>
          </div>

          <p className="mt-1 text-xs text-gray-500">
            Real-time market price
          </p>
        </div>

        {/* Pair Selector */}
        <div className="flex flex-wrap gap-2">
          {["EUR/USD"].map(
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
      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 px-5 py-3">
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

      {/* Bottom Info */}
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
        <span className="text-xs text-gray-500">
          {timeframe} candles
        </span>

        <span className="text-xs text-gray-400">
          Twelve Data
        </span>
      </div>
    </div>
  );
};

export default LiveTradingChart;
