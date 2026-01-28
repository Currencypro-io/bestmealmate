'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import AIChef, { AIChefRef } from '@/components/AIChef';
import ProScanner from '@/components/ProScanner';
import { useFamilyProfile } from '@/hooks/useFamilyProfile';
import { saveMeal } from '@/lib/meal-service';

interface ScannedIngredient {
  name: string;
  quantity?: string;
  category?: string;
}

type ActiveView = 'chef' | 'scanner' | 'family';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['Breakfast', 'Lunch', 'Dinner'];

export default function ChefPageContent() {
  const { data: session } = useSession();
  const [activeView, setActiveView] = useState<ActiveView>('chef');
  const [scannedIngredients, setScannedIngredients] = useState<ScannedIngredient[]>([]);
  const [pendingAutoPrompt, setPendingAutoPrompt] = useState(false);
  const aiChefRef = useRef<AIChefRef>(null);

  // Meal plan modal state
  const [mealToAdd, setMealToAdd] = useState<string | null>(null);
  const [showMealModal, setShowMealModal] = useState(false);
  const {
    profile,
    addMember,
    removeMember,
    saveProfile,
  } = useFamilyProfile();

  // Form state for adding family members
  const [newMember, setNewMember] = useState<{
    name: string;
    role: 'adult' | 'child' | 'teen' | 'senior';
    allergies: string;
    restrictions: string;
    likes: string;
    dislikes: string;
  }>({
    name: '',
    role: 'adult',
    allergies: '',
    restrictions: '',
    likes: '',
    dislikes: '',
  });

  // Load profile when user session changes
  useEffect(() => {
    if (session?.user?.email) {
      // Associate profile with user
      saveProfile({ userId: session.user.email });
    }
  }, [session?.user?.email, saveProfile]);

  const handleAddMember = () => {
    if (!newMember.name.trim()) return;

    addMember({
      name: newMember.name.trim(),
      role: newMember.role,
      allergies: newMember.allergies.split(',').map((s) => s.trim()).filter(Boolean),
      restrictions: newMember.restrictions.split(',').map((s) => s.trim()).filter(Boolean),
      likes: newMember.likes.split(',').map((s) => s.trim()).filter(Boolean),
      dislikes: newMember.dislikes.split(',').map((s) => s.trim()).filter(Boolean),
    });

    // Reset form
    setNewMember({
      name: '',
      role: 'adult',
      allergies: '',
      restrictions: '',
      likes: '',
      dislikes: '',
    });

    // Save to Supabase
    if (session?.user?.email) {
      saveProfile({ userId: session.user.email });
    }
  };

  // Handle scanned ingredients from FoodScanner
  const handleIngredientsScanned = (ingredients: ScannedIngredient[]) => {
    setScannedIngredients((prev) => {
      // Merge new ingredients, avoiding duplicates
      const existingNames = new Set(prev.map((i) => i.name.toLowerCase()));
      const newIngredients = ingredients.filter(
        (i) => !existingNames.has(i.name.toLowerCase())
      );
      return [...prev, ...newIngredients];
    });
    setPendingAutoPrompt(true);
    setActiveView('chef');
  };

  // Auto-prompt AI Chef when switching to chat with new ingredients
  useEffect(() => {
    if (pendingAutoPrompt && activeView === 'chef' && scannedIngredients.length > 0) {
      // Small delay to ensure AIChef is mounted
      const timer = setTimeout(() => {
        if (aiChefRef.current) {
          const ingredientNames = scannedIngredients.map((i) => i.name).join(', ');
          aiChefRef.current.sendMessage(
            `I just scanned these ingredients: ${ingredientNames}. What meals can I make with them?`
          );
        }
        setPendingAutoPrompt(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pendingAutoPrompt, activeView, scannedIngredients]);

  // Handle adding meal to meal plan
  const handleAddToMealPlan = (mealName: string) => {
    setMealToAdd(mealName);
    setShowMealModal(true);
  };

  // Confirm adding meal to a specific day/slot
  const confirmAddMeal = async (day: string, mealType: string) => {
    if (!mealToAdd) return;

    const success = await saveMeal(day, mealType, mealToAdd);
    if (success) {
      // Show success feedback
      alert(`Added "${mealToAdd}" to ${day} ${mealType}!`);
    } else {
      // Fallback: save to localStorage
      const mealPlan = JSON.parse(localStorage.getItem('mealPlan') || '{}');
      if (!mealPlan[day]) mealPlan[day] = {};
      mealPlan[day][mealType] = mealToAdd;
      localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
      alert(`Added "${mealToAdd}" to ${day} ${mealType}!`);
    }

    setShowMealModal(false);
    setMealToAdd(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="mr-2">👨‍🍳</span>
              AI Chef
            </h1>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveView('chef')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeView === 'chef'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="mr-2">💬</span>
            Chat
          </button>
          <button
            onClick={() => setActiveView('scanner')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeView === 'scanner'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="mr-2">📷</span>
            Scanner
          </button>
          <button
            onClick={() => setActiveView('family')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeView === 'family'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="mr-2">👨‍👩‍👧‍👦</span>
            Family
          </button>
        </div>

        {/* Scanned ingredients badge */}
        {scannedIngredients.length > 0 && activeView !== 'chef' && (
          <div className="mt-3 flex items-center gap-2">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              {scannedIngredients.length} ingredients scanned
            </span>
            <button
              onClick={() => setScannedIngredients([])}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
          {activeView === 'chef' && (
            <AIChef
              ref={aiChefRef}
              userId={session?.user?.email || undefined}
              scannedIngredients={scannedIngredients}
            />
          )}

          {activeView === 'scanner' && (
            <ProScanner
              embedded={true}
              onClose={() => setActiveView('chef')}
              onIngredientsScanned={handleIngredientsScanned}
              onAddToMealPlan={handleAddToMealPlan}
              onAskChef={(ingredients) => {
                handleIngredientsScanned(ingredients);
                setActiveView('chef');
              }}
            />
          )}

          {activeView === 'family' && (
            <div className="h-full overflow-y-auto p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Family Profile
              </h2>
              <p className="text-gray-600 mb-6">
                Add family members so ChefBot can remember allergies, preferences, and dietary restrictions.
              </p>

              {/* Add Member Form */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-medium text-gray-800 mb-3">Add Family Member</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value as 'adult' | 'child' | 'teen' | 'senior' })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="adult">Adult</option>
                    <option value="teen">Teen</option>
                    <option value="child">Child</option>
                    <option value="senior">Senior</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Allergies (comma-separated)"
                    value={newMember.allergies}
                    onChange={(e) => setNewMember({ ...newMember, allergies: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Dietary restrictions (comma-separated)"
                    value={newMember.restrictions}
                    onChange={(e) => setNewMember({ ...newMember, restrictions: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Likes (comma-separated)"
                    value={newMember.likes}
                    onChange={(e) => setNewMember({ ...newMember, likes: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="text"
                    placeholder="Dislikes (comma-separated)"
                    value={newMember.dislikes}
                    onChange={(e) => setNewMember({ ...newMember, dislikes: e.target.value })}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <button
                  onClick={handleAddMember}
                  disabled={!newMember.name.trim()}
                  className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Member
                </button>
              </div>

              {/* Family Members List */}
              {profile && profile.members.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-800">Family Members</h3>
                  {profile.members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {member.name}
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {member.role}
                            </span>
                          </h4>
                          {member.allergies.length > 0 && (
                            <p className="text-sm text-red-600 mt-1">
                              <span className="font-medium">Allergies:</span>{' '}
                              {member.allergies.join(', ')}
                            </p>
                          )}
                          {member.restrictions.length > 0 && (
                            <p className="text-sm text-orange-600 mt-1">
                              <span className="font-medium">Restrictions:</span>{' '}
                              {member.restrictions.join(', ')}
                            </p>
                          )}
                          {member.dislikes.length > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Dislikes:</span>{' '}
                              {member.dislikes.join(', ')}
                            </p>
                          )}
                          {member.likes.length > 0 && (
                            <p className="text-sm text-green-600 mt-1">
                              <span className="font-medium">Likes:</span>{' '}
                              {member.likes.join(', ')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeMember(member.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">👨‍👩‍👧‍👦</div>
                  <p>No family members added yet.</p>
                  <p className="text-sm mt-1">
                    Add family members above to help ChefBot personalize recommendations.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add to Meal Plan Modal */}
      {showMealModal && mealToAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Add to Meal Plan</h3>
                <button
                  onClick={() => {
                    setShowMealModal(false);
                    setMealToAdd(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Adding: <span className="font-medium text-orange-600">{mealToAdd}</span>
              </p>
            </div>

            <div className="p-4 space-y-4">
              {DAYS.map((day) => (
                <div key={day} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 font-medium text-gray-700">{day}</div>
                  <div className="grid grid-cols-3 gap-1 p-2">
                    {MEALS.map((meal) => (
                      <button
                        key={`${day}-${meal}`}
                        onClick={() => confirmAddMeal(day, meal)}
                        className="py-2 px-3 text-sm text-gray-600 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
                      >
                        {meal}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
