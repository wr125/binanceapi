'use client'

import { useEffect, useState } from 'react'
import BTCTickerCard from '@/components/BTCTickerCard'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
        <div className="container mx-auto px-4 py-24">
          <div className="text-center mb-16 relative z-10">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Algo Crypto Trading
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Advanced algorithmic trading solutions powered by real-time data and sophisticated strategies
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Market Data Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <BTCTickerCard />
          </div>
          
          <div className="space-y-4">
            <div className="p-6 rounded-lg bg-gray-800/50 backdrop-blur-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">24h Volume</span>
                  <span className="text-green-500">$42.8B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Open Interest</span>
                  <span className="text-blue-500">$1.2B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Funding Rate</span>
                  <span className="text-purple-500">0.01%</span>
                </div>
              </div>
            </div>

            <Link 
              href="/all-tickers"
              className="block p-6 rounded-lg bg-gray-800/50 backdrop-blur-lg border border-gray-700 hover:bg-gray-800 transition-colors text-center"
            >
              <h2 className="text-2xl font-bold mb-2">View All Crypto</h2>
              <p className="text-gray-400">
                See detailed information for all trading pairs
              </p>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-lg border border-gray-700">
            <div className="text-blue-500 text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2">Automated Trading</h3>
            <p className="text-gray-400">
              Execute trades 24/7 with sophisticated algorithms and custom strategies
            </p>
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg border border-gray-700">
            <div className="text-purple-500 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Real-time Analysis</h3>
            <p className="text-gray-400">
              Advanced technical indicators and market analysis tools
            </p>
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-br from-pink-500/10 to-red-500/10 backdrop-blur-lg border border-gray-700">
            <div className="text-pink-500 text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold mb-2">Secure Trading</h3>
            <p className="text-gray-400">
              Enterprise-grade security with API key management
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16">
          <div className="max-w-3xl mx-auto p-8 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-lg border border-gray-700">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
            <p className="text-gray-300 mb-8">
              Connect your Binance account and start trading with our advanced algorithms
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-500 text-sm">
            © 2024 Algo Crypto Trading. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  )
}
