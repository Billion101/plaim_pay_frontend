import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus, User, Phone, Lock, Eye, EyeOff, Scan } from 'lucide-react'
import { authAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import PalmScanner from '../../components/PalmScanner'

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    plam_code: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePalmScan = (palmCode: string) => {
    setFormData({
      ...formData,
      plam_code: palmCode
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await authAPI.register(formData)
      login(response.user, response.token)
      navigate('/client/home')
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-blue-200">Join our digital wallet</p>
        </div>

        {/* Register Form */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 border border-white border-opacity-20">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm text-sm"
                    placeholder="First name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm text-sm"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="Create password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Palm Code Input */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Palm Biometric (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.plam_code}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-blue-200 backdrop-blur-sm"
                  placeholder="Scan your palm"
                />
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="bg-blue-500 bg-opacity-30 text-white px-4 py-3 rounded-xl hover:bg-opacity-40 flex items-center gap-2 backdrop-blur-sm border border-white border-opacity-20"
                >
                  <Scan size={18} />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-blue-200">
              Already have an account?{' '}
              <Link to="/client/login" className="text-white font-semibold hover:text-blue-300 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <PalmScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handlePalmScan}
        title="Register Palm Biometric"
      />
    </div>
  )
}

export default Register