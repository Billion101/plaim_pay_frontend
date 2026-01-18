import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Bell, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  CreditCard,
  Fingerprint,
  Home as HomeIcon,
  Settings,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { transactionAPI } from '../../services/api'
import { Order } from '../../types'

const Home: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showBalance, setShowBalance] = useState(true)
  const [transactions, setTransactions] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/client/login')
      return
    }
    fetchTransactions()
  }, [user, navigate])

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getOrderHistory()
      setTransactions(response.transactions.slice(0, 3)) // Show only 3 recent
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatAmount = (amount: string | number) => {
    return new Intl.NumberFormat('en-US').format(typeof amount === 'string' ? parseFloat(amount) : amount)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Status Bar */}
      {/* <div className="flex justify-between items-center p-4 pt-12 text-white text-sm">
        <span>02:15</span>
        <div className="flex items-center gap-2">
          <div className="bg-black bg-opacity-30 rounded-full px-3 py-1">
            <span>📱</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span>📶</span>
          <span className="bg-green-500 px-2 py-1 rounded text-xs font-bold">97%</span>
        </div>
      </div> */}

      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-blue-200 text-sm">
                Status: {user.vertify_plam ? 'verified' : 'not verified'}
              </p>
            </div>
          </div>
          <button className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Bell className="text-white" size={20} />
          </button>
        </div>

        {/* Balance Card */}
        <div className="mb-8">
          <p className="text-blue-200 text-sm mb-2">Total Balance</p>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-white text-4xl font-bold">
              {showBalance ? `${formatAmount(user.amount)} kip` : '••••••• kip'}
            </h2>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-blue-300 hover:text-white"
            >
              {showBalance ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>

          {/* E-Wallet Card */}
          <div className="bg-black bg-opacity-30 rounded-2xl p-4 flex items-center justify-between backdrop-blur-sm border border-white border-opacity-10">
            <div className="flex items-center gap-3">
              <CreditCard className="text-white" size={20} />
              <span className="text-white font-medium">E-Wallet</span>
            </div>
            <button
              onClick={() => navigate('/client/topup')}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            >
              <Plus className="text-white" size={16} />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm border border-white border-opacity-10">
            <div className="w-8 h-8 bg-black bg-opacity-30 rounded-lg flex items-center justify-center mb-3">
              <ArrowUpRight className="text-white" size={16} />
            </div>
            <span className="text-white text-sm font-medium">Transfer</span>
          </button>

          <button 
            onClick={() => navigate('/client/topup')}
            className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm border border-white border-opacity-10"
          >
            <div className="w-8 h-8 bg-black bg-opacity-30 rounded-lg flex items-center justify-center mb-3">
              <ArrowDownLeft className="text-white" size={16} />
            </div>
            <span className="text-white text-sm font-medium">Top-up</span>
          </button>

          <button className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm border border-white border-opacity-10">
            <div className="w-8 h-8 bg-black bg-opacity-30 rounded-lg flex items-center justify-center mb-3">
              <DollarSign className="text-white" size={16} />
            </div>
            <span className="text-white text-sm font-medium">Withdraw</span>
          </button>
        </div>

        {/* Palm Pairs Button */}
        <button 
          onClick={() => navigate('/client/palm-pairs')}
          className="w-full bg-white bg-opacity-20 rounded-2xl p-4 mb-8 backdrop-blur-sm border border-white border-opacity-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
              <Fingerprint className="text-white" size={16} />
            </div>
            <span className="text-white font-medium">Palm pairs</span>
          </div>
        </button>

        {/* Transactions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">Transactions</h3>
            <button 
              onClick={() => navigate('/client/history')}
              className="text-blue-300 text-sm hover:text-white"
            >
              View all
            </button>
          </div>

          <div className="space-y-1">
            <p className="text-blue-200 text-sm mb-3">Today</p>
            
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-blue-200">No transactions yet</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <ArrowUpRight className="text-white" size={14} />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Purchase</p>
                      <p className="text-blue-200 text-xs">Store transaction</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">₭{formatAmount(transaction.amount)}</p>
                    <p className="text-green-400 text-xs">₭{formatAmount(transaction.amount)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-10 backdrop-blur-md border-t border-white border-opacity-20">
        <div className="flex items-center justify-around py-4">
          <button className="flex flex-col items-center gap-1">
            <HomeIcon className="text-white" size={20} />
            <span className="text-white text-xs font-medium">Home</span>
          </button>
          <button 
            onClick={() => navigate('/client/settings')}
            className="flex flex-col items-center gap-1"
          >
            <Settings className="text-blue-300" size={20} />
            <span className="text-blue-300 text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home