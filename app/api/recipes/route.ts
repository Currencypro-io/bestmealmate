import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Get anonymous user ID from header or generate one
function getUserId(request: NextRequest): string {
  return request.headers.get('x-user-id') || 'anonymous';
}

export interface CustomRecipe {
  id?: string;
  user_id: string;
  name: string;
  description?: string;
  image_url?: string;
  prep_time?: string;
  cook_time?: string;
  servings?: number;
  calories?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  ingredients?: Array<{ item: string; amount: string; calories?: number }>;
  prep_steps?: string[];
  cooking_steps?: string[];
  nutrition?: { protein?: number; carbs?: number; fat?: number; fiber?: number };
  is_public?: boolean;
}

// GET - Fetch user's recipes or public recipes
export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const userId = getUserId(request);
  const includePublic = request.nextUrl.searchParams.get('includePublic') === 'true';
  const recipeId = request.nextUrl.searchParams.get('id');

  try {
    // Fetch single recipe by ID
    if (recipeId) {
      const { data, error } = await supabase
        .from('custom_recipes')
        .select('*')
        .eq('id', recipeId)
        .single();

      if (error) {
        return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
      }

      // Only return if it's the user's recipe or it's public
      if (data.user_id !== userId && !data.is_public) {
        return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
      }

      return NextResponse.json({ recipe: data });
    }

    // Fetch all user's recipes
    let query = supabase
      .from('custom_recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (includePublic) {
      // Get user's recipes OR public recipes
      query = query.or(`user_id.eq.${userId},is_public.eq.true`);
    } else {
      // Get only user's recipes
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching recipes:', error);
      return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
    }

    return NextResponse.json({ recipes: data || [] });
  } catch (error) {
    console.error('Recipes API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new recipe
export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const userId = getUserId(request);

  try {
    const body = await request.json();
    const {
      name,
      description,
      image_url,
      prep_time,
      cook_time,
      servings,
      calories,
      difficulty,
      tags,
      ingredients,
      prep_steps,
      cooking_steps,
      nutrition,
      is_public,
    } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Recipe name is required' }, { status: 400 });
    }

    const recipe: CustomRecipe = {
      user_id: userId,
      name: name.trim(),
      description: description?.trim() || null,
      image_url: image_url || null,
      prep_time: prep_time || null,
      cook_time: cook_time || null,
      servings: servings || 4,
      calories: calories || null,
      difficulty: difficulty || 'Medium',
      tags: tags || [],
      ingredients: ingredients || [],
      prep_steps: prep_steps || [],
      cooking_steps: cooking_steps || [],
      nutrition: nutrition || {},
      is_public: is_public || false,
    };

    const { data, error } = await supabase
      .from('custom_recipes')
      .insert(recipe)
      .select()
      .single();

    if (error) {
      console.error('Error creating recipe:', error);
      return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
    }

    return NextResponse.json({ recipe: data }, { status: 201 });
  } catch (error) {
    console.error('Create recipe error:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// PUT - Update an existing recipe
export async function PUT(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const userId = getUserId(request);

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    // First verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('custom_recipes')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    if (existing.user_id !== userId) {
      return NextResponse.json({ error: 'Not authorized to edit this recipe' }, { status: 403 });
    }

    // Update the recipe
    const { data, error } = await supabase
      .from('custom_recipes')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating recipe:', error);
      return NextResponse.json({ error: 'Failed to update recipe' }, { status: 500 });
    }

    return NextResponse.json({ recipe: data });
  } catch (error) {
    console.error('Update recipe error:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE - Delete a recipe
export async function DELETE(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const userId = getUserId(request);
  const recipeId = request.nextUrl.searchParams.get('id');

  if (!recipeId) {
    return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
  }

  try {
    // First verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from('custom_recipes')
      .select('user_id')
      .eq('id', recipeId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    if (existing.user_id !== userId) {
      return NextResponse.json({ error: 'Not authorized to delete this recipe' }, { status: 403 });
    }

    // Delete the recipe
    const { error } = await supabase
      .from('custom_recipes')
      .delete()
      .eq('id', recipeId);

    if (error) {
      console.error('Error deleting recipe:', error);
      return NextResponse.json({ error: 'Failed to delete recipe' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete recipe error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
