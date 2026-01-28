import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
  limit: number;      // Max requests
  window: number;     // Time window in seconds
}

// In-memory store for rate limiting (use Redis in production for multi-instance)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean every minute

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = { limit: 10, window: 60 }
): { success: boolean; remaining: number; resetAt: number } {
  const ip = getClientIp(request);
  const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();
  const windowMs = config.window * 1000;

  let record = rateLimitStore.get(key);

  if (!record || record.resetAt < now) {
    record = { count: 1, resetAt: now + windowMs };
    rateLimitStore.set(key, record);
    return { success: true, remaining: config.limit - 1, resetAt: record.resetAt };
  }

  record.count++;
  rateLimitStore.set(key, record);

  if (record.count > config.limit) {
    return { success: false, remaining: 0, resetAt: record.resetAt };
  }

  return { success: true, remaining: config.limit - record.count, resetAt: record.resetAt };
}

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config?: RateLimitConfig
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const result = rateLimit(request, config);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(config?.limit ?? 10),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
            'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const response = await handler(request);

    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', String(config?.limit ?? 10));
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetAt / 1000)));

    return response;
  };
}
