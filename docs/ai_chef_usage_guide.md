# ChefBot Pro - Implementation Guide

This guide shows you how to deploy ChefBot Pro in your BestMealMate application using four different methods, from simple (Claude Web) to advanced (Full Supabase Integration).

---

## Table of Contents

1. [Method 1: Claude Web (Instant)](#method-1-claude-web-instant)
2. [Method 2: Claude API (Production)](#method-2-claude-api-production)
3. [Method 3: Supabase Integration](#method-3-supabase-integration)
4. [Method 4: Full Service Architecture](#method-4-full-service-architecture)
5. [Framework Integrations](#framework-integrations)
6. [Database Schema](#database-schema)
7. [Best Practices](#best-practices)

---

## Method 1: Claude Web (Instant)

**Best for:** Quick recipe suggestions, testing the agent
**Setup time:** 30 seconds
**Requirements:** Claude.ai account

### Steps

1. Go to [claude.ai](https://claude.ai)
2. Start a new conversation
3. Copy the entire contents of `ai_chef_agent_prompt.md`
4. Paste it as your first message
5. Send a second message with your cooking question

### Example Session

```
[Message 1]: <paste ai_chef_agent_prompt.md contents>

[Message 2]: I have these ingredients expiring soon:
- Chicken breast (2 lbs, expires tomorrow)
- Spinach (1 bag, expires in 2 days)
- Heavy cream (1 cup, expires in 3 days)
- Parmesan cheese (block, expires in 5 days)

Family: 2 adults, 1 child (picky eater, no spicy food)
Time available: 45 minutes
Dietary: None

What should I cook tonight to use the chicken?
```

### Tips
- Create a Claude Project with the prompt as Project Knowledge
- Include your family's dietary restrictions in every query
- Ask for multiple options ranked by waste reduction

---

## Method 2: Claude API (Production)

**Best for:** In-app AI chef feature, automated meal suggestions
**Setup time:** 10 minutes
**Requirements:** Anthropic API key

### Basic Implementation (Python)

```python
import anthropic
import json
from datetime import datetime, timedelta

client = anthropic.Anthropic(api_key="your_api_key")

# Load the system prompt
with open("docs/ai_chef_agent_prompt.md", "r") as f:
    system_prompt = f.read()

def ask_chef(
    question: str,
    pantry: list[dict] = None,
    family: dict = None,
    constraints: dict = None
) -> str:
    """Ask ChefBot Pro a question with context"""
    
    # Build context message
    context_parts = []
    
    if pantry:
        context_parts.append(f"**Current Pantry:**\n```json\n{json.dumps(pantry, indent=2)}\n```")
    
    if family:
        context_parts.append(f"**Family Profile:**\n```json\n{json.dumps(family, indent=2)}\n```")
    
    if constraints:
        context_parts.append(f"**Constraints:**\n```json\n{json.dumps(constraints, indent=2)}\n```")
    
    full_message = "\n\n".join(context_parts) + f"\n\n**Question:** {question}"
    
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system=system_prompt,
        messages=[{"role": "user", "content": full_message}]
    )
    
    return response.content[0].text


# Usage Example
pantry = [
    {"name": "Chicken breast", "quantity": 2, "unit": "lbs", "expires_in_days": 1},
    {"name": "Spinach", "quantity": 1, "unit": "bag", "expires_in_days": 2},
    {"name": "Heavy cream", "quantity": 1, "unit": "cup", "expires_in_days": 3},
    {"name": "Parmesan", "quantity": 0.5, "unit": "lb", "expires_in_days": 5},
    {"name": "Pasta", "quantity": 1, "unit": "lb", "expires_in_days": 180},
    {"name": "Garlic", "quantity": 5, "unit": "cloves", "expires_in_days": 14},
]

family = {
    "members": [
        {"name": "Dad", "restrictions": [], "preferences": {"spice": "medium"}},
        {"name": "Mom", "restrictions": ["low-sodium"], "preferences": {"spice": "mild"}},
        {"name": "Tommy", "age": 6, "restrictions": [], "preferences": {"dislikes": ["mushrooms", "onions"]}}
    ],
    "skill_level": "intermediate"
}

constraints = {
    "max_time": 45,
    "budget": "moderate",
    "meal_type": "dinner"
}

answer = ask_chef(
    "What should I cook tonight to use the expiring chicken?",
    pantry=pantry,
    family=family,
    constraints=constraints
)
print(answer)
```

### TypeScript Implementation

```typescript
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const systemPrompt = fs.readFileSync('docs/ai_chef_agent_prompt.md', 'utf-8');

interface PantryItem {
  name: string;
  quantity: number;
  unit: string;
  expiresInDays: number;
  category?: string;
}

interface FamilyMember {
  name: string;
  restrictions?: string[];
  allergies?: string[];
  preferences?: {
    likes?: string[];
    dislikes?: string[];
    spiceLevel?: 'none' | 'mild' | 'medium' | 'hot';
  };
}

interface ChefContext {
  pantry?: PantryItem[];
  family?: FamilyMember[];
  constraints?: {
    maxTime?: number;
    budget?: 'tight' | 'moderate' | 'flexible';
    mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  };
}

async function askChef(question: string, context?: ChefContext): Promise<string> {
  const contextParts: string[] = [];

  if (context?.pantry) {
    contextParts.push(`**Current Pantry:**\n\`\`\`json\n${JSON.stringify(context.pantry, null, 2)}\n\`\`\``);
  }

  if (context?.family) {
    contextParts.push(`**Family:**\n\`\`\`json\n${JSON.stringify(context.family, null, 2)}\n\`\`\``);
  }

  if (context?.constraints) {
    contextParts.push(`**Constraints:**\n\`\`\`json\n${JSON.stringify(context.constraints, null, 2)}\n\`\`\``);
  }

  const fullMessage = [...contextParts, `**Question:** ${question}`].join('\n\n');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: fullMessage }],
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// Usage
const answer = await askChef('What can I make for dinner?', {
  pantry: [
    { name: 'Chicken', quantity: 1, unit: 'lb', expiresInDays: 2 },
    { name: 'Rice', quantity: 2, unit: 'cups', expiresInDays: 365 },
  ],
  family: [
    { name: 'User', restrictions: ['gluten-free'] }
  ],
  constraints: { maxTime: 30, mealType: 'dinner' }
});
```

---

## Method 3: Supabase Integration

**Best for:** Full BestMealMate integration with persistent data
**Setup time:** 30 minutes
**Requirements:** Supabase project + Anthropic API key

### Next.js API Route

```typescript
// app/api/ai-chef/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Load system prompt
const promptPath = path.join(process.cwd(), 'docs', 'ai_chef_agent_prompt.md');
const systemPrompt = fs.readFileSync(promptPath, 'utf-8');

export async function POST(request: NextRequest) {
  try {
    const { question, userId, includeContext = true } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Question required' }, { status: 400 });
    }

    let context = '';

    if (includeContext && userId) {
      // Fetch pantry items
      const { data: pantryItems } = await supabase
        .from('pantry_items')
        .select('*')
        .eq('user_id', userId)
        .order('expiration_date', { ascending: true });

      // Fetch family profile
      const { data: familyMembers } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', userId);

      // Fetch recent meal history (to avoid repetition)
      const { data: mealHistory } = await supabase
        .from('meal_history')
        .select('recipe_name, cooked_at')
        .eq('user_id', userId)
        .order('cooked_at', { ascending: false })
        .limit(14);

      // Build context
      if (pantryItems?.length) {
        const expiringItems = pantryItems.filter(item => {
          const daysLeft = Math.floor(
            (new Date(item.expiration_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          return daysLeft <= 7;
        });

        context += `\n**Pantry (${pantryItems.length} items, ${expiringItems.length} expiring soon):**\n`;
        context += '```json\n' + JSON.stringify(pantryItems.slice(0, 30), null, 2) + '\n```\n';
      }

      if (familyMembers?.length) {
        context += `\n**Family (${familyMembers.length} members):**\n`;
        context += '```json\n' + JSON.stringify(familyMembers, null, 2) + '\n```\n';
      }

      if (mealHistory?.length) {
        context += `\n**Recent Meals (last 2 weeks):**\n`;
        context += mealHistory.map(m => `- ${m.recipe_name} (${m.cooked_at})`).join('\n');
        context += '\n';
      }
    }

    const fullMessage = context + `\n**Question:** ${question}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: fullMessage }],
    });

    const answer = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';

    // Log the interaction for analytics
    if (userId) {
      await supabase.from('ai_chef_logs').insert({
        user_id: userId,
        question,
        answer,
        context_size: context.length,
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ answer, contextUsed: context.length > 0 });
  } catch (error) {
    console.error('AI Chef error:', error);
    return NextResponse.json(
      { error: 'Failed to get chef response' },
      { status: 500 }
    );
  }
}
```

### React Hook

```typescript
// hooks/useAIChef.ts
import { useState, useCallback } from 'react';

interface ChefResponse {
  answer: string;
  contextUsed: boolean;
}

export function useAIChef(userId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<ChefResponse | null>(null);

  const askChef = useCallback(async (
    question: string,
    options?: { includeContext?: boolean }
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-chef', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          userId,
          includeContext: options?.includeContext ?? true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data: ChefResponse = await response.json();
      setLastResponse(data);
      return data.answer;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Quick commands
  const getExpirationAlerts = useCallback(() => 
    askChef("What's expiring soon and what should I cook with those ingredients?"),
    [askChef]
  );

  const suggestDinner = useCallback((timeAvailable?: number) =>
    askChef(`What should I cook for dinner tonight? ${timeAvailable ? `I have ${timeAvailable} minutes.` : ''}`),
    [askChef]
  );

  const createWeeklyPlan = useCallback(() =>
    askChef("Create a weekly meal plan that uses my expiring ingredients first and minimizes grocery shopping."),
    [askChef]
  );

  const generateGroceryList = useCallback(() =>
    askChef("Generate a grocery list for this week's meal plan, subtracting what I already have."),
    [askChef]
  );

  return {
    askChef,
    isLoading,
    error,
    lastResponse,
    // Quick commands
    getExpirationAlerts,
    suggestDinner,
    createWeeklyPlan,
    generateGroceryList,
  };
}
```

### React Component Example

```tsx
// components/AIChefChat.tsx
'use client';

import { useState } from 'react';
import { useAIChef } from '@/hooks/useAIChef';

export function AIChefChat({ userId }: { userId: string }) {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{
    role: 'user' | 'chef';
    content: string;
  }>>([]);

  const { askChef, isLoading, getExpirationAlerts, suggestDinner, createWeeklyPlan } = useAIChef(userId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userQuestion = question;
    setQuestion('');
    setConversation(prev => [...prev, { role: 'user', content: userQuestion }]);

    try {
      const answer = await askChef(userQuestion);
      setConversation(prev => [...prev, { role: 'chef', content: answer }]);
    } catch {
      setConversation(prev => [...prev, { 
        role: 'chef', 
        content: 'Sorry, I had trouble answering that. Please try again.' 
      }]);
    }
  };

  const handleQuickAction = async (action: () => Promise<string>, label: string) => {
    setConversation(prev => [...prev, { role: 'user', content: label }]);
    try {
      const answer = await action();
      setConversation(prev => [...prev, { role: 'chef', content: answer }]);
    } catch {
      setConversation(prev => [...prev, { 
        role: 'chef', 
        content: 'Sorry, something went wrong.' 
      }]);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Quick Actions */}
      <div className="flex gap-2 p-4 border-b overflow-x-auto">
        <button
          onClick={() => handleQuickAction(getExpirationAlerts, "What's expiring?")}
          disabled={isLoading}
          className="px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm whitespace-nowrap hover:bg-red-200"
        >
          🚨 What's Expiring?
        </button>
        <button
          onClick={() => handleQuickAction(suggestDinner, "What's for dinner?")}
          disabled={isLoading}
          className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm whitespace-nowrap hover:bg-orange-200"
        >
          🍽️ Dinner Ideas
        </button>
        <button
          onClick={() => handleQuickAction(createWeeklyPlan, "Create meal plan")}
          disabled={isLoading}
          className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm whitespace-nowrap hover:bg-green-200"
        >
          📅 Weekly Plan
        </button>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p className="text-4xl mb-2">👨‍🍳</p>
            <p className="font-medium">Hi! I'm your AI Chef</p>
            <p className="text-sm">Ask me anything about cooking, or use the quick actions above.</p>
          </div>
        )}
        
        {conversation.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.role === 'chef' && <span className="mr-2">👨‍🍳</span>}
              <span className="whitespace-pre-wrap">{msg.content}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <span className="mr-2">👨‍🍳</span>
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your AI Chef anything..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

## Method 4: Full Service Architecture

**Best for:** Enterprise-grade meal planning with background jobs
**Setup time:** 1 hour
**Requirements:** Full backend setup

### ChefBot Service Class

```typescript
// lib/services/chef-bot-service.ts
import Anthropic from '@anthropic-ai/sdk';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

interface HouseholdContext {
  userId: string;
  pantryItems: PantryItem[];
  familyMembers: FamilyMember[];
  mealHistory: MealHistoryItem[];
  preferences: HouseholdPreferences;
}

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expirationDate: Date;
  location: 'fridge' | 'freezer' | 'pantry';
}

interface FamilyMember {
  id: string;
  name: string;
  role: 'adult' | 'child' | 'teen' | 'senior';
  restrictions: string[];
  allergies: string[];
  preferences: {
    likes: string[];
    dislikes: string[];
    spiceLevel: string;
  };
}

interface MealHistoryItem {
  recipeName: string;
  cookedAt: Date;
  rating?: number;
}

interface HouseholdPreferences {
  weeklyBudget: number;
  cookingSkillLevel: string;
  mealPrepStyle: 'daily' | 'batch' | 'mixed';
  kitchenEquipment: string[];
}

export class ChefBotService {
  private anthropic: Anthropic;
  private supabase: SupabaseClient;
  private systemPrompt: string;

  constructor() {
    this.anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const promptPath = path.join(process.cwd(), 'docs', 'ai_chef_agent_prompt.md');
    this.systemPrompt = fs.readFileSync(promptPath, 'utf-8');
  }

  private async getHouseholdContext(userId: string): Promise<HouseholdContext> {
    const [pantryResult, familyResult, historyResult, prefsResult] = await Promise.all([
      this.supabase
        .from('pantry_items')
        .select('*')
        .eq('user_id', userId)
        .order('expiration_date'),
      
      this.supabase
        .from('family_members')
        .select('*')
        .eq('user_id', userId),
      
      this.supabase
        .from('meal_history')
        .select('*')
        .eq('user_id', userId)
        .order('cooked_at', { ascending: false })
        .limit(30),
      
      this.supabase
        .from('user_profiles')
        .select('weekly_budget, cooking_skill_level, meal_prep_style, kitchen_equipment')
        .eq('user_id', userId)
        .single(),
    ]);

    return {
      userId,
      pantryItems: pantryResult.data || [],
      familyMembers: familyResult.data || [],
      mealHistory: historyResult.data || [],
      preferences: prefsResult.data || {
        weeklyBudget: 150,
        cookingSkillLevel: 'intermediate',
        mealPrepStyle: 'daily',
        kitchenEquipment: [],
      },
    };
  }

  private buildContextMessage(context: HouseholdContext): string {
    const parts: string[] = [];

    // Pantry with expiration highlighting
    if (context.pantryItems.length > 0) {
      const now = new Date();
      const itemsWithDays = context.pantryItems.map(item => ({
        ...item,
        daysUntilExpiry: Math.floor(
          (new Date(item.expirationDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        ),
      }));

      const expiring = itemsWithDays.filter(i => i.daysUntilExpiry <= 3);
      const soon = itemsWithDays.filter(i => i.daysUntilExpiry > 3 && i.daysUntilExpiry <= 7);

      parts.push(`**PANTRY INVENTORY (${context.pantryItems.length} items)**`);
      
      if (expiring.length > 0) {
        parts.push(`\n🚨 **EXPIRING IN 3 DAYS OR LESS (${expiring.length}):**`);
        parts.push('```json\n' + JSON.stringify(expiring, null, 2) + '\n```');
      }
      
      if (soon.length > 0) {
        parts.push(`\n⚠️ **Use This Week (${soon.length}):**`);
        parts.push('```json\n' + JSON.stringify(soon, null, 2) + '\n```');
      }

      parts.push(`\n📦 **Full Pantry:**\n\`\`\`json\n${JSON.stringify(itemsWithDays, null, 2)}\n\`\`\``);
    }

    // Family members
    if (context.familyMembers.length > 0) {
      parts.push(`\n**FAMILY (${context.familyMembers.length} members):**`);
      parts.push('```json\n' + JSON.stringify(context.familyMembers, null, 2) + '\n```');
    }

    // Recent meals (for variety)
    if (context.mealHistory.length > 0) {
      parts.push(`\n**RECENT MEALS (avoid repetition):**`);
      const recentNames = context.mealHistory.slice(0, 14).map(m => m.recipeName);
      parts.push(recentNames.join(', '));
    }

    // Preferences
    parts.push(`\n**HOUSEHOLD PREFERENCES:**`);
    parts.push(`- Budget: $${context.preferences.weeklyBudget}/week`);
    parts.push(`- Skill Level: ${context.preferences.cookingSkillLevel}`);
    parts.push(`- Prep Style: ${context.preferences.mealPrepStyle}`);
    if (context.preferences.kitchenEquipment?.length > 0) {
      parts.push(`- Equipment: ${context.preferences.kitchenEquipment.join(', ')}`);
    }

    return parts.join('\n');
  }

  private async chat(message: string): Promise<string> {
    const response = await this.anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: this.systemPrompt,
      messages: [{ role: 'user', content: message }],
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  // ==================== PUBLIC METHODS ====================

  async askQuestion(userId: string, question: string): Promise<string> {
    const context = await this.getHouseholdContext(userId);
    const contextMessage = this.buildContextMessage(context);
    const fullMessage = `${contextMessage}\n\n**QUESTION:** ${question}`;
    return this.chat(fullMessage);
  }

  async getExpirationAlerts(userId: string): Promise<{
    alerts: ExpirationAlert[];
    suggestedRecipes: string;
  }> {
    const context = await this.getHouseholdContext(userId);
    const now = new Date();

    const alerts: ExpirationAlert[] = context.pantryItems
      .map(item => {
        const daysLeft = Math.floor(
          (new Date(item.expirationDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        return { ...item, daysLeft };
      })
      .filter(item => item.daysLeft <= 7)
      .sort((a, b) => a.daysLeft - b.daysLeft);

    if (alerts.length === 0) {
      return { alerts: [], suggestedRecipes: 'No items expiring soon!' };
    }

    const contextMessage = this.buildContextMessage(context);
    const question = `
These items are expiring soon:
${alerts.map(a => `- ${a.name}: ${a.daysLeft} days (${a.quantity} ${a.unit})`).join('\n')}

Suggest 3 recipes that use as many of these expiring items as possible, prioritizing those expiring soonest.
For each recipe, list which expiring items it uses.
`;

    const suggestedRecipes = await this.chat(`${contextMessage}\n\n${question}`);

    return { alerts, suggestedRecipes };
  }

  async generateMealPlan(userId: string, options?: {
    days?: number;
    mealsPerDay?: ('breakfast' | 'lunch' | 'dinner')[];
    specialRequests?: string;
  }): Promise<string> {
    const context = await this.getHouseholdContext(userId);
    const contextMessage = this.buildContextMessage(context);
    
    const days = options?.days || 7;
    const meals = options?.mealsPerDay || ['dinner'];

    const question = `
Create a ${days}-day meal plan with the following requirements:
- Meals: ${meals.join(', ')} each day
- PRIORITY: Use expiring ingredients first
- Avoid recent meals for variety
- Stay within $${context.preferences.weeklyBudget} budget
- Match cooking skill level: ${context.preferences.cookingSkillLevel}
${options?.specialRequests ? `- Special requests: ${options.specialRequests}` : ''}

Format as a day-by-day plan with recipe names and brief descriptions.
At the end, list what groceries need to be purchased (not already in pantry).
`;

    return this.chat(`${contextMessage}\n\n${question}`);
  }

  async generateGroceryList(userId: string, mealPlanRecipes: string[]): Promise<string> {
    const context = await this.getHouseholdContext(userId);
    const contextMessage = this.buildContextMessage(context);

    const question = `
I want to cook these recipes this week:
${mealPlanRecipes.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Generate a grocery list that:
1. Lists all ingredients needed for these recipes
2. SUBTRACTS what I already have in the pantry
3. Groups items by store section (produce, dairy, meat, etc.)
4. Includes approximate quantities

Format clearly with checkboxes.
`;

    return this.chat(`${contextMessage}\n\n${question}`);
  }

  async suggestRecipeForIngredients(
    userId: string, 
    ingredients: string[],
    constraints?: { maxTime?: number; difficulty?: string }
  ): Promise<string> {
    const context = await this.getHouseholdContext(userId);
    const contextMessage = this.buildContextMessage(context);

    const question = `
I want to cook something using these ingredients:
${ingredients.map(i => `- ${i}`).join('\n')}

${constraints?.maxTime ? `Time available: ${constraints.maxTime} minutes` : ''}
${constraints?.difficulty ? `Difficulty preference: ${constraints.difficulty}` : ''}

Suggest 3 recipes ranked by:
1. How many of these ingredients they use
2. How well they match my family's dietary needs
3. How much they help reduce my expiring items

For each recipe, provide:
- Name
- Time required
- Difficulty
- Which requested ingredients are used
- Which expiring items are used
- Brief description
`;

    return this.chat(`${contextMessage}\n\n${question}`);
  }

  async scaleRecipe(recipeName: string, targetServings: number): Promise<string> {
    const question = `
Scale this recipe for ${targetServings} servings: ${recipeName}

Provide:
1. Scaled ingredient amounts (rounded to practical measurements)
2. Any adjustments to cooking time for larger/smaller batch
3. Tips for cooking at this scale
4. Nutrition per serving estimate
`;

    return this.chat(question);
  }
}

interface ExpirationAlert extends PantryItem {
  daysLeft: number;
}

// Export singleton instance
export const chefBot = new ChefBotService();
```

### Background Job: Daily Expiration Check

```typescript
// lib/jobs/expiration-check.ts
import { chefBot } from '../services/chef-bot-service';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function runDailyExpirationCheck() {
  console.log('Running daily expiration check...');

  // Get all users with pantry items
  const { data: users } = await supabase
    .from('user_profiles')
    .select('user_id, email, push_notifications_enabled')
    .eq('subscription_status', 'premium'); // Only for premium users

  if (!users?.length) {
    console.log('No users to check');
    return;
  }

  for (const user of users) {
    try {
      const { alerts, suggestedRecipes } = await chefBot.getExpirationAlerts(user.user_id);

      if (alerts.length === 0) continue;

      // Store alert in database
      await supabase.from('expiration_alerts').insert({
        user_id: user.user_id,
        alert_count: alerts.length,
        items: alerts,
        suggested_recipes: suggestedRecipes,
        created_at: new Date().toISOString(),
      });

      // Send notification if enabled
      if (user.push_notifications_enabled) {
        await sendPushNotification(user.user_id, {
          title: `🚨 ${alerts.length} items expiring soon!`,
          body: `Tap for recipe suggestions to use them up.`,
          data: { type: 'expiration_alert' },
        });
      }

      console.log(`Processed expiration check for user ${user.user_id}: ${alerts.length} alerts`);
    } catch (error) {
      console.error(`Error checking expirations for user ${user.user_id}:`, error);
    }
  }

  console.log('Daily expiration check complete');
}

async function sendPushNotification(userId: string, notification: {
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  // Implement your push notification logic here
  // e.g., Firebase Cloud Messaging, Expo Push, etc.
  console.log(`Would send notification to ${userId}:`, notification);
}
```

---

## Database Schema

### Supabase Tables for AI Chef

```sql
-- Add to your existing schema.sql

-- ============================================
-- PANTRY ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pantry_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  
  name TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  category TEXT NOT NULL,
  
  location TEXT DEFAULT 'pantry', -- 'fridge', 'freezer', 'pantry', 'counter'
  
  purchase_date DATE,
  expiration_date DATE,
  opened_date DATE,
  
  cost DECIMAL,
  store TEXT,
  brand TEXT,
  barcode TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pantry_items_user ON pantry_items(user_id);
CREATE INDEX idx_pantry_items_expiration ON pantry_items(user_id, expiration_date);

-- ============================================
-- FAMILY MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS family_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  
  name TEXT NOT NULL,
  role TEXT DEFAULT 'adult', -- 'adult', 'child', 'teen', 'senior'
  age INTEGER,
  
  dietary_restrictions TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  health_conditions TEXT[] DEFAULT '{}',
  
  likes TEXT[] DEFAULT '{}',
  dislikes TEXT[] DEFAULT '{}',
  spice_level TEXT DEFAULT 'medium',
  
  daily_calorie_goal INTEGER,
  max_sodium INTEGER,
  min_protein INTEGER,
  max_carbs INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_family_members_user ON family_members(user_id);

-- ============================================
-- MEAL HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS meal_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  
  recipe_name TEXT NOT NULL,
  recipe_id UUID, -- If linked to custom_recipes
  
  meal_type TEXT, -- 'breakfast', 'lunch', 'dinner', 'snack'
  cooked_at TIMESTAMPTZ DEFAULT NOW(),
  servings INTEGER DEFAULT 4,
  
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  notes TEXT,
  photo_url TEXT,
  
  ingredients_used JSONB, -- Track which pantry items were used
  estimated_cost DECIMAL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meal_history_user ON meal_history(user_id);
CREATE INDEX idx_meal_history_date ON meal_history(user_id, cooked_at DESC);

-- ============================================
-- AI CHEF LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS ai_chef_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  context_size INTEGER,
  
  tokens_used INTEGER,
  response_time_ms INTEGER,
  
  helpful BOOLEAN, -- User feedback
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_chef_logs_user ON ai_chef_logs(user_id);

-- ============================================
-- EXPIRATION ALERTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS expiration_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  
  alert_count INTEGER NOT NULL,
  items JSONB NOT NULL,
  suggested_recipes TEXT,
  
  viewed_at TIMESTAMPTZ,
  acted_on BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expiration_alerts_user ON expiration_alerts(user_id, created_at DESC);

-- ============================================
-- SAVED MEAL PLANS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS saved_meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  
  name TEXT,
  week_start DATE NOT NULL,
  
  plan_data JSONB NOT NULL, -- Full meal plan structure
  grocery_list JSONB,
  
  estimated_cost DECIMAL,
  estimated_prep_time INTEGER, -- total minutes
  
  is_active BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_meal_plans_user ON saved_meal_plans(user_id);
CREATE INDEX idx_saved_meal_plans_active ON saved_meal_plans(user_id, is_active) WHERE is_active = true;
```

---

## Best Practices

### 1. Token Management
```typescript
// Estimate context size to avoid hitting limits
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Truncate pantry to most relevant items
function preparePantryContext(items: PantryItem[], maxTokens: number = 3000): PantryItem[] {
  // Sort by expiration date (soonest first)
  const sorted = [...items].sort((a, b) => 
    new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime()
  );
  
  // Take items until we hit token limit
  const result: PantryItem[] = [];
  let tokenCount = 0;
  
  for (const item of sorted) {
    const itemTokens = estimateTokens(JSON.stringify(item));
    if (tokenCount + itemTokens > maxTokens) break;
    result.push(item);
    tokenCount += itemTokens;
  }
  
  return result;
}
```

### 2. Response Caching
```typescript
import { LRUCache } from 'lru-cache';

const responseCache = new LRUCache<string, string>({
  max: 100,
  ttl: 1000 * 60 * 30, // 30 minutes
});

function getCacheKey(userId: string, question: string, pantryHash: string): string {
  return `${userId}:${pantryHash}:${question.toLowerCase().trim()}`;
}

// Don't cache personal queries, but cache general questions
const cacheablePatterns = [
  /how to/i,
  /substitute/i,
  /convert/i,
  /storage/i,
  /freeze/i,
];

function isCacheable(question: string): boolean {
  return cacheablePatterns.some(pattern => pattern.test(question));
}
```

### 3. Error Handling
```typescript
async function safeAskChef(question: string, context: ChefContext): Promise<string> {
  try {
    return await askChef(question, context);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, 5000));
      return await askChef(question, context);
    }
    
    if (error instanceof Anthropic.APIError) {
      console.error('API error:', error);
      return "I'm having trouble right now. Please try again in a moment.";
    }
    
    throw error;
  }
}
```

### 4. User Feedback Loop
```typescript
// Track which suggestions users actually cook
async function trackRecipeCooked(
  userId: string,
  recipeName: string,
  wasFromAiSuggestion: boolean,
  rating?: number
) {
  await supabase.from('meal_history').insert({
    user_id: userId,
    recipe_name: recipeName,
    cooked_at: new Date().toISOString(),
    ai_suggested: wasFromAiSuggestion,
    rating,
  });
  
  // Use this data to improve suggestions
  // Higher-rated AI suggestions = better prompts
}
```

---

## Next Steps

1. Start with **Method 1** (Claude Web) to test the prompt
2. Implement **Method 2** (API) for basic app integration
3. Add **Method 3** (Supabase) for full context awareness
4. Scale to **Method 4** (Service) for background jobs and advanced features

---

**Your AI Chef is ready to cook! 👨‍🍳**
