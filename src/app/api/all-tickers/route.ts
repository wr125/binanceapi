import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://fapi.binance.com/fapi/v1/ticker/24hr');
    const data = await response.json();
    
    // Filter out non-USDT pairs first
    const usdtPairs = data.filter((ticker: any) => 
      ticker.symbol.endsWith('USDT')
    );

    // Sort by 24h volume (quoteVolume) in descending order (highest to lowest)
    const sortedData = usdtPairs.sort((a: any, b: any) => {
      const volumeA = parseFloat(a.quoteVolume)
      const volumeB = parseFloat(b.quoteVolume)
      return volumeB - volumeA // For descending order
    });

    // Filter out pairs with very low volume (optional)
    const filteredData = sortedData.filter((ticker: any) => 
      parseFloat(ticker.quoteVolume) > 1000000 // More than 1M USDT volume
    );

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Error fetching tickers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickers' },
      { status: 500 }
    );
  }
} 