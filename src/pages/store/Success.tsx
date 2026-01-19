import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, ShoppingBag, Package, CreditCard } from 'lucide-react'

const Success: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const orderDetails = location.state?.orderDetails

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your order has been confirmed and is being processed</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Order ID</span>
              <span className="font-medium text-gray-900">
                #{orderDetails?.orderId?.slice(-8) || 'ORD12345'}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Items</span>
              <span className="font-medium text-gray-900">
                {orderDetails?.items || 3} products
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-bold text-green-600 text-lg">
                ₭ {formatAmount(orderDetails?.amount || 7)}
              </span>
            </div>
            
            {/* <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900">Palm Authentication</span>
            </div> */}
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Payment Status</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Transaction Completed</p>
              <p className="text-sm text-gray-600">{new Date().toLocaleString()}</p>
            </div>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle size={16} />
              Confirmed
            </span>
          </div>
        </div>

        {/* What's Next */}
        {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Your order is being prepared for processing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>You'll receive updates on your order status</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Thank you for shopping with Fashion Store!</span>
            </li>
          </ul>
        </div> */}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/store')}
            className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={20} />
            Back to Home
          </button>
          
          {/* <button
            onClick={() => navigate('/store')}
            className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Back to Home
          </button> */}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">Thank you for choosing Fashion Store</p>
        </div>
      </div>
    </div>
  )
}

export default Success