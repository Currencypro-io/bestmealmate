'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Ingredient {
  item: string;
  amount: string;
  calories?: number;
}

interface Recipe {
  id?: string;
  user_id?: string;
  name: string;
  description?: string;
  image_url?: string;
  prep_time?: string;
  cook_time?: string;
  servings?: number;
  calories?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  ingredients?: Ingredient[];
  prep_steps?: string[];
  cooking_steps?: string[];
  nutrition?: { protein?: number; carbs?: number; fat?: number; fiber?: number };
  is_public?: boolean;
  isBuiltIn?: boolean;
}

// Built-in recipes (simplified for display)
const BUILT_IN_RECIPES: Recipe[] = [
  {
    name: 'Avocado Toast',
    image_url: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop&q=80',
    prep_time: '5 min',
    cook_time: '5 min',
    servings: 2,
    calories: 320,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Quick', 'Healthy'],
    isBuiltIn: true,
  },
  {
    name: 'Overnight Oats',
    image_url: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=600&fit=crop&q=80',
    prep_time: '5 min',
    cook_time: '0 min',
    servings: 1,
    calories: 380,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Meal Prep', 'No Cook'],
    isBuiltIn: true,
  },
  {
    name: 'Veggie Omelet',
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop&q=80',
    prep_time: '8 min',
    cook_time: '7 min',
    servings: 1,
    calories: 290,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'High Protein', 'Keto'],
    isBuiltIn: true,
  },
  {
    name: 'Chicken Stir-Fry',
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop&q=80',
    prep_time: '15 min',
    cook_time: '15 min',
    servings: 4,
    calories: 380,
    difficulty: 'Medium',
    tags: ['High Protein', 'Quick', 'Asian'],
    isBuiltIn: true,
  },
  {
    name: 'Grilled Salmon',
    image_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop&q=80',
    prep_time: '10 min',
    cook_time: '12 min',
    servings: 2,
    calories: 420,
    difficulty: 'Medium',
    tags: ['High Protein', 'Omega-3', 'Healthy'],
    isBuiltIn: true,
  },
  {
    name: 'Vegetable Curry',
    image_url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop&q=80',
    prep_time: '15 min',
    cook_time: '25 min',
    servings: 4,
    calories: 320,
    difficulty: 'Medium',
    tags: ['Vegan', 'Spicy', 'Indian'],
    isBuiltIn: true,
  },
];

const DIFFICULTY_COLORS = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
};

function getUserId(): string {
  if (typeof window === 'undefined') return '';
  let userId = localStorage.getItem('anonymous_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('anonymous_user_id', userId);
  }
  return userId;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'mine' | 'builtin'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Get all unique tags
  const allTags = Array.from(
    new Set([...BUILT_IN_RECIPES, ...recipes].flatMap((r) => r.tags || []))
  ).sort();

  // Fetch custom recipes
  const fetchRecipes = useCallback(async () => {
    try {
      const userId = getUserId();
      const response = await fetch('/api/recipes?includePublic=true', {
        headers: { 'x-user-id': userId },
      });
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Filter recipes
  const filteredRecipes = [...BUILT_IN_RECIPES.map(r => ({ ...r, isBuiltIn: true })), ...recipes]
    .filter((recipe) => {
      // Filter by type
      if (filter === 'mine' && recipe.isBuiltIn) return false;
      if (filter === 'builtin' && !recipe.isBuiltIn) return false;

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !recipe.name.toLowerCase().includes(query) &&
          !recipe.description?.toLowerCase().includes(query) &&
          !recipe.tags?.some((t) => t.toLowerCase().includes(query))
        ) {
          return false;
        }
      }

      // Filter by selected tags
      if (selectedTags.length > 0) {
        if (!selectedTags.some((tag) => recipe.tags?.includes(tag))) {
          return false;
        }
      }

      return true;
    });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-gray-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">
                <span className="mr-2">📖</span>
                Recipe Library
              </h1>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              + New Recipe
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Filter Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            {(['all', 'builtin', 'mine'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === type
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type === 'all' ? 'All' : type === 'builtin' ? 'Built-in' : 'My Recipes'}
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="px-3 py-1 rounded-full text-sm text-gray-500 hover:text-gray-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results count */}
        <p className="text-gray-600 mb-4">
          {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Recipe Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🍳</div>
            <p className="text-gray-600">No recipes found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe, index) => (
              <div
                key={recipe.id || `builtin-${index}`}
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {recipe.image_url ? (
                    <Image
                      src={recipe.image_url}
                      alt={recipe.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🍽️
                    </div>
                  )}
                  {recipe.isBuiltIn && (
                    <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Built-in
                    </span>
                  )}
                  {recipe.difficulty && (
                    <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${DIFFICULTY_COLORS[recipe.difficulty]}`}>
                      {recipe.difficulty}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{recipe.name}</h3>
                  {recipe.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    {recipe.prep_time && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {recipe.prep_time}
                      </span>
                    )}
                    {recipe.calories && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                        {recipe.calories} cal
                      </span>
                    )}
                    {recipe.servings && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {recipe.servings}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {recipe.tags.length > 3 && (
                        <span className="text-gray-400 text-xs">+{recipe.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Recipe Modal */}
      {showCreateModal && (
        <CreateRecipeModal
          onClose={() => setShowCreateModal(false)}
          onSave={async (recipe) => {
            const userId = getUserId();
            const response = await fetch('/api/recipes', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-user-id': userId,
              },
              body: JSON.stringify(recipe),
            });
            if (response.ok) {
              fetchRecipes();
              setShowCreateModal(false);
            }
          }}
        />
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}

// Create Recipe Modal Component
function CreateRecipeModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (recipe: Partial<Recipe>) => Promise<void>;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState(4);
  const [calories, setCalories] = useState<number | ''>('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [tags, setTags] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || undefined,
        prep_time: prepTime || undefined,
        cook_time: cookTime || undefined,
        servings,
        calories: calories || undefined,
        difficulty,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        ingredients: ingredients
          .split('\n')
          .filter(Boolean)
          .map((line) => {
            const [amount, ...itemParts] = line.split(' ');
            return { amount, item: itemParts.join(' ') };
          }),
        cooking_steps: steps.split('\n').filter(Boolean),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Create New Recipe</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Grandma's Chicken Soup"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description of your recipe..."
              rows={2}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Time and Servings */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time</label>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="15 min"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time</label>
              <input
                type="text"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                placeholder="30 min"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Servings</label>
              <input
                type="number"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                min={1}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value ? Number(e.target.value) : '')}
                placeholder="350"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <div className="flex gap-2">
              {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    difficulty === level
                      ? DIFFICULTY_COLORS[level].replace('bg-', 'bg-').replace('text-', 'text-')
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Vegetarian, Quick, Healthy"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (one per line)</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="2 cups flour&#10;1 tsp salt&#10;3 eggs"
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
            />
          </div>

          {/* Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cooking Steps (one per line)</label>
            <textarea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="Preheat oven to 350°F&#10;Mix dry ingredients&#10;Add wet ingredients and stir"
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Recipe'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Recipe Detail Modal
function RecipeDetailModal({
  recipe,
  onClose,
}: {
  recipe: Recipe;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Header */}
        {recipe.image_url && (
          <div className="relative h-64">
            <Image src={recipe.image_url} alt={recipe.name} fill className="object-cover" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="p-6">
          {/* Title and badges */}
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{recipe.name}</h2>
            <div className="flex gap-2">
              {recipe.isBuiltIn && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Built-in</span>
              )}
              {recipe.difficulty && (
                <span className={`text-xs px-2 py-1 rounded-full ${DIFFICULTY_COLORS[recipe.difficulty]}`}>
                  {recipe.difficulty}
                </span>
              )}
            </div>
          </div>

          {recipe.description && (
            <p className="text-gray-600 mb-4">{recipe.description}</p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
            {recipe.prep_time && (
              <div className="flex items-center gap-1">
                <span className="text-gray-400">Prep:</span> {recipe.prep_time}
              </div>
            )}
            {recipe.cook_time && (
              <div className="flex items-center gap-1">
                <span className="text-gray-400">Cook:</span> {recipe.cook_time}
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <span className="text-gray-400">Servings:</span> {recipe.servings}
              </div>
            )}
            {recipe.calories && (
              <div className="flex items-center gap-1">
                <span className="text-gray-400">Calories:</span> {recipe.calories}
              </div>
            )}
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {recipe.tags.map((tag) => (
                <span key={tag} className="bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Ingredients */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 bg-orange-400 rounded-full" />
                    <span className="font-medium">{ing.amount}</span> {ing.item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Steps */}
          {recipe.cooking_steps && recipe.cooking_steps.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Instructions</h3>
              <ol className="space-y-3">
                {recipe.cooking_steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-gray-600">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Nutrition */}
          {recipe.nutrition && Object.keys(recipe.nutrition).length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold text-gray-800 mb-3">Nutrition per Serving</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                {recipe.nutrition.protein !== undefined && (
                  <div>
                    <div className="text-2xl font-bold text-orange-500">{recipe.nutrition.protein}g</div>
                    <div className="text-xs text-gray-500">Protein</div>
                  </div>
                )}
                {recipe.nutrition.carbs !== undefined && (
                  <div>
                    <div className="text-2xl font-bold text-orange-500">{recipe.nutrition.carbs}g</div>
                    <div className="text-xs text-gray-500">Carbs</div>
                  </div>
                )}
                {recipe.nutrition.fat !== undefined && (
                  <div>
                    <div className="text-2xl font-bold text-orange-500">{recipe.nutrition.fat}g</div>
                    <div className="text-xs text-gray-500">Fat</div>
                  </div>
                )}
                {recipe.nutrition.fiber !== undefined && (
                  <div>
                    <div className="text-2xl font-bold text-orange-500">{recipe.nutrition.fiber}g</div>
                    <div className="text-xs text-gray-500">Fiber</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
          <Link
            href={`/?addMeal=${encodeURIComponent(recipe.name)}`}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Add to Meal Plan
          </Link>
        </div>
      </div>
    </div>
  );
}
