import React, { useRef, useEffect, useState } from 'react'
import { X, AlertCircle, Hand } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../contexts/StoreContext'

interface PalmScannerProps {
  isOpen: boolean
  onClose: () => void
  onScan: (palmCode: string) => void
  title?: string
}

const PalmScanner: React.FC<PalmScannerProps> = ({ 
  isOpen, 
  onClose, 
  onScan, 
  title = "Scan Your Palm" 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string>('')
  const [permissionStatus, setPermissionStatus] = useState<'initial' | 'requesting' | 'granted' | 'denied' | 'unavailable'>('initial')
  const [countdown, setCountdown] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  
  const navigate = useNavigate()
  const { cart, getTotalAmount, clearCart } = useStore()

  useEffect(() => {
    if (isOpen) {
      // Don't auto-start camera, wait for user permission
      setPermissionStatus('initial')
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen])

  // Additional effect to ensure scanning starts when camera is ready
  useEffect(() => {
    if (permissionStatus === 'granted' && !isScanning && !countdown) {
      const timer = setTimeout(() => {
        startAutoScan()
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [permissionStatus, isScanning, countdown])

  const checkCameraPermission = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera is not supported on this device')
        setPermissionStatus('unavailable')
        return
      }

      startCamera()
    } catch (error) {
      console.error('Error checking camera permission:', error)
      startCamera()
    }
  }

  const startCamera = async () => {
    try {
      setCameraError('')
      setPermissionStatus('requesting')
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      })
      
      setStream(mediaStream)
      setPermissionStatus('granted')
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        
        // Start scanning immediately after a short delay
        setTimeout(() => {
          startAutoScan()
        }, 1000) // 1 second delay to ensure camera is ready
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error)
      setPermissionStatus('denied')
      
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please allow camera access and try again.')
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera found on this device.')
      } else if (error.name === 'NotSupportedError') {
        setCameraError('Camera is not supported on this device.')
      } else if (error.name === 'NotReadableError') {
        setCameraError('Camera is already in use by another application.')
      } else {
        setCameraError('Unable to access camera. Please check your browser settings and try again.')
      }
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setCameraError('')
    setPermissionStatus('initial')
    setCountdown(0)
    setIsScanning(false)
  }

  const startAutoScan = () => {
    // Auto start 5 second countdown
    setIsScanning(true)
    setCountdown(5)
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          // Navigate directly to success page with cart data
          navigateToSuccess()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const navigateToSuccess = () => {
    // Store cart data before clearing
    const totalAmount = getTotalAmount()
    const itemCount = cart.length
    
    // Create demo order details
    const demoOrderDetails = {
      orderId: `ORDER_${Date.now()}`,
      amount: totalAmount,
      items: itemCount,
      palmCode: `PALM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Clear cart and navigate to success page
    clearCart()
    onClose() // Close the scanner
    navigate('/store/success', { 
      state: { 
        orderDetails: demoOrderDetails
      } 
    })
  }

  const requestCameraPermission = () => {
    checkCameraPermission()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Camera Access Permission Screen */}
        {permissionStatus === 'initial' && (
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-3">Camera Access Required</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We need access to your camera to scan your palm for secure payment authentication.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">Why do we need camera access?</h4>
              <ul className="text-blue-700 text-sm space-y-1 text-left">
                <li>• Scan your palm for biometric authentication</li>
                <li>• Secure payment verification</li>
                <li>• No images are stored or shared</li>
                <li>• Your privacy is protected</li>
              </ul>
            </div>
            
            <button
              onClick={requestCameraPermission}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Allow Camera Access
            </button>
            
            <p className="text-xs text-gray-500 mt-4">
              Click "Allow" when your browser asks for camera permission
            </p>
          </div>
        )}

        {/* Camera Error State */}
        {cameraError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <AlertCircle size={20} />
              <span className="font-semibold">Camera Access Required</span>
            </div>
            <p className="text-sm text-red-700 mb-3">{cameraError}</p>
            {permissionStatus === 'denied' && (
              <div className="space-y-2">
                <button
                  onClick={requestCameraPermission}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                  Try Again
                </button>
                <div className="text-xs text-red-600">
                  <p className="font-semibold mb-1">To enable camera access:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Click the camera icon in your browser's address bar</li>
                    <li>Select "Allow" for camera permission</li>
                    <li>Refresh the page if needed</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Camera Permission Requesting */}
        {permissionStatus === 'requesting' && !cameraError && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-blue-800">Requesting camera access...</p>
          </div>
        )}

        {/* Camera View */}
        {permissionStatus === 'granted' && !cameraError && (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg bg-gray-900"
            />
            
            {/* Simple Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Palm Detection Frame */}
              <div className="absolute inset-4 border-2 border-dashed border-white rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <Hand size={48} className="mx-auto mb-2 text-white opacity-70" />
                  <p className="text-sm opacity-80">Place your palm here</p>
                </div>
              </div>
              
              {/* Clean scanning indicator */}
              {isScanning && (
                <div className="absolute top-4 right-4">
                  <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
                </div>
              )}
              
              {/* Scanning Status */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black bg-opacity-50 rounded-lg p-3 text-center">
                  {isScanning ? (
                    <div>
                      <p className="text-white font-semibold mb-2">Scanning Palm...</p>
                      <div className="animate-pulse">
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                          <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">Please hold your palm steady</p>
                    </div>
                  ) : (
                    <p className="text-white">Position your palm in the frame above</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Unavailable State */}
        {permissionStatus === 'unavailable' && (
          <div className="text-center p-4">
            <AlertCircle className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-600 font-medium">Camera not available</p>
            <p className="text-sm text-gray-500 mt-1">
              This device doesn't support camera access
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PalmScanner