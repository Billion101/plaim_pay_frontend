import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Scan, Trash2, Plus, Minus, Keyboard } from 'lucide-react'
import { useStore } from '../../contexts/StoreContext'
import { orderAPI } from '../../services/api'
import PalmScanner from '../../components/PalmScanner'

const Checkout: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getTotalAmount, clearCart } = useStore()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [palmCode, setPalmCode] = useState('')
  const [authMethod, setAuthMethod] = useState<'manual' | 'scan'>('manual')
  const [showSuccess, setShowSuccess] = useState(false)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount)
  }

  const handleManualCheckout = async () => {
    if (!palmCode.trim()) {
      alert('Please enter your palm code')
      return
    }

    await processOrder(palmCode.trim())
  }

  const handleScanCheckout = () => {
    setShowScanner(true)
  }

  const handlePalmScan = async (scannedPalmCode: string) => {
    await processOrder(scannedPalmCode)
  }

  const processOrder = async (palmCodeToUse: string) => {
    if (cart.length === 0) {
      alert('Your cart is empty')
      return
    }

    setIsLoading(true)
    
    try {
      const orderData = {
        amount: getTotalAmount(),
        description: `Store purchase of ${cart.length} items`,
        items: cart.reduce((acc, item) => {
          acc[item.product.name] = item.quantity
          return acc
        }, {} as any)
      }

      // Use palm code authentication for the order
      const response = await orderAPI.createOrderWithPalm(orderData, palmCodeToUse)
      
      // Store order details for success page
      setOrderDetails({
        orderId: response.order?.id || 'N/A',
        amount: getTotalAmount(),
        items: cart.length,
        palmCode: palmCodeToUse
      })

      // Clear cart and navigate to success page
      clearCart()
      navigate('/store/success', { 
        state: { 
          orderDetails: {
            orderId: response.order?.id || 'N/A',
            amount: getTotalAmount(),
            items: cart.length,
            palmCode: palmCodeToUse
          }
        } 
      })
    } catch (error: any) {
      console.error('Order error:', error)
      
      if (error.response?.data?.error === 'Insufficient balance') {
        alert(`Insufficient balance. Current: ₭${formatAmount(error.response.data.currentBalance)}, Required: ₭${formatAmount(error.response.data.requiredAmount)}`)
      } else if (error.response?.data?.error === 'Invalid palm code') {
        alert('Palm verification failed. Please check your palm code or try scanning again.')
      } else if (error.response?.data?.error === 'Palm not verified') {
        alert('Your palm is not verified in the system. Please register your palm first.')
      } else {
        alert(error.response?.data?.error || 'Order failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
      setShowScanner(false)
    }
  }

  const handleScannerClose = () => {
    setShowScanner(false)
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/store')}
              className="p-2 bg-orange-400 rounded-full hover:bg-orange-300"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>
        </div>

        <div className="p-6 text-center">
          <div className="text-gray-400 mb-4">
            <ShoppingCart size={64} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart to continue</p>
          <button
            onClick={() => navigate('/store')}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/store')}
            className="p-2 bg-orange-400 rounded-full hover:bg-orange-300"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        {/* Order Summary */}
        <div className="bg-orange-400 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Amount</span>
            <span className="text-2xl font-bold">₭ {formatAmount(getTotalAmount())}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Cart Items */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Order Items</h3>
          </div>
          
          <div className="p-6 space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">{item.product.description}</p>
                  <p className="text-orange-600 font-semibold">₭ {formatAmount(item.product.price)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-semibold text-gray-800 w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Palm Authentication Method Selection */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Choose Authentication Method</h3>
            <p className="text-sm text-gray-600 mt-1">Select how you want to verify your palm for payment</p>
          </div>
          
          <div className="p-6">
            {/* Method Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setAuthMethod('manual')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  authMethod === 'manual'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Keyboard className={`${authMethod === 'manual' ? 'text-orange-600' : 'text-gray-600'}`} size={32} />
                  <span className={`font-semibold ${authMethod === 'manual' ? 'text-orange-600' : 'text-gray-700'}`}>
                    Manual Entry
                  </span>
                  <span className="text-xs text-gray-500 text-center">
                    Enter your palm code manually
                  </span>
                </div>
              </button>

              <button
                onClick={() => setAuthMethod('scan')}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  authMethod === 'scan'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Scan className={`${authMethod === 'scan' ? 'text-orange-600' : 'text-gray-600'}`} size={32} />
                  <span className={`font-semibold ${authMethod === 'scan' ? 'text-orange-600' : 'text-gray-700'}`}>
                    Palm Scan
                  </span>
                  <span className="text-xs text-gray-500 text-center">
                    Scan your palm with camera
                  </span>
                </div>
              </button>
            </div>

            {/* Manual Entry Form */}
            {authMethod === 'manual' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Palm Code
                  </label>
                  <input
                    type="text"
                    value={palmCode}
                    onChange={(e) => setPalmCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your palm code (e.g., PALM_123456789_abc)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the palm code you received during registration
                  </p>
                </div>

                <button
                  onClick={handleManualCheckout}
                  disabled={isLoading || !palmCode.trim()}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Keyboard size={20} />
                  {isLoading ? 'Processing...' : 'Checkout with Palm Code'}
                </button>
              </div>
            )}

            {/* Scan Method */}
            {authMethod === 'scan' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Scan className="text-blue-600" size={20} />
                    <h4 className="font-semibold text-blue-800">Palm Scan Authentication</h4>
                  </div>
                  <p className="text-blue-700 text-sm mb-2">
                    Click the button below to open the camera and scan your palm for secure authentication.
                  </p>
                  <ul className="text-blue-600 text-sm space-y-1">
                    <li>• Position your palm clearly in front of the camera</li>
                    <li>• Keep your hand steady for best results</li>
                    <li>• Ensure good lighting for accurate scanning</li>
                  </ul>
                </div>

                <button
                  onClick={handleScanCheckout}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Scan size={20} />
                  {isLoading ? 'Processing...' : 'Open Camera & Scan Palm'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Total */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex justify-between items-center text-xl">
            <span className="font-semibold text-gray-800">Total Amount:</span>
            <span className="font-bold text-orange-600">₭ {formatAmount(getTotalAmount())}</span>
          </div>
          <p className="text-center text-gray-600 mt-3 text-sm">
            Choose your preferred authentication method above to complete the purchase
          </p>
        </div>

        {/* Processing State */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing Order</h3>
              <p className="text-gray-600">Please wait while we process your payment...</p>
            </div>
          </div>
        )}
      </div>

      <PalmScanner
        isOpen={showScanner}
        onClose={handleScannerClose}
        onScan={handlePalmScan}
        title="Scan Palm for Payment"
      />
    </div>
  )
}

export default Checkout