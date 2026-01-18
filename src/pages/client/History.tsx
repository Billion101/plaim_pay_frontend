import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { transactionAPI } from '../../services/api'
import { Order } from '../../types'

const History: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Order[]>([])
  const [topupHistory, setTopupHistory] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'orders' | 'topups'>('orders')

  useEffect(() => {
    if (!user) {
      navigate('/client/login')
      return
    }
    fetchTransactions()
  }, [user, navigate])

  const fetchTransactions = async () => {
    try {
      const [orderResponse, topupResponse] = await Promise.all([
        transactionAPI.getOrderHistory(),
        transactionAPI.getTopupHistory()
      ])
      
      setTransactions(orderResponse.transactions)
      setTopupHistory(topupResponse.transactions)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatAmount = (amount: string | number) => {
    return new Intl.NumberFormat('en-US').format(typeof amount === 'string' ? parseFloat(amount) : amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const currentTransactions = activeTab === 'orders' ? transactions : topupHistory

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pt-12">
        <button
          onClick={() => navigate('/client/home')}
          className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          <ArrowLeft className="text-white" size={20} />
        </button>
        <h1 className="text-white text-xl font-bold">Transaction History</h1>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      {/* Tab Navigation */}
      <div className="px-6 mb-6">
        <div className="bg-white bg-opacity-10 rounded-2xl p-1 backdrop-blur-sm border border-white border-opacity-20">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('topups')}
              className={`py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === 'topups'
                  ? 'bg-white bg-opacity-20 text-white'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Top-ups
            </button>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-6 pb-20">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p className="text-blue-200 mt-4">Loading transactions...</p>
          </div>
        ) : currentTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="text-blue-300 mx-auto mb-4" size={48} />
            <p className="text-white text-lg font-medium mb-2">No transactions yet</p>
            <p className="text-blue-200">
              {activeTab === 'orders' 
                ? 'Your purchase history will appear here' 
                : 'Your top-up history will appear here'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm border border-white border-opacity-20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      {activeTab === 'orders' ? (
                        <ArrowUpRight className="text-white" size={18} />
                      ) : (
                        <ArrowDownLeft className="text-green-400" size={18} />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {activeTab === 'orders' ? 'Store Purchase' : 'Wallet Top-up'}
                      </p>
                      <p className="text-blue-200 text-sm">
                        {formatDate(transaction.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      activeTab === 'orders' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {activeTab === 'orders' ? '-' : '+'}₭{formatAmount(transaction.amount)}
                    </p>
                    <p className="text-blue-200 text-sm">
                      Status: {transaction.payment_status || 'completed'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default History