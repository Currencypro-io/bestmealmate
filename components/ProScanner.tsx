'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

type ScanMode = 'identify' | 'budget' | 'leftovers';

interface Ingredient {
  name: string;
  quantity?: string;
  freshness?: string;
  category?: string;
  estimatedCost?: string;
  condition?: string;
  amount?: string;
}

interface BudgetMeal {
  name: string;
  estimatedCost: string;
  servings: number;
  costPerServing: string;
  ingredients: string[];
  instructions: string;
}

interface LeftoverMeal {
  name: string;
  type: string;
  difficulty: string;
  time: string;
  ingredients: string[];
  instructions: string;
  creativityLevel: string;
}

interface ScanResult {
  ingredients?: Ingredient[];
  leftovers?: Ingredient[];
  totalItems?: number;
  suggestions?: string[];
  budgetMeals?: BudgetMeal[];
  mealIdeas?: LeftoverMeal[];
  totalEstimatedCost?: string;
  savingsTips?: string[];
  storageTips?: string[];
  priorityUse?: string[];
  raw?: string;
}

interface ProScannerProps {
  onClose?: () => void;
  onAddToMealPlan?: (mealName: string) => void;
  onIngredientsScanned?: (ingredients: Ingredient[]) => void;
  onAskChef?: (ingredients: Ingredient[]) => void;
  embedded?: boolean;
}

export default function ProScanner({
  onClose,
  onAddToMealPlan,
  onIngredientsScanned,
  onAskChef,
  embedded = false,
}: ProScannerProps) {
  const [mode, setMode] = useState<ScanMode>('identify');
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [showGuide, setShowGuide] = useState(true);
  const [captureCountdown, setCaptureCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);

  const modeConfig = {
    identify: {
      title: 'Identify Ingredients',
      description: 'AI identifies all food items instantly',
      icon: '🔍',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
    },
    budget: {
      title: 'Budget Meals',
      description: 'Get cost-effective meal suggestions',
      icon: '💰',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      buttonColor: 'bg-green-500 hover:bg-green-600',
    },
    leftovers: {
      title: 'Transform Leftovers',
      description: 'Creative recipes from what you have',
      icon: '♻️',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      buttonColor: 'bg-orange-500 hover:bg-orange-600',
    },
  };

  // Get best available camera with max resolution
  const startCamera = useCallback(async () => {
    try {
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Request highest quality video
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 4096, min: 1920 },
          height: { ideal: 2160, min: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const videoTrack = stream.getVideoTracks()[0];
      trackRef.current = videoTrack;

      // Log actual camera capabilities
      const capabilities = videoTrack.getCapabilities?.();
      const settings = videoTrack.getSettings();
      console.log('Camera capabilities:', capabilities);
      console.log('Camera settings:', settings);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        setCameraReady(true);
        setError(null);
      }

    } catch (err) {
      console.error('Camera error:', err);
      setError('Could not access camera. Please allow camera permissions or upload an image.');
      setCameraActive(false);
      setCameraReady(false);
    }
  }, [cameraFacing]);

  // Apply zoom
  useEffect(() => {
    if (trackRef.current && cameraActive) {
      const capabilities = trackRef.current.getCapabilities?.();
      // @ts-expect-error - Zoom is an advanced constraint
      if (capabilities?.zoom) {
        // @ts-expect-error - Zoom constraint
        const { min, max } = capabilities.zoom;
        const constrainedZoom = Math.max(min, Math.min(max, zoomLevel));
        trackRef.current.applyConstraints({
          // @ts-expect-error - Advanced constraint
          advanced: [{ zoom: constrainedZoom }]
        }).catch(console.warn);
      }
    }
  }, [zoomLevel, cameraActive]);

  // Apply flash/torch
  useEffect(() => {
    if (trackRef.current && cameraActive) {
      const capabilities = trackRef.current.getCapabilities?.();
      // @ts-expect-error - Torch is an advanced constraint
      if (capabilities?.torch) {
        trackRef.current.applyConstraints({
          // @ts-expect-error - Advanced constraint
          advanced: [{ torch: flashEnabled }]
        }).catch(console.warn);
      }
    }
  }, [flashEnabled, cameraActive]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      trackRef.current = null;
    }
    setCameraActive(false);
    setCameraReady(false);
    setFlashEnabled(false);
  }, []);

  const switchCamera = useCallback(() => {
    setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
  }, []);

  // Restart camera when facing changes
  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
  }, [cameraFacing]); // eslint-disable-line react-hooks/exhaustive-deps

  // Capture with countdown for stability
  const captureWithCountdown = useCallback(() => {
    setCaptureCountdown(3);
  }, []);

  useEffect(() => {
    if (captureCountdown === null) return;

    if (captureCountdown > 0) {
      const timer = setTimeout(() => {
        setCaptureCountdown(captureCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Capture!
      capturePhoto();
      setCaptureCountdown(null);
    }
  }, [captureCountdown]); // eslint-disable-line react-hooks/exhaustive-deps

  // High quality capture
  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Use actual video dimensions for max quality
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Apply any image enhancements
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(video, 0, 0);

        // High quality JPEG
        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  // Instant capture (no countdown)
  const captureInstant = useCallback(() => {
    capturePhoto();
  }, [capturePhoto]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Image too large. Please use an image under 10MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setError(null);
      };
      reader.onerror = () => {
        setError('Failed to read image file.');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const scanImage = useCallback(async () => {
    if (!capturedImage) return;

    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/scan-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage, mode }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze image');
      }

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        // Notify parent of scanned ingredients
        const ingredients = data.data.ingredients || data.data.leftovers || [];
        if (ingredients.length > 0 && onIngredientsScanned) {
          onIngredientsScanned(ingredients);
        }
      } else {
        setError(data.error || 'Failed to analyze image');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  }, [capturedImage, mode, onIngredientsScanned]);

  const resetScanner = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
    setZoomLevel(1);
    stopCamera();
  }, [stopCamera]);

  const handleAskChef = useCallback(() => {
    if (result && onAskChef) {
      const ingredients = result.ingredients || result.leftovers || [];
      onAskChef(ingredients);
    }
    if (onClose) onClose();
  }, [result, onAskChef, onClose]);

  const config = modeConfig[mode];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const containerClass = embedded
    ? 'h-full flex flex-col bg-white'
    : 'fixed inset-0 z-50 flex items-center justify-center p-4';

  const contentClass = embedded
    ? 'flex-1 flex flex-col overflow-hidden'
    : 'relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto';

  return (
    <div className={containerClass} onClick={!embedded ? onClose : undefined}>
      {!embedded && <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />}
      <div
        className={contentClass}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 bg-gradient-to-r ${config.color} p-4 ${!embedded ? 'rounded-t-3xl' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{config.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{config.title}</h2>
                <p className="text-white/80 text-sm">{config.description}</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Mode Selector */}
          <div className="flex gap-2 mt-4">
            {(Object.keys(modeConfig) as ScanMode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); resetScanner(); }}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                  mode === m
                    ? 'bg-white text-gray-800 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {modeConfig[m].icon}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Camera/Upload Section */}
          {!capturedImage && !result && (
            <div className="space-y-4">
              {/* Camera Preview */}
              {cameraActive && (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: `scale(${zoomLevel})` }}
                  />

                  {/* Countdown overlay */}
                  {captureCountdown !== null && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-8xl font-bold text-white animate-pulse">
                        {captureCountdown || '📸'}
                      </span>
                    </div>
                  )}

                  {/* Scanning Guide Overlay */}
                  {showGuide && cameraReady && captureCountdown === null && (
                    <div className="absolute inset-4 border-2 border-white/50 rounded-xl pointer-events-none">
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-xl" />
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-xl" />
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-xl" />
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-xl" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center">
                        <p className="text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                          Position food in frame
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Camera Controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {/* Flash toggle */}
                    <button
                      onClick={() => setFlashEnabled(!flashEnabled)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        flashEnabled ? 'bg-yellow-400 text-black' : 'bg-black/50 text-white'
                      }`}
                    >
                      {flashEnabled ? '⚡' : '💡'}
                    </button>

                    {/* Switch camera */}
                    <button
                      onClick={switchCamera}
                      className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white"
                    >
                      🔄
                    </button>

                    {/* Toggle guide */}
                    <button
                      onClick={() => setShowGuide(!showGuide)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        showGuide ? 'bg-white text-black' : 'bg-black/50 text-white'
                      }`}
                    >
                      📐
                    </button>
                  </div>

                  {/* Zoom slider */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                    <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                      {zoomLevel.toFixed(1)}x
                    </span>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="0.1"
                      value={zoomLevel}
                      onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                      className="w-24 h-2 -rotate-90 origin-center"
                      style={{ marginTop: '40px', marginBottom: '40px' }}
                    />
                  </div>

                  {/* Capture buttons */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                    <button
                      onClick={stopCamera}
                      className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg text-gray-700"
                    >
                      ✕
                    </button>
                    <button
                      onClick={captureInstant}
                      disabled={!cameraReady || captureCountdown !== null}
                      className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      <div className={`w-16 h-16 ${config.buttonColor} rounded-full flex items-center justify-center`}>
                        <span className="text-2xl text-white">📸</span>
                      </div>
                    </button>
                    <button
                      onClick={captureWithCountdown}
                      disabled={!cameraReady || captureCountdown !== null}
                      className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg text-gray-700"
                      title="3-second timer"
                    >
                      ⏱️
                    </button>
                  </div>
                </div>
              )}

              {/* Capture Options */}
              {!cameraActive && (
                <div className={`${config.bgColor} rounded-2xl p-8 text-center`}>
                  <div className="text-7xl mb-4">📸</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Pro Scanner</h3>
                  <p className="text-gray-600 mb-6">
                    AI-powered food identification with high-resolution camera
                  </p>

                  <div className="flex flex-col gap-3 max-w-sm mx-auto">
                    <button
                      onClick={startCamera}
                      className={`flex items-center justify-center gap-2 px-6 py-4 ${config.buttonColor} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg`}
                    >
                      📷 Open Camera
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200"
                    >
                      📁 Upload Photo
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Pro Tips */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  ✨ Pro Tips for Best Results
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span>💡</span>
                    <span className="text-gray-600">Good lighting helps AI identify items accurately</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>📐</span>
                    <span className="text-gray-600">Spread items out - avoid stacking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>🏷️</span>
                    <span className="text-gray-600">Show labels when possible</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>🔍</span>
                    <span className="text-gray-600">Use zoom for small items</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Captured Image Preview */}
          {capturedImage && !result && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100">
                <Image
                  src={capturedImage}
                  alt="Captured food"
                  fill
                  className="object-contain"
                  priority
                />
                {isScanning && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-white font-medium">AI is analyzing...</p>
                    <p className="text-white/70 text-sm mt-1">Identifying ingredients</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetScanner}
                  disabled={isScanning}
                  className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  🔄 Retake
                </button>
                <button
                  onClick={scanImage}
                  disabled={isScanning}
                  className={`flex-1 py-3 px-6 ${config.buttonColor} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                >
                  {isScanning ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      {config.icon} Analyze
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-700 flex items-center gap-2">
                <span>⚠️</span> {error}
              </p>
              <button
                onClick={resetScanner}
                className="mt-2 text-sm text-red-600 underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Success Header */}
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  {capturedImage && (
                    <Image src={capturedImage} alt="Scanned" fill className="object-cover" />
                  )}
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-green-800 text-lg">Scan Complete!</p>
                  <p className="text-green-600">
                    Found {result.ingredients?.length || result.leftovers?.length || 0} items
                  </p>
                </div>
                <button
                  onClick={resetScanner}
                  className="px-4 py-2 text-sm font-medium bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  New Scan
                </button>
              </div>

              {/* Identify Mode Results */}
              {mode === 'identify' && result.ingredients && (
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    🥗 Identified Ingredients ({result.ingredients.length})
                  </h3>
                  <div className="grid gap-3">
                    {result.ingredients.map((ing, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">
                            {ing.category === 'produce' ? '🥬' :
                             ing.category === 'protein' ? '🥩' :
                             ing.category === 'dairy' ? '🧀' :
                             ing.category === 'grain' ? '🌾' :
                             ing.category === 'pantry' ? '🥫' : '📦'}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-800">{ing.name}</p>
                            {ing.quantity && (
                              <p className="text-sm text-gray-500">{ing.quantity}</p>
                            )}
                          </div>
                        </div>
                        {ing.freshness && (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            ing.freshness === 'fresh' ? 'bg-green-100 text-green-700' :
                            ing.freshness === 'good' ? 'bg-blue-100 text-blue-700' :
                            ing.freshness === 'use soon' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {ing.freshness}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {result.suggestions && result.suggestions.length > 0 && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <h4 className="font-semibold text-blue-800 mb-2">💡 AI Suggestions</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {result.suggestions.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span>•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Ask AI Chef CTA */}
                  <button
                    onClick={handleAskChef}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <span className="text-2xl">👨‍🍳</span>
                    <span>Ask AI Chef What to Make</span>
                    <span className="text-2xl">→</span>
                  </button>
                </div>
              )}

              {/* Budget Mode Results */}
              {mode === 'budget' && result.budgetMeals && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800">💰 Budget Meals</h3>
                    {result.totalEstimatedCost && (
                      <span className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-full">
                        Total: {result.totalEstimatedCost}
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    {result.budgetMeals.map((meal, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg">{meal.name}</h4>
                            <p className="text-sm text-gray-500">
                              {meal.servings} servings • {meal.costPerServing}/serving
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full">
                            {meal.estimatedCost}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{meal.instructions}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {meal.ingredients.map((ing, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                              {ing}
                            </span>
                          ))}
                        </div>
                        {onAddToMealPlan && (
                          <button
                            onClick={() => onAddToMealPlan(meal.name)}
                            className="w-full py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                          >
                            ➕ Add to Meal Plan
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {result.savingsTips && (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                      <h4 className="font-semibold text-green-800 mb-2">💡 Money-Saving Tips</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        {result.savingsTips.map((tip, idx) => (
                          <li key={idx}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Leftovers Mode Results */}
              {mode === 'leftovers' && result.mealIdeas && (
                <div className="space-y-4">
                  {result.priorityUse && result.priorityUse.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h4 className="font-semibold text-amber-800 mb-2">⚠️ Use First</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.priorityUse.map((item, idx) => (
                          <span key={idx} className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <h3 className="font-bold text-lg text-gray-800">♻️ Meal Ideas</h3>

                  <div className="space-y-4">
                    {result.mealIdeas.map((meal, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-800 text-lg">{meal.name}</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                                {meal.type}
                              </span>
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                {meal.difficulty}
                              </span>
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                ⏱ {meal.time}
                              </span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            meal.creativityLevel === 'fusion' ? 'bg-purple-100 text-purple-700' :
                            meal.creativityLevel === 'creative' ? 'bg-pink-100 text-pink-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {meal.creativityLevel}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{meal.instructions}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {meal.ingredients.map((ing, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                              {ing}
                            </span>
                          ))}
                        </div>
                        {onAddToMealPlan && (
                          <button
                            onClick={() => onAddToMealPlan(meal.name)}
                            className="w-full py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            ➕ Add to Meal Plan
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {result.storageTips && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <h4 className="font-semibold text-blue-800 mb-2">❄️ Storage Tips</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {result.storageTips.map((tip, idx) => (
                          <li key={idx}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Raw Response Fallback */}
              {result.raw && !result.ingredients && !result.budgetMeals && !result.mealIdeas && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Analysis Result</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{result.raw}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hidden Canvas for Capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
