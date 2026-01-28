'use client';

import { useState, useRef, useCallback } from 'react';
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

interface FoodScannerProps {
  onClose: () => void;
  onAddToMealPlan?: (mealName: string) => void;
  onIngredientsScanned?: (ingredients: Ingredient[]) => void;
}

export default function FoodScanner({ onClose, onAddToMealPlan, onIngredientsScanned }: FoodScannerProps) {
  const [mode, setMode] = useState<ScanMode>('identify');
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const modeConfig = {
    identify: {
      title: 'Identify Ingredients',
      description: 'Scan food items to identify ingredients and get storage tips',
      icon: '🔍',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    budget: {
      title: 'Budget Meal Planner',
      description: 'Scan ingredients and get budget-friendly meal suggestions',
      icon: '💰',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
    },
    leftovers: {
      title: 'Leftover Transformer',
      description: 'Turn leftovers into delicious new meals',
      icon: '♻️',
      color: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
    },
  };

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setError(null);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Could not access camera. Please allow camera permissions or upload an image.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setError(null);
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
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        // Notify parent of scanned ingredients
        if (onIngredientsScanned && data.data) {
          const ingredients = data.data.ingredients || data.data.leftovers || [];
          if (ingredients.length > 0) {
            onIngredientsScanned(ingredients);
          }
        }
      } else {
        setError(data.error || 'Failed to analyze image');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  }, [capturedImage, mode, onIngredientsScanned]);

  const resetScanner = useCallback(() => {
    setCapturedImage(null);
    setResult(null);
    setError(null);
    stopCamera();
  }, [stopCamera]);

  const config = modeConfig[mode];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 bg-gradient-to-r ${config.color} p-6 rounded-t-3xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{config.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{config.title}</h2>
                <p className="text-white/80 text-sm">{config.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
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
                {modeConfig[m].icon} {modeConfig[m].title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Camera/Upload Section */}
          {!capturedImage && !result && (
            <div className="space-y-4">
              {/* Camera Preview */}
              {cameraActive && (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                    <button
                      onClick={capturePhoto}
                      className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                    >
                      <div className="w-12 h-12 bg-red-500 rounded-full" />
                    </button>
                    <button
                      onClick={stopCamera}
                      className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
                    >
                      ✕
                    </button>
                  </div>
                  {/* Scanning Guide Overlay */}
                  <div className="absolute inset-4 border-2 border-white/50 rounded-xl pointer-events-none">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
                  </div>
                </div>
              )}

              {/* Capture Options */}
              {!cameraActive && (
                <div className={`${config.bgColor} rounded-2xl p-8 text-center`}>
                  <div className="text-6xl mb-4">📸</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Capture Your Food</h3>
                  <p className="text-gray-600 mb-6">Take a photo or upload an image of your ingredients</p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={startCamera}
                      className={`flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${config.color} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all`}
                    >
                      📷 Use Camera
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-200"
                    >
                      📁 Upload Image
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Tips */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  💡 Tips for Best Results
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ensure good lighting for clearer identification</li>
                  <li>• Spread items out so they&apos;re visible</li>
                  <li>• Include packaging labels when possible</li>
                  <li>• Get close enough to see details</li>
                </ul>
              </div>
            </div>
          )}

          {/* Captured Image Preview */}
          {capturedImage && !result && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <Image
                  src={capturedImage}
                  alt="Captured food"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={resetScanner}
                  className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  🔄 Retake
                </button>
                <button
                  onClick={scanImage}
                  disabled={isScanning}
                  className={`flex-1 py-3 px-6 bg-gradient-to-r ${config.color} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                >
                  {isScanning ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      {config.icon} Scan Now
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
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Image Thumbnail */}
              {capturedImage && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={capturedImage} alt="Scanned" fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">Scan Complete!</p>
                    <p className="text-sm text-gray-500">
                      Found {result.ingredients?.length || result.leftovers?.length || 0} items
                    </p>
                  </div>
                  <button
                    onClick={resetScanner}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Scan Again
                  </button>
                </div>
              )}

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
                        className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {ing.category === 'produce' ? '🥬' :
                             ing.category === 'protein' ? '🥩' :
                             ing.category === 'dairy' ? '🧀' :
                             ing.category === 'grain' ? '🌾' : '📦'}
                          </span>
                          <div>
                            <p className="font-medium text-gray-800">{ing.name}</p>
                            <p className="text-sm text-gray-500">{ing.quantity}</p>
                          </div>
                        </div>
                        {ing.freshness && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">💡 Suggestions</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {result.suggestions.map((tip, idx) => (
                          <li key={idx}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Ask AI Chef Button */}
                  <button
                    onClick={() => {
                      if (onIngredientsScanned && result.ingredients) {
                        onIngredientsScanned(result.ingredients);
                      }
                      onClose();
                    }}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <span>👨‍🍳</span>
                    <span>Ask AI Chef what to make</span>
                  </button>
                </div>
              )}

              {/* Budget Mode Results */}
              {mode === 'budget' && result.budgetMeals && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                      💰 Budget Meals
                    </h3>
                    {result.totalEstimatedCost && (
                      <span className="px-4 py-2 bg-green-100 text-green-700 font-bold rounded-full">
                        Total: {result.totalEstimatedCost}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-4">
                    {result.budgetMeals.map((meal, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white border border-gray-100 rounded-xl hover:border-green-200 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-800">{meal.name}</h4>
                            <p className="text-sm text-gray-500">
                              {meal.servings} servings • {meal.costPerServing}/serving
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">
                            {meal.estimatedCost}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{meal.instructions}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {meal.ingredients.map((ing, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {ing}
                            </span>
                          ))}
                        </div>
                        {onAddToMealPlan && (
                          <button
                            onClick={() => onAddToMealPlan(meal.name)}
                            className="w-full py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            ➕ Add to Meal Plan
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {result.savingsTips && result.savingsTips.length > 0 && (
                    <div className="bg-green-50 rounded-xl p-4">
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
                  {/* Priority Items */}
                  {result.priorityUse && result.priorityUse.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h4 className="font-semibold text-amber-800 mb-2">⚠️ Use First</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.priorityUse.map((item, idx) => (
                          <span key={idx} className="px-3 py-1 bg-amber-200 text-amber-800 rounded-full text-sm font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    ♻️ Meal Ideas from Leftovers
                  </h3>

                  <div className="grid gap-4">
                    {result.mealIdeas.map((meal, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white border border-gray-100 rounded-xl hover:border-orange-200 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-800">{meal.name}</h4>
                            <div className="flex gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
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
                        <p className="text-sm text-gray-600 mb-3">{meal.instructions}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {meal.ingredients.map((ing, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {ing}
                            </span>
                          ))}
                        </div>
                        {onAddToMealPlan && (
                          <button
                            onClick={() => onAddToMealPlan(meal.name)}
                            className="w-full py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors text-sm"
                          >
                            ➕ Add to Meal Plan
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {result.storageTips && result.storageTips.length > 0 && (
                    <div className="bg-blue-50 rounded-xl p-4">
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
              {result.raw && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Analysis Result</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{result.raw}</p>
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
