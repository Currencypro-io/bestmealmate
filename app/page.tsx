'use client';

import { useState } from 'react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['Breakfast', 'Lunch', 'Dinner'];

export default function Home() {
  const [mealPlan, setMealPlan] = useState<Record<string, Record<string, string>>>({});
  const [currentDay, setCurrentDay] = useState('Monday');
  const [currentMeal, setCurrentMeal] = useState('Breakfast');
  const [mealInput, setMealInput] = useState('');

  const addMeal = () => {
    if (!mealInput.trim()) return;
    setMealPlan(prev => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        [currentMeal]: mealInput
      }
    }));
    setMealInput('');
  };

  const getMeal = (day: string, meal: string) => {
    return mealPlan[day]?.[meal] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">🍽️ Weekly Meal Planner</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Add Meal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Day</label>
                <select value={currentDay} onChange={(e) => setCurrentDay(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg">
                  {DAYS.map(day => (<option key={day} value={day}>{day}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Type</label>
                <select value={currentMeal} onChange={(e) => setCurrentMeal(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg">
                  {MEALS.map(meal => (<option key={meal} value={meal}>{meal}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Name</label>
                <input type="text" value={mealInput} onChange={(e) => setMealInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addMeal()} placeholder="e.g., Spaghetti Carbonara" className="w-full p-2 border border-gray-300 rounded-lg" />
              </div>
              <button onClick={addMeal} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg">Add Meal</button>
            </div>
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Your Weekly Plan</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {DAYS.map(day => (
                <div key={day} className="border-l-4 border-indigo-600 pl-4">
                  <h3 className="font-bold text-gray-800">{day}</h3>
                  <div className="text-sm text-gray-600 space-y-1 mt-2">
                    {MEALS.map(meal => (<div key={meal}><span className="font-semibold text-gray-700">{meal}:</span> {getMeal(day, meal) || '—'}</div>))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
