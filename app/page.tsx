'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { fetchMealPlans, saveMeal, removeMeal as removeMealFromDB, syncMealPlan } from '@/lib/meal-service';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['Breakfast', 'Lunch', 'Dinner'];

// Recipe database with images, ingredients, instructions, and nutrition
const RECIPES: Record<string, {
  name: string;
  image: string;
  time: string;
  servings: number;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  ingredients: string[];
  instructions: string[];
}> = {
  'Avocado Toast': {
    name: 'Avocado Toast',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop&q=80',
    time: '10 min',
    servings: 2,
    calories: 320,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Quick', 'Healthy'],
    ingredients: ['2 slices sourdough bread', '1 ripe avocado', '1 tbsp olive oil', 'Salt & pepper', 'Red pepper flakes', '1 egg (optional)', 'Cherry tomatoes'],
    instructions: ['Toast bread until golden', 'Mash avocado with fork', 'Add olive oil, salt, pepper', 'Spread on toast', 'Top with egg or tomatoes']
  },
  'Overnight Oats': {
    name: 'Overnight Oats',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&h=600&fit=crop&q=80',
    time: '5 min prep',
    servings: 1,
    calories: 380,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Meal Prep', 'No Cook'],
    ingredients: ['1/2 cup rolled oats', '1/2 cup milk', '1/4 cup Greek yogurt', '1 tbsp chia seeds', '1 tbsp honey', 'Fresh berries'],
    instructions: ['Mix oats, milk, yogurt in jar', 'Add chia seeds and honey', 'Refrigerate overnight', 'Top with fresh berries', 'Enjoy cold or warm']
  },
  'Veggie Omelet': {
    name: 'Veggie Omelet',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop&q=80',
    time: '15 min',
    servings: 1,
    calories: 290,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'High Protein', 'Keto'],
    ingredients: ['3 eggs', '1/4 cup bell peppers', '1/4 cup onions', '2 tbsp cheese', '1 tbsp butter', 'Salt & pepper', 'Fresh herbs'],
    instructions: ['Whisk eggs with salt & pepper', 'Sauté vegetables in butter', 'Pour eggs over veggies', 'Cook until set, fold in half', 'Top with cheese']
  },
  'Smoothie Bowl': {
    name: 'Smoothie Bowl',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=600&fit=crop&q=80',
    time: '10 min',
    servings: 1,
    calories: 350,
    difficulty: 'Easy',
    tags: ['Vegan', 'Gluten-Free', 'Refreshing'],
    ingredients: ['1 frozen banana', '1/2 cup frozen berries', '1/4 cup almond milk', 'Granola', 'Sliced fruits', 'Chia seeds', 'Coconut flakes'],
    instructions: ['Blend banana & berries with milk', 'Pour into bowl (thick consistency)', 'Top with granola', 'Add sliced fruits', 'Sprinkle seeds & coconut']
  },
  'Pancakes': {
    name: 'Fluffy Pancakes',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&q=80',
    time: '20 min',
    servings: 4,
    calories: 420,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Family Favorite', 'Weekend'],
    ingredients: ['1.5 cups flour', '2 tbsp sugar', '2 tsp baking powder', '1 cup milk', '1 egg', '3 tbsp melted butter', 'Maple syrup'],
    instructions: ['Mix dry ingredients', 'Whisk wet ingredients separately', 'Combine until just mixed', 'Cook on griddle until bubbles form', 'Flip and cook golden']
  },
  'Quinoa Salad': {
    name: 'Mediterranean Quinoa Salad',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
    time: '25 min',
    servings: 4,
    calories: 380,
    difficulty: 'Easy',
    tags: ['Vegan', 'Gluten-Free', 'Meal Prep'],
    ingredients: ['1 cup quinoa', 'Cucumber', 'Cherry tomatoes', 'Red onion', 'Feta cheese', 'Olives', 'Lemon vinaigrette'],
    instructions: ['Cook quinoa per package', 'Chop all vegetables', 'Let quinoa cool', 'Mix all ingredients', 'Dress with vinaigrette']
  },
  'Grilled Chicken Wrap': {
    name: 'Grilled Chicken Wrap',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&h=600&fit=crop&q=80',
    time: '20 min',
    servings: 2,
    calories: 450,
    difficulty: 'Medium',
    tags: ['High Protein', 'Quick', 'Portable'],
    ingredients: ['2 chicken breasts', 'Large tortillas', 'Lettuce', 'Tomatoes', 'Greek yogurt sauce', 'Avocado', 'Red onion'],
    instructions: ['Season and grill chicken', 'Slice into strips', 'Warm tortillas', 'Layer ingredients', 'Roll tightly']
  },
  'Buddha Bowl': {
    name: 'Buddha Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80',
    time: '30 min',
    servings: 2,
    calories: 520,
    difficulty: 'Medium',
    tags: ['Vegan Option', 'Nutritious', 'Colorful'],
    ingredients: ['Brown rice', 'Chickpeas', 'Sweet potato', 'Kale', 'Avocado', 'Tahini dressing', 'Seeds'],
    instructions: ['Cook rice', 'Roast sweet potato & chickpeas', 'Massage kale with oil', 'Arrange in bowl', 'Drizzle with tahini']
  },
  'Salmon & Veggies': {
    name: 'Herb-Crusted Salmon',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop&q=80',
    time: '25 min',
    servings: 2,
    calories: 480,
    difficulty: 'Medium',
    tags: ['Omega-3', 'Keto', 'Heart Healthy'],
    ingredients: ['2 salmon fillets', 'Fresh herbs', 'Lemon', 'Asparagus', 'Cherry tomatoes', 'Olive oil', 'Garlic'],
    instructions: ['Preheat oven to 400°F', 'Season salmon with herbs', 'Arrange veggies around fish', 'Drizzle with olive oil', 'Bake 15-18 minutes']
  },
  'Pasta Primavera': {
    name: 'Pasta Primavera',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop&q=80',
    time: '30 min',
    servings: 4,
    calories: 420,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Family Favorite', 'Italian'],
    ingredients: ['1 lb pasta', 'Zucchini', 'Bell peppers', 'Cherry tomatoes', 'Parmesan', 'Olive oil', 'Fresh basil'],
    instructions: ['Cook pasta al dente', 'Sauté vegetables in olive oil', 'Toss pasta with veggies', 'Add parmesan', 'Garnish with basil']
  },
  'Stir Fry': {
    name: 'Asian Stir Fry',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop&q=80',
    time: '20 min',
    servings: 4,
    calories: 380,
    difficulty: 'Easy',
    tags: ['Quick', 'High Protein', 'Asian'],
    ingredients: ['Chicken or tofu', 'Broccoli', 'Snap peas', 'Carrots', 'Soy sauce', 'Ginger', 'Garlic', 'Sesame oil'],
    instructions: ['Prep all ingredients', 'Heat wok very hot', 'Cook protein first, set aside', 'Stir fry vegetables', 'Add sauce and protein back']
  },
  'Tacos Night': {
    name: 'Street-Style Tacos',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop&q=80',
    time: '25 min',
    servings: 4,
    calories: 380,
    difficulty: 'Easy',
    tags: ['Mexican', 'Family Favorite', 'Customizable'],
    ingredients: ['1 lb ground beef or chicken', 'Corn tortillas', 'Onion', 'Cilantro', 'Lime', 'Salsa', 'Taco seasoning'],
    instructions: ['Brown meat with seasoning', 'Warm tortillas', 'Dice onion and cilantro', 'Assemble tacos', 'Squeeze lime on top']
  },
  'Pizza Night': {
    name: 'Homemade Pizza',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&q=80',
    time: '45 min',
    servings: 4,
    calories: 520,
    difficulty: 'Medium',
    tags: ['Italian', 'Family Favorite', 'Fun'],
    ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella', 'Pepperoni', 'Bell peppers', 'Mushrooms', 'Fresh basil'],
    instructions: ['Preheat oven to 475°F', 'Roll out dough', 'Spread sauce', 'Add cheese and toppings', 'Bake 12-15 minutes']
  },
  'Sushi Night': {
    name: 'Homemade Sushi Rolls',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop&q=80',
    time: '45 min',
    servings: 4,
    calories: 350,
    difficulty: 'Hard',
    tags: ['Japanese', 'Healthy', 'Date Night'],
    ingredients: ['Sushi rice', 'Nori sheets', 'Fresh salmon or tuna', 'Cucumber', 'Avocado', 'Rice vinegar', 'Soy sauce', 'Wasabi'],
    instructions: ['Cook and season rice', 'Prep fish and vegetables', 'Place nori on bamboo mat', 'Spread rice, add fillings', 'Roll tightly and slice']
  },
  'Chicken Curry': {
    name: 'Creamy Chicken Curry',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop&q=80',
    time: '40 min',
    servings: 4,
    calories: 450,
    difficulty: 'Medium',
    tags: ['Indian', 'Comfort Food', 'Spicy'],
    ingredients: ['1.5 lbs chicken thighs', 'Coconut milk', 'Curry paste', 'Onion', 'Garlic', 'Ginger', 'Rice', 'Cilantro'],
    instructions: ['Sauté onion, garlic, ginger', 'Add curry paste, cook 1 min', 'Add chicken, brown slightly', 'Pour in coconut milk', 'Simmer 25 min, serve over rice']
  },
};

// Food images for meal types
const MEAL_IMAGES: Record<string, string> = {
  Breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop&q=80',
  Lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&q=80',
  Dinner: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop&q=80',
};

// Gallery images with recipes
const FOOD_GALLERY = {
  hero: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=1920&h=800&fit=crop&q=90',
  familyEating: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=600&fit=crop&q=80',
  familyDinner: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&h=400&fit=crop&q=80',
  cooking: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80',
  groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop&q=80',
  healthyFood: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop&q=80',
  breakfast: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80',
  dinner: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop&q=80',
  calendar: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=400&fit=crop&q=80',
};

// Meal suggestions by category
const MEAL_SUGGESTIONS: Record<string, string[]> = {
  Breakfast: ['Avocado Toast', 'Overnight Oats', 'Veggie Omelet', 'Smoothie Bowl', 'Pancakes'],
  Lunch: ['Quinoa Salad', 'Grilled Chicken Wrap', 'Buddha Bowl'],
  Dinner: ['Salmon & Veggies', 'Pasta Primavera', 'Stir Fry', 'Tacos Night', 'Pizza Night', 'Sushi Night', 'Chicken Curry'],
};

// Nutritional tips
const NUTRITION_TIPS: Record<string, { tip: string; icon: string }> = {
  Breakfast: { tip: 'Include protein to stay full longer', icon: '💪' },
  Lunch: { tip: 'Add colorful veggies for vitamins', icon: '🌈' },
  Dinner: { tip: 'Balance carbs, protein & fiber', icon: '⚖️' },
};

// Toast component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className={`toast-enter fixed bottom-6 left-1/2 -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 z-50`}>
      <span className="font-medium">{message}</span>
    </div>
  );
}

// Progress bar
function ProgressBar({ filled, total }: { filled: number; total: number }) {
  const percentage = Math.round((filled / total) * 100);
  return (
    <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
      <div 
        className="progress-bar bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 h-full rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// Recipe Modal
function RecipeModal({ recipe, onClose, onAddToMeal }: { 
  recipe: typeof RECIPES[string] | null; 
  onClose: () => void;
  onAddToMeal: (name: string) => void;
}) {
  if (!recipe) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Recipe Image */}
        <div className="relative h-64 w-full">
          <Image src={recipe.image} alt={recipe.name} fill className="object-cover rounded-t-2xl" sizes="700px" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h2 className="text-3xl font-bold text-white">{recipe.name}</h2>
            <div className="flex gap-2 mt-2">
              {recipe.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-white/20 rounded-full text-xs text-white">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Recipe Info */}
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-orange-50 rounded-xl">
              <p className="text-2xl">⏱️</p>
              <p className="text-sm font-semibold text-gray-800">{recipe.time}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-2xl">👥</p>
              <p className="text-sm font-semibold text-gray-800">{recipe.servings} servings</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-2xl">🔥</p>
              <p className="text-sm font-semibold text-gray-800">{recipe.calories} cal</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <p className="text-2xl">{recipe.difficulty === 'Easy' ? '😊' : recipe.difficulty === 'Medium' ? '👨‍🍳' : '🏆'}</p>
              <p className="text-sm font-semibold text-gray-800">{recipe.difficulty}</p>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              🥗 Ingredients
            </h3>
            <ul className="grid grid-cols-2 gap-2">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              📝 Instructions
            </h3>
            <ol className="space-y-3">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex gap-3 text-gray-600 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Add to Meal Plan */}
          <button
            onClick={() => onAddToMeal(recipe.name)}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            ➕ Add to Meal Plan
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal component
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto animate-modal-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center">✕</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

// Feature Card
function FeatureCard({ icon, title, description, onClick, imageSrc }: { icon: string; title: string; description: string; onClick: () => void; imageSrc: string }) {
  return (
    <button onClick={onClick} className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 card-lift text-left w-full">
      <div className="relative h-32 overflow-hidden">
        <Image src={imageSrc} alt={title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="300px" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 text-4xl drop-shadow-lg">{icon}</div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </button>
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [groceryList, setGroceryList] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<typeof RECIPES[string] | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Load meal plan
  useEffect(() => {
    const loadMealPlan = async () => {
      try {
        const data = await fetchMealPlans();
        setMealPlan(data);
      } catch (error) {
        console.error('Failed to load meal plan:', error);
        const saved = localStorage.getItem('mealPlan');
        if (saved) {
          try { setMealPlan(JSON.parse(saved)); } catch { /* ignore */ }
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadMealPlan();
  }, []);

  // Save meal plan
  useEffect(() => {
    if (Object.keys(mealPlan).length > 0 && !isLoading) {
      localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
      const syncTimeout = setTimeout(async () => {
        setIsSyncing(true);
        await syncMealPlan(mealPlan);
        setIsSyncing(false);
      }, 1000);
      return () => clearTimeout(syncTimeout);
    }
  }, [mealPlan, isLoading]);

  const totalSlots = DAYS.length * MEALS.length;
  const filledSlots = Object.values(mealPlan).reduce((acc, day) => acc + Object.keys(day).length, 0);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  }, []);

  const addMeal = useCallback(async () => {
    if (!mealInput.trim()) {
      setInputError(true);
      showToast('Please enter a meal name', 'error');
      setTimeout(() => setInputError(false), 500);
      return;
    }
    
    setMealPlan(prev => ({
      ...prev,
      [currentDay]: { ...prev[currentDay], [currentMeal]: mealInput }
    }));
    
    await saveMeal(currentDay, currentMeal, mealInput);
    setRecentlyAdded(`${currentDay}-${currentMeal}`);
    setTimeout(() => setRecentlyAdded(null), 600);
    showToast(`${currentMeal} added to ${currentDay}!`, 'success');
    setMealInput('');
    setShowSuggestions(false);
  }, [mealInput, currentDay, currentMeal, showToast]);

  const removeMeal = useCallback(async (day: string, meal: string) => {
    setMealPlan(prev => {
      const newPlan = { ...prev };
      if (newPlan[day]) {
        delete newPlan[day][meal];
        if (Object.keys(newPlan[day]).length === 0) delete newPlan[day];
      }
      return newPlan;
    });
    await removeMealFromDB(day, meal);
    showToast('Meal removed', 'info');
  }, [showToast]);

  const clearAllMeals = useCallback(async () => {
    if (confirm('Clear all meals?')) {
      setMealPlan({});
      localStorage.removeItem('mealPlan');
      await syncMealPlan({});
      showToast('All meals cleared', 'info');
    }
  }, [showToast]);

  const getMeal = useCallback((day: string, meal: string) => mealPlan[day]?.[meal] || '', [mealPlan]);

  const generateGroceryList = useCallback(() => {
    const meals = Object.values(mealPlan).flatMap(day => Object.values(day));
    setGroceryList([...new Set(meals)]);
    setActiveModal('grocery');
    showToast('Grocery list generated!', 'success');
  }, [mealPlan, showToast]);

  const shareMealPlan = useCallback(async () => {
    const planText = DAYS.map(day => {
      const dayMeals = MEALS.map(meal => `  ${meal}: ${getMeal(day, meal) || 'Not planned'}`).join('\n');
      return `${day}:\n${dayMeals}`;
    }).join('\n\n');
    
    const shareText = `🍽️ My Weekly Meal Plan\n\n${planText}\n\nCreated with BestMealMate`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Meal Plan', text: shareText });
        showToast('Shared!', 'success');
      } catch {
        await navigator.clipboard.writeText(shareText);
        showToast('Copied to clipboard!', 'success');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      showToast('Copied to clipboard!', 'success');
    }
  }, [showToast, getMeal]);

  const printMealPlan = useCallback(() => {
    window.print();
  }, []);

  const selectSuggestion = useCallback((suggestion: string) => {
    setMealInput(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, []);

  const openRecipe = useCallback((recipeName: string) => {
    const recipe = RECIPES[recipeName];
    if (recipe) {
      setSelectedRecipe(recipe);
    }
  }, []);

  const addRecipeToMeal = useCallback((recipeName: string) => {
    setMealInput(recipeName);
    setSelectedRecipe(null);
    inputRef.current?.focus();
    showToast(`${recipeName} selected! Choose day and meal type.`, 'info');
  }, [showToast]);

  const randomMeal = useCallback(() => {
    const allRecipes = Object.keys(RECIPES);
    const random = allRecipes[Math.floor(Math.random() * allRecipes.length)];
    setMealInput(random);
    showToast(`Random pick: ${random}!`, 'success');
  }, [showToast]);

  // Export to calendar (.ics format)
  const exportToCalendar = useCallback(() => {
    const today = new Date();
    const dayOffset = (today.getDay() + 6) % 7; // Monday = 0
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOffset);

    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BestMealMate//Meal Plan//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

    DAYS.forEach((day, dayIndex) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + dayIndex);
      const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');

      MEALS.forEach((mealType) => {
        const mealName = getMeal(day, mealType);
        if (mealName) {
          const startHour = mealType === 'Breakfast' ? '08' : mealType === 'Lunch' ? '12' : '18';
          icsContent += `BEGIN:VEVENT
DTSTART:${dateStr}T${startHour}0000
DTEND:${dateStr}T${startHour}3000
SUMMARY:${mealType}: ${mealName}
DESCRIPTION:Meal planned with BestMealMate
END:VEVENT
`;
        }
      });
    });

    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bestmealmate-meal-plan.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Calendar exported! Import to Google/Apple Calendar', 'success');
  }, [showToast, getMeal]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
        setShowSuggestions(false);
        setSelectedRecipe(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'}`}>
      {/* Skip link */}
      <a href="#main-content" className="skip-link focus-ring">Skip to main content</a>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Recipe Modal */}
      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} onAddToMeal={addRecipeToMeal} />

      {/* Navigation Header - Mobile Optimized */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-sm safe-top">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl">🍽️</span>
            <span className="font-bold text-lg md:text-xl text-orange-600">BestMealMate</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors" title="Toggle dark mode">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={shareMealPlan} className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors hidden md:flex" title="Share">📤</button>
            <button onClick={printMealPlan} className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors hidden md:flex" title="Print">🖨️</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[70vh] min-h-[500px] overflow-hidden pt-14" role="banner">
        {!isLoading && (
          <>
            <Image src={FOOD_GALLERY.hero} alt="Delicious food spread" fill className="object-cover" priority sizes="100vw" />
            <div className="absolute top-24 left-10 w-20 h-20 rounded-full overflow-hidden shadow-2xl animate-float hidden lg:block cursor-pointer" onClick={() => openRecipe('Pancakes')}>
              <Image src={FOOD_GALLERY.breakfast} alt="Breakfast" fill className="object-cover" sizes="80px" />
            </div>
            <div className="absolute top-32 right-16 w-16 h-16 rounded-full overflow-hidden shadow-2xl animate-float-delayed hidden lg:block cursor-pointer" onClick={() => openRecipe('Quinoa Salad')}>
              <Image src={FOOD_GALLERY.healthyFood} alt="Healthy" fill className="object-cover" sizes="64px" />
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <div className="animate-slide-up text-center">
            <h1 className="text-5xl md:text-7xl font-bold drop-shadow-2xl mb-4">
              <span className="text-orange-400">Best</span>MealMate
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Your AI-powered meal planning assistant. Plan smarter, eat better.
            </p>
          </div>
          
          <div className="mt-8 w-80 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between text-sm mb-2 opacity-90">
              <span>Weekly Progress</span>
              <span className="font-bold">{filledSlots}/{totalSlots} meals</span>
            </div>
            <ProgressBar filled={filledSlots} total={totalSlots} />
            {filledSlots === totalSlots && <p className="text-center mt-2 text-green-300 animate-pulse">🎉 Week complete!</p>}
          </div>

          <div className="mt-8 flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={() => mainContentRef.current?.scrollIntoView({ behavior: 'smooth' })} className="btn-press bg-white text-orange-600 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
              Start Planning →
            </button>
            <button onClick={randomMeal} className="btn-press bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-full border border-white/30 hover:bg-white/30 transition-all">
              🎲 Random Meal
            </button>
          </div>
        </div>
      </header>

      {/* Feature Cards - Horizontal scroll on mobile */}
      <section className="max-w-6xl mx-auto px-4 py-8 md:py-12 -mt-16 md:-mt-20 relative z-10">
        <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-5 md:gap-4 swipe-container -mx-4 px-4 md:mx-0">
          <div className="swipe-item min-w-[140px] md:min-w-0">
            <FeatureCard icon="📝" title="Quick Add" description="Smart suggestions" onClick={() => inputRef.current?.focus()} imageSrc={FOOD_GALLERY.healthyFood} />
          </div>
          <div className="swipe-item min-w-[140px] md:min-w-0">
            <FeatureCard icon="🛒" title="Grocery" description="Shopping list" onClick={generateGroceryList} imageSrc={FOOD_GALLERY.groceries} />
          </div>
          <div className="swipe-item min-w-[140px] md:min-w-0">
            <FeatureCard icon="📅" title="Calendar" description="Export to iCal" onClick={exportToCalendar} imageSrc={FOOD_GALLERY.calendar} />
          </div>
          <div className="swipe-item min-w-[140px] md:min-w-0">
            <FeatureCard icon="📖" title="Recipes" description="15+ dishes" onClick={() => setActiveModal('recipes')} imageSrc={FOOD_GALLERY.cooking} />
          </div>
          <div className="swipe-item min-w-[140px] md:min-w-0">
            <FeatureCard icon="❤️" title="Favorites" description="Quick-add" onClick={() => setActiveModal('favorites')} imageSrc={FOOD_GALLERY.familyDinner} />
          </div>
        </div>
      </section>

      {/* Recipe Gallery - Horizontal scroll on mobile */}
      <section className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
          🍴 Tap Any Dish for Recipe
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-7 swipe-container -mx-4 px-4 md:mx-0">
          {Object.entries(RECIPES).slice(0, 14).map(([name, recipe]) => (
            <button key={name} onClick={() => openRecipe(name)} className="swipe-item flex-shrink-0 w-24 h-24 md:w-auto md:h-auto md:aspect-square relative rounded-xl overflow-hidden shadow-md active:scale-95 transition-transform">
              <Image src={recipe.image} alt={name} fill className="object-cover" sizes="150px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-black/0 md:hover:bg-black/50 transition-colors flex items-end md:items-center justify-center">
                <span className="text-white font-medium text-[10px] md:text-xs text-center px-1 pb-1 md:pb-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">{name.split(' ')[0]}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Meal Type Cards - Horizontal scroll on mobile */}
      <section className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-4 md:mb-6">Choose Meal Type</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 md:gap-6 swipe-container -mx-4 px-4 md:mx-0 mb-8 md:mb-10">
          {MEALS.map((mealType) => (
            <button
              key={mealType}
              onClick={() => { setCurrentMeal(mealType); inputRef.current?.focus(); }}
              className={`swipe-item flex-shrink-0 w-[280px] md:w-auto card-lift bg-white rounded-2xl shadow-lg overflow-hidden text-left transition-all active:scale-[0.98] ${currentMeal === mealType ? 'ring-4 ring-orange-400 ring-offset-2' : ''}`}
            >
              <div className="relative h-36 md:h-48">
                <Image src={MEAL_IMAGES[mealType]} alt={mealType} fill className="object-cover" sizes="400px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3 className="text-white font-bold text-lg md:text-xl">{mealType === 'Breakfast' ? '🌅' : mealType === 'Lunch' ? '☀️' : '🌙'} {mealType}</h3>
                  <p className="text-white/80 text-xs md:text-sm">{NUTRITION_TIPS[mealType].tip}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <main id="main-content" ref={mainContentRef} className="grid gap-6 md:grid-cols-3 md:gap-8">
          {/* Add Meal Form */}
          <section className="bg-white p-4 md:p-6 rounded-2xl shadow-lg border-t-4 border-orange-400 order-1 md:order-none">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">➕ Add Meal</h2>
            <form onSubmit={(e) => { e.preventDefault(); addMeal(); }} className="space-y-4">
              <div>
                <label htmlFor="day-select" className="block text-sm font-semibold text-gray-700 mb-2">📅 Day</label>
                <select id="day-select" value={currentDay} onChange={(e) => setCurrentDay(e.target.value)} className="w-full p-3 md:p-3 border border-gray-200 rounded-xl bg-gray-50 text-base">
                  {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="meal-select" className="block text-sm font-semibold text-gray-700 mb-2">🍴 Meal Type</label>
                <select id="meal-select" value={currentMeal} onChange={(e) => setCurrentMeal(e.target.value)} className="w-full p-3 md:p-3 border border-gray-200 rounded-xl bg-gray-50 text-base">
                  {MEALS.map(meal => <option key={meal} value={meal}>{meal}</option>)}
                </select>
              </div>
              <div className="relative">
                <label htmlFor="meal-input" className="block text-sm font-semibold text-gray-700 mb-2">✨ Meal Name</label>
                <input 
                  ref={inputRef}
                  id="meal-input"
                  type="text" 
                  value={mealInput} 
                  onChange={(e) => setMealInput(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="e.g., Pasta Primavera" 
                  className={`w-full p-3 border rounded-xl bg-gray-50 text-base ${inputError ? 'animate-shake border-red-400' : 'border-gray-200'}`}
                  autoComplete="off"
                />
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border z-20 max-h-48 overflow-y-auto">
                    <p className="text-xs text-gray-400 p-2 border-b">💡 Suggestions for {currentMeal}</p>
                    {MEAL_SUGGESTIONS[currentMeal].map((suggestion, idx) => (
                      <button key={idx} type="button" onClick={() => selectSuggestion(suggestion)} className="w-full text-left px-4 py-3 hover:bg-orange-50 active:bg-orange-100 text-gray-700 text-sm flex items-center gap-2">
                        <span className="text-orange-400">+</span> {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="btn-press w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all">
                Add to Plan 🎯
              </button>
            </form>
            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
              {filledSlots > 0 && <button onClick={clearAllMeals} className="text-sm text-gray-400 hover:text-red-500 px-3 py-1.5 hover:bg-red-50 rounded">🗑️ Clear all</button>}
              <button onClick={generateGroceryList} className="text-sm text-gray-400 hover:text-green-500 px-3 py-1.5 hover:bg-green-50 rounded">🛒 Groceries</button>
            </div>
          </section>

          {/* Weekly Plan */}
          <section className="md:col-span-2 bg-white p-4 md:p-6 rounded-2xl shadow-lg border-t-4 border-amber-400 order-2 md:order-none">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">📅 Your Weekly Plan</h2>
            {/* Mobile: Horizontal scroll, Desktop: Grid */}
            <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 md:gap-4 md:max-h-[600px] md:overflow-y-auto swipe-container -mx-4 px-4 md:mx-0 md:pr-2">
              {DAYS.map((day, index) => {
                const dayMeals = MEALS.filter(meal => getMeal(day, meal));
                const dayProgress = dayMeals.length;
                return (
                  <article key={day} className={`swipe-item flex-shrink-0 w-[260px] md:w-auto bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 md:p-4 border border-orange-100 ${dayProgress === 3 ? 'ring-2 ring-green-400' : ''}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm md:text-base">
                        <span className={`w-7 h-7 md:w-8 md:h-8 ${dayProgress === 3 ? 'bg-green-500' : 'bg-orange-400'} text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold`}>
                          {dayProgress === 3 ? '✓' : index + 1}
                        </span>
                        {day.slice(0, 3)}
                      </h3>
                      <span className="text-xs text-gray-400">{dayProgress}/3</span>
                    </div>
                    <div className="space-y-2">
                      {MEALS.map(meal => {
                        const mealValue = getMeal(day, meal);
                        const isRecent = recentlyAdded === `${day}-${meal}`;
                        const hasRecipe = mealValue && RECIPES[mealValue];
                        return (
                          <div key={meal} className={`group bg-white/80 rounded-lg p-2 md:p-2.5 text-xs md:text-sm ${isRecent ? 'animate-success ring-2 ring-green-400' : ''}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold text-orange-600">{meal === 'Breakfast' ? '🌅' : meal === 'Lunch' ? '☀️' : '🌙'}</span>
                                {hasRecipe ? (
                                  <button onClick={() => openRecipe(mealValue)} className="ml-1 text-gray-700 font-medium hover:text-orange-600 active:text-orange-700 underline decoration-dotted truncate">
                                    {mealValue}
                                  </button>
                                ) : (
                                  <span className={`ml-1 ${mealValue ? 'text-gray-700 font-medium' : 'text-gray-400 italic'}`}>{mealValue || 'Not planned'}</span>
                                )}
                              </div>
                              {mealValue && (
                                <button onClick={() => removeMeal(day, meal)} className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-gray-400 hover:text-red-500 rounded">✕</button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mt-10 mb-20 md:mb-0 bg-white rounded-2xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl">🍽️</span>
              <span className="font-bold text-orange-600">BestMealMate</span>
              <span className="text-gray-400 text-xs md:text-sm">© 2026</span>
            </div>
            <div className="flex items-center gap-4 text-xs md:text-sm text-gray-400">
              {isSyncing && <span className="flex items-center gap-1 text-orange-500"><span className="animate-spin">⟳</span> Syncing...</span>}
              <span className="text-green-500">● {filledSlots} meals</span>
            </div>
          </div>
        </footer>
      </section>

      {/* Modals */}
      <Modal isOpen={activeModal === 'grocery'} onClose={() => setActiveModal(null)} title="🛒 Grocery List">
        {groceryList.length > 0 ? (
          <div className="space-y-4">
            <ul className="space-y-2">
              {groceryList.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input type="checkbox" className="w-5 h-5 rounded" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => { navigator.clipboard.writeText(groceryList.join('\n')); showToast('Copied!', 'success'); }} className="w-full bg-green-500 text-white font-bold py-3 rounded-xl">
              📋 Copy List
            </button>
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">Add meals first to generate your grocery list!</p>
        )}
      </Modal>

      <Modal isOpen={activeModal === 'recipes'} onClose={() => setActiveModal(null)} title="📖 Recipe Book">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(RECIPES).map(([name, recipe]) => (
            <button key={name} onClick={() => { setActiveModal(null); openRecipe(name); }} className="p-3 bg-orange-50 hover:bg-orange-100 rounded-xl text-left">
              <p className="font-semibold text-gray-800 text-sm">{name}</p>
              <p className="text-xs text-gray-500">{recipe.time} • {recipe.calories} cal</p>
            </button>
          ))}
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'favorites'} onClose={() => setActiveModal(null)} title="❤️ Family Favorites">
        <div className="grid grid-cols-2 gap-3">
          {['Tacos Night', 'Pizza Night', 'Pancakes', 'Pasta Primavera', 'Chicken Curry', 'Stir Fry'].map((fav, idx) => (
            <button key={idx} onClick={() => { selectSuggestion(fav); setActiveModal(null); }} className="p-4 bg-orange-50 hover:bg-orange-100 active:bg-orange-200 rounded-xl text-left transition-colors">
              <p className="font-semibold text-gray-800">{fav}</p>
              <p className="text-xs text-orange-600 mt-1">Tap to add →</p>
            </button>
          ))}
        </div>
      </Modal>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav md:hidden">
        <button onClick={() => { setActiveModal(null); mainContentRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="mobile-nav-item">
          <span>🏠</span>
          <span>Home</span>
        </button>
        <button onClick={() => setActiveModal('recipes')} className={`mobile-nav-item ${activeModal === 'recipes' ? 'active' : ''}`}>
          <span>📖</span>
          <span>Recipes</span>
        </button>
        <button onClick={generateGroceryList} className={`mobile-nav-item ${activeModal === 'grocery' ? 'active' : ''}`}>
          <span>🛒</span>
          <span>Grocery</span>
        </button>
        <button onClick={shareMealPlan} className="mobile-nav-item">
          <span>📤</span>
          <span>Share</span>
        </button>
      </nav>

      {/* Mobile Floating Action Button */}
      <button onClick={() => inputRef.current?.focus()} className="mobile-fab" aria-label="Add meal">
        ➕
      </button>

      <style jsx global>{`
        @media print {
          header, footer, nav, button, .skip-link, form, .mobile-bottom-nav, .mobile-fab { display: none !important; }
        }
      `}</style>
    </div>
  );
}
