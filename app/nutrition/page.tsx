'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// Recipe nutrition data (simplified - in production would come from API)
const RECIPE_NUTRITION: Record<string, { calories: number; protein: number; carbs: number; fat: number; fiber: number }> = {
  'Avocado Toast': { calories: 320, protein: 6, carbs: 28, fat: 22, fiber: 8 },
  'Overnight Oats': { calories: 380, protein: 14, carbs: 52, fat: 10, fiber: 8 },
  'Veggie Omelet': { calories: 290, protein: 21, carbs: 4, fat: 22, fiber: 1 },
  'Smoothie Bowl': { calories: 350, protein: 6, carbs: 58, fat: 12, fiber: 9 },
  'Pancakes': { calories: 420, protein: 12, carbs: 68, fat: 12, fiber: 2 },
  'Greek Yogurt Parfait': { calories: 280, protein: 18, carbs: 36, fat: 8, fiber: 4 },
  'Caesar Salad': { calories: 380, protein: 12, carbs: 18, fat: 30, fiber: 4 },
  'Turkey Sandwich': { calories: 450, protein: 28, carbs: 42, fat: 18, fiber: 3 },
  'Vegetable Soup': { calories: 180, protein: 6, carbs: 28, fat: 4, fiber: 6 },
  'Quinoa Bowl': { calories: 420, protein: 14, carbs: 56, fat: 16, fiber: 8 },
  'Grilled Chicken Salad': { calories: 350, protein: 32, carbs: 12, fat: 20, fiber: 4 },
  'Pasta Primavera': { calories: 480, protein: 14, carbs: 72, fat: 14, fiber: 6 },
  'Grilled Salmon': { calories: 420, protein: 38, carbs: 8, fat: 26, fiber: 2 },
  'Beef Stir-Fry': { calories: 450, protein: 32, carbs: 28, fat: 24, fiber: 4 },
  'Vegetable Curry': { calories: 380, protein: 10, carbs: 48, fat: 18, fiber: 8 },
  'Tacos': { calories: 520, protein: 24, carbs: 42, fat: 28, fiber: 6 },
  'Pizza': { calories: 680, protein: 26, carbs: 76, fat: 32, fiber: 4 },
  'Spaghetti Bolognese': { calories: 580, protein: 28, carbs: 68, fat: 22, fiber: 4 },
  'Chicken Stir-Fry': { calories: 380, protein: 32, carbs: 24, fat: 18, fiber: 4 },
  'Fish Tacos': { calories: 420, protein: 26, carbs: 38, fat: 20, fiber: 4 },
  'Burrito Bowl': { calories: 550, protein: 28, carbs: 62, fat: 22, fiber: 12 },
  'Pad Thai': { calories: 520, protein: 20, carbs: 64, fat: 22, fiber: 4 },
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['Breakfast', 'Lunch', 'Dinner'];

// Daily recommended values
const DAILY_TARGETS = {
  calories: 2000,
  protein: 50, // grams
  carbs: 275, // grams
  fat: 65, // grams
  fiber: 28, // grams
};

type MealPlan = Record<string, Record<string, string>>;

export default function NutritionPage() {
  const [mealPlan, setMealPlan] = useState<MealPlan>({});
  const [selectedDay, setSelectedDay] = useState<string | 'week'>('week');

  // Load meal plan from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mealPlan');
    if (saved) {
      setMealPlan(JSON.parse(saved));
    }
  }, []);

  // Calculate nutrition for a specific day
  const getDayNutrition = (day: string) => {
    const dayMeals = mealPlan[day] || {};
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    Object.values(dayMeals).forEach((meal) => {
      const nutrition = RECIPE_NUTRITION[meal];
      if (nutrition) {
        totals.calories += nutrition.calories;
        totals.protein += nutrition.protein;
        totals.carbs += nutrition.carbs;
        totals.fat += nutrition.fat;
        totals.fiber += nutrition.fiber;
      }
    });

    return totals;
  };

  // Calculate weekly totals
  const weeklyTotals = useMemo(() => {
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    DAYS.forEach((day) => {
      const dayNutrition = getDayNutrition(day);
      totals.calories += dayNutrition.calories;
      totals.protein += dayNutrition.protein;
      totals.carbs += dayNutrition.carbs;
      totals.fat += dayNutrition.fat;
      totals.fiber += dayNutrition.fiber;
    });
    return totals;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealPlan]);

  // Calculate daily averages
  const dailyAverages = useMemo(() => {
    const plannedDays = DAYS.filter((day) => Object.keys(mealPlan[day] || {}).length > 0).length;
    if (plannedDays === 0) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

    return {
      calories: Math.round(weeklyTotals.calories / plannedDays),
      protein: Math.round(weeklyTotals.protein / plannedDays),
      carbs: Math.round(weeklyTotals.carbs / plannedDays),
      fat: Math.round(weeklyTotals.fat / plannedDays),
      fiber: Math.round(weeklyTotals.fiber / plannedDays),
    };
  }, [weeklyTotals, mealPlan]);

  // Get percentage of daily target
  const getPercentage = (value: number, target: number) => {
    return Math.min(Math.round((value / target) * 100), 150);
  };

  // Color based on percentage (green = good, yellow = under, red = over)
  const getColor = (percentage: number) => {
    if (percentage < 70) return 'bg-yellow-400';
    if (percentage > 110) return 'bg-red-400';
    return 'bg-green-400';
  };

  const displayData = selectedDay === 'week' ? dailyAverages : getDayNutrition(selectedDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">
                <span className="mr-2">📊</span>
                Nutrition Dashboard
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Day Selector */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDay('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDay === 'week'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Weekly Avg
            </button>
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                  selectedDay === day
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {/* Calories */}
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <div className="text-3xl font-bold text-orange-500">{displayData.calories}</div>
            <div className="text-sm text-gray-500">Calories</div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${getColor(getPercentage(displayData.calories, DAILY_TARGETS.calories))}`}
                style={{ width: `${Math.min(getPercentage(displayData.calories, DAILY_TARGETS.calories), 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {getPercentage(displayData.calories, DAILY_TARGETS.calories)}% of {DAILY_TARGETS.calories}
            </div>
          </div>

          {/* Protein */}
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <div className="text-3xl font-bold text-blue-500">{displayData.protein}g</div>
            <div className="text-sm text-gray-500">Protein</div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${getColor(getPercentage(displayData.protein, DAILY_TARGETS.protein))}`}
                style={{ width: `${Math.min(getPercentage(displayData.protein, DAILY_TARGETS.protein), 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {getPercentage(displayData.protein, DAILY_TARGETS.protein)}% of {DAILY_TARGETS.protein}g
            </div>
          </div>

          {/* Carbs */}
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <div className="text-3xl font-bold text-yellow-500">{displayData.carbs}g</div>
            <div className="text-sm text-gray-500">Carbs</div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${getColor(getPercentage(displayData.carbs, DAILY_TARGETS.carbs))}`}
                style={{ width: `${Math.min(getPercentage(displayData.carbs, DAILY_TARGETS.carbs), 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {getPercentage(displayData.carbs, DAILY_TARGETS.carbs)}% of {DAILY_TARGETS.carbs}g
            </div>
          </div>

          {/* Fat */}
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <div className="text-3xl font-bold text-red-500">{displayData.fat}g</div>
            <div className="text-sm text-gray-500">Fat</div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${getColor(getPercentage(displayData.fat, DAILY_TARGETS.fat))}`}
                style={{ width: `${Math.min(getPercentage(displayData.fat, DAILY_TARGETS.fat), 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {getPercentage(displayData.fat, DAILY_TARGETS.fat)}% of {DAILY_TARGETS.fat}g
            </div>
          </div>

          {/* Fiber */}
          <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
            <div className="text-3xl font-bold text-green-500">{displayData.fiber}g</div>
            <div className="text-sm text-gray-500">Fiber</div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${getColor(getPercentage(displayData.fiber, DAILY_TARGETS.fiber))}`}
                style={{ width: `${Math.min(getPercentage(displayData.fiber, DAILY_TARGETS.fiber), 100)}%` }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {getPercentage(displayData.fiber, DAILY_TARGETS.fiber)}% of {DAILY_TARGETS.fiber}g
            </div>
          </div>
        </div>

        {/* Macro Breakdown Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Macro Breakdown</h2>
          <div className="flex items-center justify-center gap-8">
            {/* Pie Chart Visualization */}
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="20" />

                {/* Calculate stroke dasharray for each macro */}
                {(() => {
                  const totalMacros = displayData.protein + displayData.carbs + displayData.fat;
                  if (totalMacros === 0) return null;

                  const circumference = 2 * Math.PI * 40;
                  const proteinPct = displayData.protein / totalMacros;
                  const carbsPct = displayData.carbs / totalMacros;
                  const fatPct = displayData.fat / totalMacros;

                  const proteinDash = circumference * proteinPct;
                  const carbsDash = circumference * carbsPct;
                  const fatDash = circumference * fatPct;

                  let offset = 0;

                  return (
                    <>
                      {/* Protein */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="20"
                        strokeDasharray={`${proteinDash} ${circumference - proteinDash}`}
                        strokeDashoffset={-offset}
                      />
                      {/* Carbs */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#EAB308"
                        strokeWidth="20"
                        strokeDasharray={`${carbsDash} ${circumference - carbsDash}`}
                        strokeDashoffset={-(offset += proteinDash)}
                      />
                      {/* Fat */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="20"
                        strokeDasharray={`${fatDash} ${circumference - fatDash}`}
                        strokeDashoffset={-(offset += carbsDash)}
                      />
                    </>
                  );
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{displayData.calories}</div>
                  <div className="text-xs text-gray-500">cal</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <div>
                  <div className="font-medium text-gray-800">Protein</div>
                  <div className="text-sm text-gray-500">
                    {displayData.protein}g ({displayData.protein + displayData.carbs + displayData.fat > 0
                      ? Math.round((displayData.protein / (displayData.protein + displayData.carbs + displayData.fat)) * 100)
                      : 0}%)
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                <div>
                  <div className="font-medium text-gray-800">Carbs</div>
                  <div className="text-sm text-gray-500">
                    {displayData.carbs}g ({displayData.protein + displayData.carbs + displayData.fat > 0
                      ? Math.round((displayData.carbs / (displayData.protein + displayData.carbs + displayData.fat)) * 100)
                      : 0}%)
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <div>
                  <div className="font-medium text-gray-800">Fat</div>
                  <div className="text-sm text-gray-500">
                    {displayData.fat}g ({displayData.protein + displayData.carbs + displayData.fat > 0
                      ? Math.round((displayData.fat / (displayData.protein + displayData.carbs + displayData.fat)) * 100)
                      : 0}%)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Weekly Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-3 font-medium">Day</th>
                  <th className="pb-3 font-medium text-center">Calories</th>
                  <th className="pb-3 font-medium text-center">Protein</th>
                  <th className="pb-3 font-medium text-center">Carbs</th>
                  <th className="pb-3 font-medium text-center">Fat</th>
                  <th className="pb-3 font-medium text-center">Meals</th>
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => {
                  const dayNutrition = getDayNutrition(day);
                  const mealsCount = Object.keys(mealPlan[day] || {}).length;
                  return (
                    <tr key={day} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 font-medium text-gray-800">{day}</td>
                      <td className="py-3 text-center">
                        <span className={dayNutrition.calories > 0 ? 'text-orange-500 font-medium' : 'text-gray-300'}>
                          {dayNutrition.calories || '-'}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={dayNutrition.protein > 0 ? 'text-blue-500' : 'text-gray-300'}>
                          {dayNutrition.protein || '-'}g
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={dayNutrition.carbs > 0 ? 'text-yellow-500' : 'text-gray-300'}>
                          {dayNutrition.carbs || '-'}g
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={dayNutrition.fat > 0 ? 'text-red-500' : 'text-gray-300'}>
                          {dayNutrition.fat || '-'}g
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          mealsCount === 3 ? 'bg-green-100 text-green-700' :
                          mealsCount > 0 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {mealsCount}/3
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="font-bold">
                  <td className="pt-4 text-gray-800">Weekly Total</td>
                  <td className="pt-4 text-center text-orange-500">{weeklyTotals.calories}</td>
                  <td className="pt-4 text-center text-blue-500">{weeklyTotals.protein}g</td>
                  <td className="pt-4 text-center text-yellow-500">{weeklyTotals.carbs}g</td>
                  <td className="pt-4 text-center text-red-500">{weeklyTotals.fat}g</td>
                  <td className="pt-4 text-center text-gray-500">
                    {DAYS.reduce((sum, day) => sum + Object.keys(mealPlan[day] || {}).length, 0)}/21
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Meal Details for Selected Day */}
        {selectedDay !== 'week' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{selectedDay} Meals</h2>
            <div className="space-y-3">
              {MEALS.map((mealType) => {
                const meal = mealPlan[selectedDay]?.[mealType];
                const nutrition = meal ? RECIPE_NUTRITION[meal] : null;
                return (
                  <div key={mealType} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="text-sm text-gray-500">{mealType}</div>
                      <div className="font-medium text-gray-800">{meal || 'Not planned'}</div>
                    </div>
                    {nutrition ? (
                      <div className="flex gap-4 text-sm">
                        <span className="text-orange-500">{nutrition.calories} cal</span>
                        <span className="text-blue-500">{nutrition.protein}g P</span>
                        <span className="text-yellow-500">{nutrition.carbs}g C</span>
                        <span className="text-red-500">{nutrition.fat}g F</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-2">Nutrition Tips</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Aim for 0.8-1g of protein per pound of body weight for muscle maintenance</li>
            <li>• Fill half your plate with vegetables for fiber and micronutrients</li>
            <li>• Stay hydrated - drink at least 8 glasses of water daily</li>
            <li>• Balance your macros based on your activity level and goals</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
