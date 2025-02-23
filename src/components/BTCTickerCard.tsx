'use client'

import { useEffect, useState } from 'react'

interface TickerData {
  e: string    // Event type
  E: number    // Event time
  s: string    // Symbol
  p: string    // Price change
  P: string    // Price change percent
  w: string    // Weighted average price
  c: string    // Last price
  Q: string    // Last quantity
  o: string    // Open price
  h: string    // High price
  l: string    // Low price
  v: string    // Total traded volume
  q: string    // Total traded quote asset volume
}

export default function BTCTickerCard() {
  const [price, setPrice] = useState<string>('0')
  const [priceChange, setPriceChange] = useState<string>('0')
  const [highPrice, setHighPrice] = useState<string>('0')
  const [lowPrice, setLowPrice] = useState<string>('0')
  const [volume, setVolume] = useState<string>('0')
  const [ws, setWs] = useState<WebSocket | null>(null)

  useEffect(() => {
    const connectWebSocket = () => {
      // Use public streams endpoint instead of authenticated endpoint for now
      const websocket = new WebSocket('wss://fstream.binance.com/ws');

      websocket.onopen = () => {
        console.log('WebSocket Connected');
        // Subscribe to BTCUSDT ticker
        const subscribeMsg = {
          method: "SUBSCRIBE",
          params: ["btcusdt@ticker"],
          id: 1
        };
        websocket.send(JSON.stringify(subscribeMsg));
      };

      websocket.onmessage = (event) => {
        const data: TickerData = JSON.parse(event.data);
        if (data.e === '24hrTicker') {
          setPrice(parseFloat(data.c).toFixed(2));
          setPriceChange(parseFloat(data.P).toFixed(2));
          setHighPrice(parseFloat(data.h).toFixed(2));
          setLowPrice(parseFloat(data.l).toFixed(2));
          setVolume(parseFloat(data.v).toFixed(2));
        }
      };

      websocket.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      websocket.onclose = () => {
        console.log('WebSocket Disconnected');
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      setWs(websocket);

      return () => {
        websocket.close();
      };
    };

    connectWebSocket();
  }, []);

  const priceChangeColor = parseFloat(priceChange) >= 0 ? 'text-green-500' : 'text-red-500'

  return (
    <div className="p-6 rounded-lg bg-gray-800 backdrop-blur-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">BTC/USDT Live Price</h2>
      <div className="space-y-6">
        {/* Centered Price Display */}
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">${price}</div>
          <div className={`text-2xl ${priceChangeColor} font-semibold`}>
            {priceChange}%
            <span className="ml-2">
              {parseFloat(priceChange) >= 0 ? '↑' : '↓'}
            </span>
          </div>
        </div>

        {/* 24h High/Low Stats */}
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div className="text-center">
            <div className="text-gray-400 text-lg mb-2">24h High</div>
            <div className="text-2xl font-semibold text-green-400">${highPrice}</div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-lg mb-2">24h Low</div>
            <div className="text-2xl font-semibold text-red-400">${lowPrice}</div>
          </div>
        </div>

        {/* Volume Display */}
        <div className="text-center mt-6">
          <div className="text-gray-400 text-lg mb-2">24h Volume</div>
          <div className="text-xl font-semibold">{volume} BTC</div>
        </div>

        <div className="text-sm text-gray-400 text-center mt-6">
          Real-time data from Binance Futures
        </div>
      </div>
    </div>
  )
} 