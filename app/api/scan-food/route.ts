import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image, mode } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Different prompts based on mode
    const prompts: Record<string, string> = {
      identify: `You are a food identification expert. Analyze this image and identify all visible food items and ingredients.

Return a JSON response with this exact structure:
{
  "ingredients": [
    { "name": "ingredient name", "quantity": "estimated quantity", "freshness": "fresh/good/use soon/expired", "category": "produce/protein/dairy/grain/pantry/other" }
  ],
  "totalItems": number,
  "suggestions": ["brief suggestion 1", "brief suggestion 2"]
}

Be specific about quantities (e.g., "2 medium tomatoes", "1 lb chicken breast", "half bunch of cilantro").
Only return valid JSON, no other text.`,

      budget: `You are a budget-conscious meal planning expert. Analyze this image of food/ingredients and suggest budget-friendly meals.

Return a JSON response with this exact structure:
{
  "ingredients": [
    { "name": "ingredient name", "estimatedCost": "$X.XX", "category": "produce/protein/dairy/grain/pantry" }
  ],
  "budgetMeals": [
    { "name": "meal name", "estimatedCost": "$X.XX", "servings": number, "costPerServing": "$X.XX", "ingredients": ["ing1", "ing2"], "instructions": "brief instructions" }
  ],
  "totalEstimatedCost": "$X.XX",
  "savingsTips": ["tip 1", "tip 2"]
}

Focus on affordable, nutritious meals. Only return valid JSON, no other text.`,

      leftovers: `You are a creative chef specializing in transforming leftovers. Analyze this image of leftover food and suggest creative ways to use them.

Return a JSON response with this exact structure:
{
  "leftovers": [
    { "name": "leftover item", "condition": "good/fair/use today", "amount": "estimated amount" }
  ],
  "mealIdeas": [
    { "name": "meal name", "type": "breakfast/lunch/dinner/snack", "difficulty": "easy/medium", "time": "X min", "ingredients": ["leftover1", "additional item"], "instructions": "step by step brief instructions", "creativityLevel": "classic/creative/fusion" }
  ],
  "storageTips": ["tip for extending freshness"],
  "priorityUse": ["item to use first", "second priority"]
}

Be creative but practical. Only return valid JSON, no other text.`
    };

    const systemPrompt = prompts[mode] || prompts.identify;

    // Extract base64 data and media type
    const matches = image.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
      return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });
    }

    const mediaType = matches[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    const base64Data = matches[2];

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: systemPrompt,
            },
          ],
        },
      ],
    });

    // Extract the text response
    const textContent = response.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    // Parse JSON from response
    try {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ success: true, data: parsed, mode });
      }
    } catch {
      // If JSON parsing fails, return raw text
      return NextResponse.json({
        success: true,
        data: { raw: textContent.text },
        mode
      });
    }

    return NextResponse.json({
      success: true,
      data: { raw: textContent.text },
      mode
    });

  } catch (error) {
    console.error('Food scan error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}
