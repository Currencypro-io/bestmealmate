import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Supabase client for conversation storage
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const CHEF_SYSTEM_PROMPT = `You are ChefBot, a friendly AI cooking assistant for the BestMealMate app. You help families plan meals, cook recipes, and manage their kitchen.

## Your Personality
- Warm, encouraging, and patient - like a helpful friend in the kitchen
- You speak naturally and conversationally, as if talking out loud
- Keep responses concise for voice - users are cooking hands-free
- Use simple language, avoid jargon

## Your Capabilities
1. **Recipe Guidance**: Walk users through recipes step-by-step
2. **Meal Planning**: Suggest meals based on ingredients, dietary needs, time available
3. **Ingredient Substitutions**: Know what can replace what
4. **Cooking Tips**: Temperature, timing, techniques
5. **Dietary Accommodations**: Handle allergies, restrictions, picky eaters
6. **Food Storage**: How long things last, how to store them

## Family Context
You remember each family's:
- Member names and their dietary restrictions/allergies
- Food preferences (likes/dislikes)
- Cooking skill level
- Past conversations and preferences

## Response Style
- For step-by-step cooking: Give ONE step at a time, wait for "next" or "done"
- For questions: Be helpful but brief (1-3 sentences for voice)
- For meal suggestions: Offer 2-3 options with brief descriptions
- Always acknowledge allergies/restrictions when relevant

## Safety
- ALWAYS warn about allergens when you know family members have allergies
- Remind about food safety (temperatures, cross-contamination) when relevant
- If unsure about dietary safety, err on the side of caution

When the user shares their family profile, remember it for the conversation.`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface FamilyMember {
  name: string;
  allergies?: string[];
  restrictions?: string[];
  likes?: string[];
  dislikes?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      conversationHistory = [],
      userId,
      familyProfile,
      currentMealPlan,
      scannedIngredients,
    } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 500 });
    }

    // Build context from family profile and other data
    let contextMessage = '';

    if (familyProfile?.members?.length > 0) {
      contextMessage += '\n\n## Family Profile:\n';
      (familyProfile.members as FamilyMember[]).forEach((member: FamilyMember) => {
        contextMessage += `- **${member.name}**`;
        if (member.allergies?.length) contextMessage += ` | Allergies: ${member.allergies.join(', ')}`;
        if (member.restrictions?.length) contextMessage += ` | Restrictions: ${member.restrictions.join(', ')}`;
        if (member.dislikes?.length) contextMessage += ` | Dislikes: ${member.dislikes.join(', ')}`;
        contextMessage += '\n';
      });
    }

    if (currentMealPlan && Object.keys(currentMealPlan).length > 0) {
      contextMessage += '\n## Current Meal Plan:\n';
      Object.entries(currentMealPlan).forEach(([day, meals]) => {
        contextMessage += `${day}: ${JSON.stringify(meals)}\n`;
      });
    }

    if (scannedIngredients?.length > 0) {
      contextMessage += '\n## Recently Scanned Ingredients:\n';
      contextMessage += scannedIngredients.map((i: { name: string; quantity?: string }) =>
        `- ${i.name}${i.quantity ? ` (${i.quantity})` : ''}`
      ).join('\n');
    }

    // Prepare messages for Claude
    const messages: Message[] = [
      ...conversationHistory.slice(-20), // Keep last 20 messages for context
      { role: 'user' as const, content: message }
    ];

    // Add context to system prompt if we have it
    const systemPrompt = contextMessage
      ? `${CHEF_SYSTEM_PROMPT}\n\n---\n## Current Context:${contextMessage}`
      : CHEF_SYSTEM_PROMPT;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    });

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    // Store conversation in Supabase if we have a userId
    const supabase = getSupabase();
    if (supabase && userId) {
      try {
        await supabase.from('chef_conversations').upsert({
          user_id: userId,
          messages: [...conversationHistory,
            { role: 'user', content: message },
            { role: 'assistant', content: assistantMessage }
          ],
          family_profile: familyProfile,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
      } catch (dbError) {
        console.error('Failed to save conversation:', dbError);
        // Continue anyway - conversation storage is optional
      }
    }

    return NextResponse.json({
      message: assistantMessage,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: message },
        { role: 'assistant', content: assistantMessage }
      ],
    });

  } catch (error) {
    console.error('AI Chef error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI Chef' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve conversation history
// Security: userId must be provided by authenticated client, validated server-side
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  // Validate userId format (should be email or UUID)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!emailRegex.test(userId) && !uuidRegex.test(userId)) {
    return NextResponse.json({ error: 'Invalid userId format' }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ messages: [], familyProfile: null });
  }

  try {
    const { data } = await supabase
      .from('chef_conversations')
      .select('messages, family_profile')
      .eq('user_id', userId)
      .single();

    // Only return messages, not the full family profile on GET (privacy)
    return NextResponse.json({
      messages: data?.messages || [],
      familyProfile: null, // Client should use their local profile
    });
  } catch {
    return NextResponse.json({ messages: [], familyProfile: null });
  }
}
