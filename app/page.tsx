'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['Breakfast', 'Lunch', 'Dinner'];

// Food images for meal types
const MEAL_IMAGES: Record<string, string> = {
  Breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
  Lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
  Dinner: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
};

// Hero images
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=1200&h=600&fit=crop',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
];

// Toast notification component with microinteraction
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

  return (
    <div 
      className={`toast-enter fixed bottom-6 left-1/2 -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-50`}
      role="alert"
      aria-live="polite"
    >
      <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">{icon}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
}

// Loading skeleton for images
function ImageSkeleton() {
  return <div className="skeleton absolute inset-0" />;
}

// Progress bar showing meal plan completion
function ProgressBar({ filled, total }: { filled: number; total: number }) {
  const percentage = Math.round((filled / total) * 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
      <div 
        className="progress-bar bg-gradient-to-r from-orange-400 to-amber-400 h-full rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export default function Home() {
  const [mealPlan, setMealPlan] = useState<Record<string, Record<string, string>>>({});
  const [currentDay, setCurrentDay] = useState('Monday');
  const [currentMeal, setCurrentMeal] = useState('Breakfast');
  const [mealInput, setMealInput] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
  const [inputError, setInputError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Simulate loading state for realistic feel
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Load saved meal plan from localStorage (persistence)
  useEffect(() => {
    const saved = localStorage.getItem('mealPlan');
    if (saved) {
      try {
        setMealPlan(JSON.parse(saved));
      } catch {
        console.error('Failed to load saved meal plan');
      }
    }
  }, []);

  // Save meal plan to localStorage
  useEffect(() => {
    if (Object.keys(mealPlan).length > 0) {
      localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
    }
  }, [mealPlan]);

  // Calculate progress
  const totalSlots = DAYS.length * MEALS.length;
  const filledSlots = Object.values(mealPlan).reduce((acc, day) => acc + Object.keys(day).length, 0);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  }, []);

  const addMeal = useCallback(() => {
    if (!mealInput.trim()) {
      setInputError(true);
      showToast('Please enter a meal name', 'error');
      // Shake animation triggers via inputError state
      setTimeout(() => setInputError(false), 500);
      inputRef.current?.focus();
      return;
    }
    
    setMealPlan(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        [currentMeal]: mealInput
      }
    }));
    
    // Microinteraction feedback
    setRecentlyAdded(`${currentDay}-${currentMeal}`);
    setTimeout(() => setRecentlyAdded(null), 600);
    
    showToast(`${currentMeal} added to ${currentDay}!`, 'success');
    setMealInput('');
    
    // Haptic feedback on supported devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [mealInput, currentDay, currentMeal, showToast]);

  const removeMeal = useCallback((day: string, meal: string) => {
    setMealPlan(prev => {
      const newPlan = { ...prev };
      if (newPlan[day]) {
        delete newPlan[day][meal];
        if (Object.keys(newPlan[day]).length === 0) {
          delete newPlan[day];
        }
      }
      return newPlan;
    });
    showToast('Meal removed', 'info');
    
    if (navigator.vibrate) {
      navigator.vibrate([30, 30]);
    }
  }, [showToast]);

  const clearAllMeals = useCallback(() => {
    if (confirm('Are you sure you want to clear all meals?')) {
      setMealPlan({});
      localStorage.removeItem('mealPlan');
      showToast('All meals cleared', 'info');
    }
  }, [showToast]);

  const getMeal = (day: string, meal: string) => {
    return mealPlan[day]?.[meal] || '';
  };

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          showToast('Meal plan saved automatically', 'success');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link focus-ring">
        Skip to main content
      </a>

      {/* Toast notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Hero Section with Family Image */}
      <header className="relative h-64 md:h-80 overflow-hidden" role="banner">
        {isLoading ? (
          <ImageSkeleton />
        ) : (
          <Image
            src={HERO_IMAGES[0]}
            alt="Delicious family meal spread with various dishes on a wooden table"
            fill
            className="object-cover transition-opacity duration-500"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold text-center drop-shadow-lg animate-slide-up">
            🍽️ Family Meal Planner
          </h1>
          <p className="mt-3 text-lg md:text-xl text-center opacity-90 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Plan delicious meals for the whole family
          </p>
          {/* Progress indicator */}
          <div className="mt-6 w-64 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between text-sm mb-2 opacity-90">
              <span>Weekly Progress</span>
              <span>{filledSlots}/{totalSlots} meals</span>
            </div>
            <ProgressBar filled={filledSlots} total={totalSlots} />
          </div>
        </div>
      </header>

      {/* Meal Type Cards Section */}
      <section className="max-w-6xl mx-auto px-4 py-8" aria-label="Meal categories">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {MEALS.map((mealType, index) => (
            <button
              key={mealType}
              onClick={() => {
                setCurrentMeal(mealType);
                inputRef.current?.focus();
              }}
              className={`card-lift bg-white rounded-2xl shadow-lg overflow-hidden text-left transition-all focus-ring ${
                currentMeal === mealType ? 'ring-4 ring-orange-400 ring-offset-2' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              aria-pressed={currentMeal === mealType}
            >
              <div className="relative h-48">
                {isLoading ? (
                  <ImageSkeleton />
                ) : (
                  <Image 
                    src={MEAL_IMAGES[mealType]} 
                    alt={`${mealType} - delicious ${mealType.toLowerCase()} options`} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    {mealType === 'Breakfast' ? '🌅' : mealType === 'Lunch' ? '☀️' : '🌙'} {mealType}
                    {currentMeal === mealType && <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full">Selected</span>}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {mealType === 'Breakfast' ? 'Start the day right' : mealType === 'Lunch' ? 'Fuel your afternoon' : 'Gather together'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main id="main-content" ref={mainContentRef} className="grid md:grid-cols-3 gap-8">
          {/* Add Meal Form */}
          <section className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-orange-400" aria-labelledby="add-meal-heading">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md">
                <Image src={HERO_IMAGES[1]} alt="" fill className="object-cover" aria-hidden="true" />
              </div>
              <div>
                <h2 id="add-meal-heading" className="text-xl font-bold text-gray-800">Add Meal</h2>
                <p className="text-sm text-gray-500">Plan your family favorites</p>
              </div>
            </div>
            <form 
              onSubmit={(e) => { e.preventDefault(); addMeal(); }}
              className="space-y-4"
              aria-label="Add meal form"
            >
              <div>
                <label htmlFor="day-select" className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Day
                </label>
                <select 
                  id="day-select"
                  value={currentDay} 
                  onChange={(e) => setCurrentDay(e.target.value)} 
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 input-glow focus-ring transition-all cursor-pointer"
                >
                  {DAYS.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="meal-select" className="block text-sm font-semibold text-gray-700 mb-2">
                  🍴 Meal Type
                </label>
                <select 
                  id="meal-select"
                  value={currentMeal} 
                  onChange={(e) => setCurrentMeal(e.target.value)} 
                  className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 input-glow focus-ring transition-all cursor-pointer"
                >
                  {MEALS.map(meal => (
                    <option key={meal} value={meal}>{meal}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="meal-input" className="block text-sm font-semibold text-gray-700 mb-2">
                  ✨ Meal Name
                </label>
                <input 
                  ref={inputRef}
                  id="meal-input"
                  type="text" 
                  value={mealInput} 
                  onChange={(e) => setMealInput(e.target.value)}
                  placeholder="e.g., Mom's Spaghetti 🍝" 
                  className={`w-full p-3 border rounded-xl bg-gray-50 input-glow focus-ring transition-all ${
                    inputError ? 'animate-shake border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                  aria-describedby="meal-input-hint"
                  aria-invalid={inputError}
                />
                <p id="meal-input-hint" className="text-xs text-gray-400 mt-1">
                  Press Enter or click button to add
                </p>
              </div>
              <button 
                type="submit"
                className="btn-press ripple w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all focus-ring"
              >
                Add to Plan 🎯
              </button>
            </form>

            {/* Quick actions */}
            {filledSlots > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={clearAllMeals}
                  className="text-sm text-gray-400 hover:text-red-500 transition-colors focus-ring rounded px-2 py-1"
                  aria-label="Clear all meals from the plan"
                >
                  🗑️ Clear all meals
                </button>
              </div>
            )}
          </section>

          {/* Weekly Plan */}
          <section className="md:col-span-2 bg-white p-6 rounded-2xl shadow-lg border-t-4 border-amber-400" aria-labelledby="weekly-plan-heading">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-md">
                  <Image src={HERO_IMAGES[2]} alt="" fill className="object-cover" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="weekly-plan-heading" className="text-xl font-bold text-gray-800">Your Weekly Plan</h2>
                  <p className="text-sm text-gray-500">Meals for the whole family</p>
                </div>
              </div>
              {/* Mobile swipe hint */}
              <span className="md:hidden text-gray-400 text-sm swipe-hint">← Swipe →</span>
            </div>
            
            <div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2 scroll-smooth"
              role="list"
              aria-label="Weekly meal plan"
            >
              {DAYS.map((day, index) => (
                <article 
                  key={day} 
                  className="animate-slide-up bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100 card-lift"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  role="listitem"
                >
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
                    <span 
                      className="w-8 h-8 bg-orange-400 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    {day}
                  </h3>
                  <div className="space-y-2" role="list" aria-label={`Meals for ${day}`}>
                    {MEALS.map(meal => {
                      const mealValue = getMeal(day, meal);
                      const isRecent = recentlyAdded === `${day}-${meal}`;
                      return (
                        <div 
                          key={meal} 
                          className={`group bg-white/80 rounded-lg p-2 text-sm transition-all ${
                            isRecent ? 'animate-success ring-2 ring-green-400' : ''
                          } ${mealValue ? 'hover:bg-white hover:shadow-sm' : ''}`}
                          role="listitem"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <span className="font-semibold text-orange-600">
                                {meal === 'Breakfast' ? '🌅' : meal === 'Lunch' ? '☀️' : '🌙'} {meal}:
                              </span>
                              <span className={`ml-1 ${mealValue ? 'text-gray-700' : 'text-gray-400'} truncate`}>
                                {mealValue || '—'}
                              </span>
                            </div>
                            {mealValue && (
                              <button
                                onClick={() => removeMeal(day, meal)}
                                className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-red-500 transition-all focus-ring rounded"
                                aria-label={`Remove ${meal} from ${day}`}
                                title="Remove meal"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        {/* Footer with Tips */}
        <footer className="mt-10 bg-white rounded-2xl shadow-lg p-6" role="contentinfo">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Family Meal Tips</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors">
              <span className="text-2xl" aria-hidden="true">👨‍👩‍👧‍👦</span>
              <p><strong>Involve everyone</strong> — Let kids pick one meal per week to make planning fun!</p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors">
              <span className="text-2xl" aria-hidden="true">🥗</span>
              <p><strong>Balance nutrition</strong> — Include veggies, protein, and whole grains in each meal.</p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-orange-50 transition-colors">
              <span className="text-2xl" aria-hidden="true">🛒</span>
              <p><strong>Prep ahead</strong> — Plan Sunday for easy grocery shopping and meal prep.</p>
            </div>
          </div>
          
          {/* Keyboard shortcuts help */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
            <p>💾 Your meals are saved automatically • ⌨️ Press Enter to quickly add meals</p>
          </div>
        </footer>
      </section>
    </div>
  );
}
