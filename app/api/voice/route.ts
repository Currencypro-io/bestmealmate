import { NextRequest, NextResponse } from 'next/server';

// ElevenLabs API endpoint
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Premium voice IDs - Rachel (warm, friendly) or others
const VOICE_OPTIONS = {
  rachel: '21m00Tcm4TlvDq8ikWAM', // Rachel - warm, conversational
  josh: 'TxGEqnHWrfWFTfGW9XjX',   // Josh - friendly male
  bella: 'EXAVITQu4vr4xnSDxMaL',  // Bella - soft female
  adam: 'pNInz6obpgDQGcFmaJgB',   // Adam - deep male
} as const;

// Default to Rachel for warm cooking assistant vibe
const DEFAULT_VOICE = VOICE_OPTIONS.rachel;

export async function POST(request: NextRequest) {
  try {
    const { text, voice } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Voice service not configured' },
        { status: 503 }
      );
    }

    const voiceId = voice && VOICE_OPTIONS[voice as keyof typeof VOICE_OPTIONS]
      ? VOICE_OPTIONS[voice as keyof typeof VOICE_OPTIONS]
      : DEFAULT_VOICE;

    // Call ElevenLabs Text-to-Speech API
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5', // Latest turbo model - fast + high quality
          voice_settings: {
            stability: 0.5,        // Balance between stable and expressive
            similarity_boost: 0.75, // Sound like the original voice
            style: 0.5,            // Some expressiveness
            use_speaker_boost: true // Clearer audio
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs error:', error);
      return NextResponse.json(
        { error: 'Voice generation failed' },
        { status: response.status }
      );
    }

    // Stream the audio back to client
    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('Voice API error:', error);
    return NextResponse.json(
      { error: 'Voice service error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check available voices
export async function GET() {
  return NextResponse.json({
    voices: Object.keys(VOICE_OPTIONS),
    default: 'rachel',
    description: {
      rachel: 'Warm, friendly female voice (recommended for cooking assistant)',
      josh: 'Friendly, approachable male voice',
      bella: 'Soft, gentle female voice',
      adam: 'Deep, authoritative male voice',
    }
  });
}
