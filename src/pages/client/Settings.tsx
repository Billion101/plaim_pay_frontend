import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Calendar, 
  Shield, 
  Wallet,
  LogOut,
  RefreshCw
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { userAPI } from '../../services/api'
import { User as UserType } from '../../types'

const Settings: React.FC = () => {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState<UserType | null>(user)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/client/login')
      return
    }
    fetchProfile()
  }, [user, navigate])

  const fetchProfile = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await userAPI.getProfile()
      setProfileData(response)
      updateUser(response) // Update context with latest data
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/client/login')
  }

  const formatAmount = (amount: string | number) => {
    return new Intl.NumberFormat('en-US').format(typeof amount === 'string' ? parseFloat(amount) : amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user || !profileData) return null

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
        <h1 className="text-white text-xl font-bold">Settings</h1>
        <button
          onClick={fetchProfile}
          disabled={isLoading}
          className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          <RefreshCw className={`text-white ${isLoading ? 'animate-spin' : ''}`} size={20} />
        </button>
      </div>

      <div className="px-6 pb-20">
        {/* Profile Header */}
        <div className="bg-white bg-opacity-10 rounded-3xl p-6 mb-6 backdrop-blur-sm border border-white border-opacity-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {profileData.first_name.charAt(0)}{profileData.last_name.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">
                {profileData.first_name} {profileData.last_name}
              </h2>
              <p className="text-blue-200">
                {profileData.vertify_plam ? '✓ Palm Verified' : '⚠ Palm Not Verified'}
              </p>
            </div>
          </div>
          
          {/* Balance */}
          <div className="bg-black bg-opacity-30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Wallet className="text-green-400" size={20} />
              <div>
                <p className="text-blue-200 text-sm">Current Balance</p>
                <p className="text-white text-2xl font-bold">₭{formatAmount(profileData.amount)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-4 mb-8">
          {/* Personal Information */}
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm border border-white border-opacity-20">
            <div className="flex items-center gap-3 mb-3">
              <User className="text-blue-300" size={20} />
              <h3 className="text-white font-semibold">Personal Information</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-blue-200 text-sm">First Name</p>
                <p className="text-white font-medium">{profileData.first_name}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Last Name</p>
                <p className="text-white font-medium">{profileData.last_name}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm border border-white border-opacity-20">
            <div className="flex items-center gap-3 mb-3">
              <Phone className="text-blue-300" size={20} />
              <h3 className="text-white font-semibold">Contact Information</h3>
            </div>
            
            <div>
              <p className="text-blue-200 text-sm">Phone Number</p>
              <p className="text-white font-medium">{profileData.phone}</p>
            </div>
          </div>

          {/* Security Information */}
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm border border-white border-opacity-20">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="text-blue-300" size={20} />
              <h3 className="text-white font-semibold">Security</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-blue-200 text-sm">Palm Verification Status</p>
                <p className={`font-medium ${profileData.vertify_plam ? 'text-green-400' : 'text-yellow-400'}`}>
                  {profileData.vertify_plam ? 'Verified' : 'Not Verified'}
                </p>
              </div>
              {profileData.plam_code && (
                <div>
                  <p className="text-blue-200 text-sm">Palm Code</p>
                  <p className="text-white font-mono text-sm bg-black bg-opacity-30 px-3 py-2 rounded-lg">
                    {profileData.plam_code.substring(0, 20)}...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm border border-white border-opacity-20">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="text-blue-300" size={20} />
              <h3 className="text-white font-semibold">Account Information</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-blue-200 text-sm">Account ID</p>
                <p className="text-white font-mono text-sm">{profileData.id}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm">Member Since</p>
                <p className="text-white font-medium">{formatDate(profileData.created_at)}</p>
              </div>
              {profileData.updated_at && (
                <div>
                  <p className="text-blue-200 text-sm">Last Updated</p>
                  <p className="text-white font-medium">{formatDate(profileData.updated_at)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-200 px-4 py-3 rounded-2xl backdrop-blur-sm mb-6">
            {error}
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 bg-opacity-20 border border-red-400 text-red-200 py-4 rounded-2xl font-semibold hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm flex items-center justify-center gap-3"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Settings