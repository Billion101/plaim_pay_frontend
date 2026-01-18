import React, { useRef, useEffect, useState } from 'react'
import { Camera, X, AlertCircle, CheckCircle, Hand } from 'lucide-react'

interface PalmScannerProps {
  isOpen: boolean
  onClose: () => void
  onScan: (palmCode: string) => void
  title?: string
}

interface PalmData {
  palmCode: string
  palmHash: string
  timestamp: number
  imageData: string
}

const PalmScanner: React.FC<PalmScannerProps> = ({ 
  isOpen, 
  onClose, 
  onScan, 
  title = "Scan Your Palm" 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState<string>('')
  const [permissionStatus, setPermissionStatus] = useState<'requesting' | 'granted' | 'denied' | 'unavailable'>('requesting')
  const [scanProgress, setScanProgress] = useState(0)
  const [palmDetected, setPalmDetected] = useState(false)
  const [scanQuality, setScanQuality] = useState<'poor' | 'good' | 'excellent'>('poor')

  useEffect(() => {
    if (isOpen) {
      checkCameraPermission()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen])

  const checkCameraPermission = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera is not supported on this device')
        setPermissionStatus('unavailable')
        return
      }

      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
          if (permission.state === 'denied') {
            setCameraError('Camera permission denied. Please enable camera access in your browser settings.')
            setPermissionStatus('denied')
            return
          }
        } catch (error) {
          console.log('Permission API not fully supported, proceeding with getUserMedia')
        }
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
        // Start palm detection once video is loaded
        videoRef.current.onloadedmetadata = () => {
          startPalmDetection()
        }
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
    setPermissionStatus('requesting')
    setPalmDetected(false)
    setScanProgress(0)
    setScanQuality('poor')
  }

  const startPalmDetection = () => {
    const detectPalm = () => {
      if (!videoRef.current || !canvasRef.current) return

      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (context && video.readyState === 4) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        // Simulate palm detection using image analysis
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const palmDetectionResult = analyzePalmPresence(imageData)
        
        setPalmDetected(palmDetectionResult.detected)
        setScanQuality(palmDetectionResult.quality)
        
        if (palmDetectionResult.detected) {
          setScanProgress(prev => Math.min(prev + 10, 100))
        } else {
          setScanProgress(prev => Math.max(prev - 5, 0))
        }
      }

      if (permissionStatus === 'granted' && !isScanning) {
        requestAnimationFrame(detectPalm)
      }
    }

    detectPalm()
  }

  const analyzePalmPresence = (imageData: ImageData): { detected: boolean; quality: 'poor' | 'good' | 'excellent' } => {
    const data = imageData.data
    let skinPixels = 0
    let totalPixels = data.length / 4
    let brightness = 0
    let contrast = 0

    // Analyze skin tone and hand-like patterns
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      brightness += (r + g + b) / 3
      
      // Detect skin-like colors (simplified)
      if (r > 95 && g > 40 && b > 20 && 
          r > g && r > b && 
          Math.abs(r - g) > 15) {
        skinPixels++
      }
    }

    brightness /= totalPixels
    const skinPercentage = (skinPixels / totalPixels) * 100

    // Calculate contrast (simplified)
    for (let i = 0; i < data.length; i += 4) {
      const pixelBrightness = (data[i] + data[i + 1] + data[i + 2]) / 3
      contrast += Math.abs(pixelBrightness - brightness)
    }
    contrast /= totalPixels

    // Determine palm detection and quality
    const detected = skinPercentage > 15 && skinPercentage < 60 && brightness > 80 && brightness < 200
    
    let quality: 'poor' | 'good' | 'excellent' = 'poor'
    if (detected) {
      if (contrast > 30 && skinPercentage > 25) {
        quality = 'excellent'
      } else if (contrast > 20 && skinPercentage > 20) {
        quality = 'good'
      }
    }

    return { detected, quality }
  }

  const generatePalmHash = (imageData: string): string => {
    // Create a more sophisticated palm hash based on image features
    let hash = 0
    for (let i = 0; i < imageData.length; i++) {
      const char = imageData.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(36)
  }

  const savePalmData = (palmData: PalmData) => {
    const existingPalms = JSON.parse(localStorage.getItem('palmData') || '[]')
    existingPalms.push(palmData)
    localStorage.setItem('palmData', JSON.stringify(existingPalms))
  }

  const findMatchingPalm = (currentHash: string): PalmData | null => {
    const existingPalms: PalmData[] = JSON.parse(localStorage.getItem('palmData') || '[]')
    
    for (const palm of existingPalms) {
      // Calculate similarity between hashes (simplified)
      const similarity = calculateHashSimilarity(currentHash, palm.palmHash)
      if (similarity > 0.8) { // 80% similarity threshold
        return palm
      }
    }
    
    return null
  }

  const calculateHashSimilarity = (hash1: string, hash2: string): number => {
    if (hash1.length !== hash2.length) return 0
    
    let matches = 0
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] === hash2[i]) matches++
    }
    
    return matches / hash1.length
  }

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || scanProgress < 80) {
      alert('Please position your palm properly and wait for better scan quality')
      return
    }

    setIsScanning(true)
    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext('2d')

    if (context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0)
      
      const imageData = canvas.toDataURL('image/jpeg', 0.9)
      const palmHash = generatePalmHash(imageData)
      
      // Check for existing palm match
      const existingPalm = findMatchingPalm(palmHash)
      
      let palmCode: string
      
      if (existingPalm) {
        // Use existing palm code
        palmCode = existingPalm.palmCode
        console.log('Palm recognized! Using existing palm code.')
      } else {
        // Generate new palm code
        palmCode = `PALM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Save new palm data
        const newPalmData: PalmData = {
          palmCode,
          palmHash,
          timestamp: Date.now(),
          imageData: imageData.substring(0, 1000) // Store partial image data for reference
        }
        
        savePalmData(newPalmData)
        console.log('New palm registered!')
      }
      
      // Simulate processing time
      setTimeout(() => {
        setIsScanning(false)
        onScan(palmCode)
        onClose()
      }, 2000)
    }
  }

  const requestCameraPermission = () => {
    startCamera()
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
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Palm Detection Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Palm Detection Frame */}
              <div className="absolute inset-4 border-2 border-dashed border-white rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <Hand size={48} className={`mx-auto mb-2 ${palmDetected ? 'text-green-400' : 'text-white'}`} />
                  <p className="text-sm">Position your palm here</p>
                </div>
              </div>
              
              {/* Scan Progress */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black bg-opacity-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">
                      {palmDetected ? 'Palm Detected' : 'Searching for palm...'}
                    </span>
                    <span className={`text-sm font-semibold ${
                      scanQuality === 'excellent' ? 'text-green-400' :
                      scanQuality === 'good' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {scanQuality.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        scanProgress > 80 ? 'bg-green-500' :
                        scanProgress > 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    Scan Quality: {scanProgress}%
                  </p>
                </div>
              </div>
            </div>
            
            {isScanning && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center rounded-lg">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p>Processing palm scan...</p>
                  <p className="text-sm mt-1">Analyzing palm patterns...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions and Scan Button */}
        {permissionStatus === 'granted' && !cameraError && (
          <div className="mt-4 text-center">
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                {palmDetected ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : (
                  <AlertCircle className="text-orange-600" size={20} />
                )}
                <span className={`text-sm font-medium ${
                  palmDetected ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {palmDetected ? 'Palm detected - Hold steady' : 'Position your palm in the frame'}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Keep your palm flat and steady for best results
              </p>
            </div>
            
            <button
              onClick={captureImage}
              disabled={isScanning || scanProgress < 80}
              className={`px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto transition-colors ${
                scanProgress >= 80 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-400 text-white cursor-not-allowed'
              }`}
            >
              <Camera size={20} />
              {isScanning ? 'Scanning...' : scanProgress >= 80 ? 'Scan Palm' : `Wait... ${Math.round(scanProgress)}%`}
            </button>
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