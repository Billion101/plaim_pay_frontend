import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Fingerprint, 
  Scan, 
  CheckCircle, 
  AlertCircle,
  Shield
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { userAPI } from '../../services/api'
import PalmScanner from '../../components/PalmScanner'

const PalmPairs: React.FC = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [showScanner, setShowScanner] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [palmCode, setPalmCode] = useState('')

  const handlePalmScan = (scannedPalmCode: string) => {
    setPalmCode(scannedPalmCode)
    setShowScanner(false)
  }

  const handleVerifyPalm = async () => {
    if (!palmCode) {
      setError('Please scan your palm first')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await userAPI.verifyPalm(palmCode)
      updateUser(response.user)
      setSuccess(response.message)
      setPalmCode('')
    } catch (error: any) {
      setError(error.response?.data?.error || 'Palm verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPalmCode(e.target.value)
    setError('')
    setSuccess('')
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
        <h1 className="text-white text-xl font-bold">Palm Pairs</h1>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      <div className="px-6 pb-20">
        {/* Current Status */}
        <div className="bg-white bg-opacity-10 rounded-3xl p-6 mb-6 backdrop-blur-sm border border-white border-opacity-20">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              user.vertify_plam 
                ? 'bg-green-500 bg-opacity-30 border-2 border-green-400' 
                : 'bg-yellow-500 bg-opacity-30 border-2 border-yellow-400'
            }`}>
              {user.vertify_plam ? (
                <CheckCircle className="text-green-400" size={32} />
              ) : (
                <AlertCircle className="text-yellow-400" size={32} />
              )}
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">
                Palm Verification
              </h2>
              <p className={`font-medium ${
                user.vertify_plam ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {user.vertify_plam ? 'Verified' : 'Not Verified'}
              </p>
            </div>
          </div>

          {user.vertify_plam && user.plam_code && (
            <div className="bg-black bg-opacity-30 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="text-blue-300" size={20} />
                <span className="text-white font-medium">Current Palm Code</span>
              </div>
              <p className="text-blue-200 font-mono text-sm">
                {user.plam_code.substring(0, 30)}...
              </p>
            </div>
          )}
        </div>

        {/* Palm Verification Section */}
        <div className="bg-white bg-opacity-10 rounded-3xl p-6 mb-6 backdrop-blur-sm border border-white border-opacity-20">
          <div className="flex items-center gap-3 mb-4">
            <Fingerprint className="text-blue-300" size={24} />
            <h3 className="text-white text-lg font-semibold">
              {user.vertify_plam ? 'Update Palm Biometric' : 'Add Palm Biometric'}
            </h3>
          </div>

          <p className="text-blue-200 text-sm mb-6">
            {user.vertify_plam 
              ? 'You can update your palm biometric data by scanning your palm again.'
              : 'Secure your account by adding palm biometric verification.'
            }
          </p>

          {/* Palm Code Input */}
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              Palm Biometric Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={palmCode}
                onChange={handleManualInput}
                className="flex-1 px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                placeholder="Scan your palm or enter code manually"
              />
              <button
                onClick={() => setShowScanner(true)}
                className="bg-blue-500 bg-opacity-30 text-white px-4 py-3 rounded-xl hover:bg-opacity-40 flex items-center gap-2 backdrop-blur-sm border border-white border-opacity-20"
              >
                <Scan size={18} />
                Scan
              </button>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-500 bg-opacity-20 border border-green-400 text-green-200 px-4 py-3 rounded-xl backdrop-blur-sm mb-4 flex items-center gap-2">
              <CheckCircle size={20} />
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm mb-4 flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerifyPalm}
            disabled={isLoading || !palmCode}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            {isLoading ? 'Verifying...' : user.vertify_plam ? 'Update Palm Biometric' : 'Verify Palm Biometric'}
          </button>
        </div>

        {/* Information Section */}
        {/* <div className="bg-white bg-opacity-10 rounded-3xl p-6 backdrop-blur-sm border border-white border-opacity-20">
          <h3 className="text-white text-lg font-semibold mb-4">About Palm Verification</h3>
          
          <div className="space-y-3 text-blue-200 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Palm biometric verification adds an extra layer of security to your account</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Use palm verification for secure transactions and account access</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Your palm data is encrypted and stored securely</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>You can update your palm biometric data at any time</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Palm Scanner Modal */}
      <PalmScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handlePalmScan}
        title={user.vertify_plam ? "Update Palm Biometric" : "Add Palm Biometric"}
      />
    </div>
  )
}

export default PalmPairs