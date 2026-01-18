import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, DollarSign } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { userAPI } from '../../services/api'

const Topup: React.FC = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTopup = async () => {
    if (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > 1000) {
      setError('Please enter a valid amount between 1 and 1000 LAK')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await userAPI.topup({ amount: parseFloat(amount) })
      updateUser(response.user)
      
      // Navigate to payment link if provided
      if (response.payment?.paymentUrl) {
        window.open(response.payment.paymentUrl, '_blank')
        // Navigate back to home after opening payment link
        setTimeout(() => {
          navigate('/client/home')
        }, 1000)
      } else {
        // If no payment link, just show success and go back
        alert('Top-up successful!')
        navigate('/client/home')
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Top-up failed')
    } finally {
      setIsLoading(false)
    }
  }

  const formatAmount = (amount: string | number) => {
    return new Intl.NumberFormat('en-US').format(typeof amount === 'string' ? parseFloat(amount) : amount)
  }

  if (!user) {
    navigate('/client/login')
    return null
  }

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
        <h1 className="text-white text-xl font-bold">Top-up Wallet</h1>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      <div className="px-6">
        {/* Current Balance */}
        <div className="bg-white bg-opacity-10 rounded-3xl p-6 mb-8 backdrop-blur-sm border border-white border-opacity-20">
          <div className="text-center">
            <p className="text-blue-200 text-sm mb-2">Current Balance</p>
            <h2 className="text-white text-3xl font-bold mb-4">
              ₭{formatAmount(user.amount)}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="text-blue-300" size={20} />
              <span className="text-blue-200">E-Wallet</span>
            </div>
          </div>
        </div>

        {/* Top-up Form */}
        <div className="bg-white bg-opacity-10 rounded-3xl p-6 backdrop-blur-sm border border-white border-opacity-20">
          <div className="mb-6">
            <label className="block text-white text-lg font-semibold mb-4">
              Top-up Amount
            </label>
            
            <div className="relative mb-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-2xl text-white text-lg placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Enter amount"
                min="1"
                max="1000"
              />
            </div>

            <p className="text-blue-200 text-sm mb-6">
              Maximum top-up amount: 1,000 LAK
            </p>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[100, 500, 1000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="bg-white bg-opacity-20 text-white py-3 rounded-xl font-medium hover:bg-opacity-30 transition-all backdrop-blur-sm border border-white border-opacity-20"
                >
                  ₭{quickAmount}
                </button>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-200 px-4 py-3 rounded-2xl backdrop-blur-sm mb-6">
                {error}
              </div>
            )}

            {/* Top-up Button */}
            <button
              onClick={handleTopup}
              disabled={isLoading || !amount}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </button>

            <p className="text-blue-200 text-sm text-center mt-4">
              You will be redirected to PhajayPay to complete the payment
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topup