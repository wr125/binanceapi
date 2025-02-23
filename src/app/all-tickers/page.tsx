'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { binanceWS } from '@/lib/binanceWebSocket'

interface Ticker {
  s: string      // Symbol
  c: string      // Current price
  P: string      // Price change percent
  h: string      // High price
  l: string      // Low price
  q: string      // Quote volume
}

export default function AllTickers() {
  const [tickers, setTickers] = useState<Ticker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({
    key: 'quoteVolume',
    direction: 'desc'
  })

  const ITEMS_PER_PAGE = 100

  useEffect(() => {
    const unsubscribe = binanceWS.subscribe((data) => {
      // Filter and transform the data
      const formattedTickers = data
        .filter((ticker: Ticker) => ticker.s.endsWith('USDT'))
        .map((ticker: Ticker) => ({
          symbol: ticker.s,
          markPrice: ticker.c,
          priceChangePercent: ticker.P,
          highPrice: ticker.h,
          lowPrice: ticker.l,
          quoteVolume: ticker.q
        }));

      setTickers(formattedTickers);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const filteredTickers = tickers
    .filter(ticker => 
      ticker.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const direction = sortConfig.direction === 'desc' ? 1 : -1
      if (sortConfig.key === 'quoteVolume') {
        const volumeA = parseFloat(a.quoteVolume || '0')
        const volumeB = parseFloat(b.quoteVolume || '0')
        return direction * (volumeB - volumeA)
      }
      return 0
    })

  // Pagination calculations
  const totalPages = Math.ceil(filteredTickers.length / ITEMS_PER_PAGE)
  const paginatedTickers = filteredTickers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const renderPagination = () => {
    return (
      <div className="flex justify-between items-center mt-6 bg-gray-800 p-4 rounded-lg">
        <div className="text-gray-400">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTickers.length)} of {filteredTickers.length} tickers
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Previous
          </button>
          <div className="flex items-center gap-2 px-4">
            <span className="text-gray-400">Page</span>
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(Number(e.target.value))}
              className="bg-gray-700 border border-gray-600 rounded px-2 py-1"
            >
              {[...Array(totalPages)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span className="text-gray-400">of {totalPages}</span>
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="text-center">Loading tickers...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">All Futures Tickers</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid gap-4">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 p-4 bg-gray-800 rounded-lg font-semibold">
            <div>Symbol</div>
            <div>Mark Price</div>
            <div>24h Change</div>
            <div>24h High</div>
            <div>24h Low</div>
            <div 
              className="cursor-pointer hover:text-blue-400 flex items-center gap-2"
              onClick={() => handleSort('quoteVolume')}
            >
              24h Volume (USDT)
              {sortConfig.key === 'quoteVolume' && (
                <span>{sortConfig.direction === 'desc' ? '↓' : '↑'}</span>
              )}
            </div>
          </div>

          {/* Table Body */}
          {paginatedTickers.map((ticker) => {
            const priceChange = parseFloat(ticker.priceChangePercent)
            const priceChangeColor = priceChange >= 0 ? 'text-green-500' : 'text-red-500'

            return (
              <div 
                key={ticker.symbol}
                className="grid grid-cols-6 gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="font-semibold">{ticker.symbol}</div>
                <div>${parseFloat(ticker.markPrice).toFixed(2)}</div>
                <div className={priceChangeColor}>
                  {priceChange.toFixed(2)}%
                  <span className="ml-1">
                    {priceChange >= 0 ? '↑' : '↓'}
                  </span>
                </div>
                <div className="text-green-400">
                  ${parseFloat(ticker.highPrice).toFixed(2)}
                </div>
                <div className="text-red-400">
                  ${parseFloat(ticker.lowPrice).toFixed(2)}
                </div>
                <div>{parseFloat(ticker.quoteVolume).toLocaleString()} USDT</div>
              </div>
            )
          })}
        </div>

        {/* Pagination Controls */}
        {renderPagination()}
      </div>
    </div>
  )
} 