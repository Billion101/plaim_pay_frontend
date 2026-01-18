import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { useStore } from '../../contexts/StoreContext'
import { mockProducts } from '../../data/products'

const Store: React.FC = () => {
  const { cart, addToCart, updateQuantity, getTotalAmount, getTotalItems } = useStore()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(mockProducts.map(p => p.category)))]
  
  const filteredProducts = selectedCategory === 'All' 
    ? mockProducts 
    : mockProducts.filter(p => p.category === selectedCategory)

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount)
  }

  const getCartQuantity = (productId: string) => {
    const item = cart.find(item => item.product.id === productId)
    return item ? item.quantity : 0
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty')
      return
    }
    navigate('/store/checkout')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Modern Navbar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
                  <ShoppingCart className="text-white" size={24} />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">Fashion Store</h1>
                  <p className="text-xs text-gray-500">Premium Collection</p>
                </div>
              </div>
            </div>

            {/* Center - Search or Navigation */}
            {/* <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <button className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                  New Arrivals
                </button>
                <button className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                  Categories
                </button>
                <button className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                  Sale
                </button>
              </div>
            </div> */}

            {/* Right side - Cart and Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={handleCheckout}
                className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-md"
              >
                <ShoppingCart size={20} />
                <span className="hidden sm:inline">Cart</span>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button className="md:hidden p-2 rounded-md text-gray-700 hover:text-orange-600 hover:bg-gray-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Cart Summary Bar */}
        {cart.length > 0 && (
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 border-t border-orange-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-3">
                <div className="flex items-center space-x-4">
                  <span className="text-orange-800 font-medium">
                    {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in cart
                  </span>
                  <span className="text-orange-600 text-sm">
                    Total: ₭ {formatAmount(getTotalAmount())}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="text-orange-600 hover:text-orange-800 font-medium text-sm flex items-center gap-1"
                >
                  View Cart
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Category Filter */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Shop by Category</h3>
            <div className="text-sm text-gray-500">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 border border-gray-200 hover:border-orange-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const quantity = getCartQuantity(product.id)
            
            return (
              <div key={product.id} className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1">
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                        <span className="text-xs text-gray-500 ml-1">4.8</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-orange-600">₭ {formatAmount(product.price)}</p>
                      <span className="text-xs text-gray-500 line-through">₭ 100,000</span>
                    </div>
                  </div>

                  {quantity === 0 ? (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Plus size={18} />
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border-2 border-orange-200">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors shadow-md"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-bold text-gray-900 text-lg px-4">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors shadow-md"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-6">
              <ShoppingCart size={80} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 text-lg">Try selecting a different category</p>
          </div>
        )}
      </div>

      {/* Floating Checkout Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={handleCheckout}
            className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors flex items-center gap-2 font-semibold"
          >
            <ShoppingCart size={20} />
            Checkout ({getTotalItems()})
          </button>
        </div>
      )}
    </div>
  )
}

export default Store