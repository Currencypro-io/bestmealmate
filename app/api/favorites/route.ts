import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function getUserId(request: NextRequest): string {
  return request.headers.get('x-user-id') || 'anonymous';
}

export interface Favorite {
  id?: string;
  user_id: string;
  recipe_name: string;
  recipe_type: 'builtin' | 'custom';
  custom_recipe_id?: string;
  notes?: string;
  rating?: number;
  created_at?: string;
}

// GET - Fetch user's favorites
export async function GET(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const userId = getUserId(request);

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
      return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
    }

    return NextResponse.json({ favorites: data || [] });
  } catch (error) {
    console.error('Favorites API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Add a favorite
export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const userId = getUserId(request);

  try {
    const body = await request.json();
    const { recipe_name, recipe_type, custom_recipe_id, notes, rating } = body;

    if (!recipe_name) {
      return NextResponse.json({ error: 'Recipe name is required' }, { status: 400 });
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const favorite: Favorite = {
      user_id: userId,
      recipe_name,
      recipe_type: recipe_type || 'builtin',
      custom_recipe_id: custom_recipe_id || null,
      notes: notes || null,
      rating: rating || null,
    };

    // Upsert to handle toggling favorites
    const { data, error } = await supabase
      .from('favorites')
      .upsert(favorite, {
        onConflict: 'user_id,recipe_name,recipe_type',
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding favorite:', error);
      return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
    }

    return NextResponse.json({ favorite: data }, { status: 201 });
  } catch (error) {
    console.error('Add favorite error:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// PUT - Update a favorite (rating, notes)
export async function PUT(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const userId = getUserId(request);

  try {
    const body = await request.json();
    const { recipe_name, recipe_type, notes, rating } = body;

    if (!recipe_name) {
      return NextResponse.json({ error: 'Recipe name is required' }, { status: 400 });
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const updates: Partial<Favorite> = {};
    if (notes !== undefined) updates.notes = notes;
    if (rating !== undefined) updates.rating = rating;

    const { data, error } = await supabase
      .from('favorites')
      .update(updates)
      .eq('user_id', userId)
      .eq('recipe_name', recipe_name)
      .eq('recipe_type', recipe_type || 'builtin')
      .select()
      .single();

    if (error) {
      console.error('Error updating favorite:', error);
      return NextResponse.json({ error: 'Failed to update favorite' }, { status: 500 });
    }

    return NextResponse.json({ favorite: data });
  } catch (error) {
    console.error('Update favorite error:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE - Remove a favorite
export async function DELETE(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const userId = getUserId(request);
  const recipeName = request.nextUrl.searchParams.get('recipe_name');
  const recipeType = request.nextUrl.searchParams.get('recipe_type') || 'builtin';

  if (!recipeName) {
    return NextResponse.json({ error: 'Recipe name is required' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_name', recipeName)
      .eq('recipe_type', recipeType);

    if (error) {
      console.error('Error removing favorite:', error);
      return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete favorite error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
