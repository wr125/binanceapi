import crypto from 'crypto';

export function generateSignature(queryString: string): string {
  return crypto
    .createHmac('sha256', process.env.BINANCE_API_SECRET!)
    .update(queryString)
    .digest('hex');
}

export function getAuthenticatedWSEndpoint(): string {
  const timestamp = Date.now();
  const queryString = `timestamp=${timestamp}`;
  const signature = generateSignature(queryString);
  
  return `wss://ws-fapi.binance.com/ws-fapi/v1/${process.env.NEXT_PUBLIC_BINANCE_API_KEY}?${queryString}&signature=${signature}`;
}

export class BinanceFuturesWebSocket {
  private ws: WebSocket | null = null;
  private subscribers: ((data: any) => void)[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket('wss://fstream.binance.com/ws/!ticker@arr');

    this.ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.subscribers.forEach(callback => callback(data));
    };

    this.ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  }

  subscribe(callback: (data: any) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Create a singleton instance
export const binanceWS = new BinanceFuturesWebSocket(); 