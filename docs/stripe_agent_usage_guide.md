# StripeBot Pro - Implementation Guide

This guide shows you how to deploy StripeBot Pro in your application using four different methods, from simple (Claude Web) to advanced (Multi-Agent systems).

---

## Table of Contents

1. [Method 1: Claude Web (Instant)](#method-1-claude-web-instant)
2. [Method 2: Claude API (Production)](#method-2-claude-api-production)
3. [Method 3: Agentic Tools (Live API Access)](#method-3-agentic-tools-live-api-access)
4. [Method 4: Multi-Agent (Specialized Sub-Agents)](#method-4-multi-agent-specialized-sub-agents)
5. [Framework Integrations](#framework-integrations)
6. [Best Practices](#best-practices)

---

## Method 1: Claude Web (Instant)

**Best for:** Quick questions, debugging, learning
**Setup time:** 30 seconds
**Requirements:** Claude.ai account (free tier works)

### Steps

1. Go to [claude.ai](https://claude.ai)
2. Start a new conversation
3. Copy the entire contents of `stripe_agent_prompt.md`
4. Paste it as your first message
5. Send a second message with your Stripe question

### Example Session

```
[Message 1]: <paste stripe_agent_prompt.md contents>

[Message 2]: My webhook endpoint is receiving events but my database 
isn't updating. Here's my handler code:

export async function POST(request: NextRequest) {
  const body = await request.text();
  // ... rest of code
}

What am I missing?
```

### Tips
- Create a Claude Project and add the prompt as Project Knowledge
- This makes the prompt persistent across conversations
- Use "Continue this chat" to maintain context

---

## Method 2: Claude API (Production)

**Best for:** Automated support, internal tools, customer-facing chat
**Setup time:** 5 minutes
**Requirements:** Anthropic API key

### Basic Implementation

```python
import anthropic

# Initialize client
client = anthropic.Anthropic(api_key="your_api_key")

# Load the system prompt
with open("docs/stripe_agent_prompt.md", "r") as f:
    system_prompt = f.read()

def ask_stripe_agent(question: str) -> str:
    """Ask StripeBot Pro a question"""
    response = client.messages.create(
        model="claude-sonnet-4-20250514",  # or claude-opus-4-20250514 for complex issues
        max_tokens=4096,
        system=system_prompt,
        messages=[
            {"role": "user", "content": question}
        ]
    )
    return response.content[0].text

# Usage
answer = ask_stripe_agent("""
My checkout session is returning a 400 error with message 
"Price not found". The price ID is price_1234abc. 
What should I check?
""")
print(answer)
```

### With Conversation History

```python
class StripeAgentChat:
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.messages = []
        
        with open("docs/stripe_agent_prompt.md", "r") as f:
            self.system_prompt = f.read()
    
    def chat(self, user_message: str) -> str:
        """Send a message and get a response"""
        self.messages.append({
            "role": "user",
            "content": user_message
        })
        
        response = self.client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=self.system_prompt,
            messages=self.messages
        )
        
        assistant_message = response.content[0].text
        self.messages.append({
            "role": "assistant",
            "content": assistant_message
        })
        
        return assistant_message
    
    def clear_history(self):
        """Clear conversation history"""
        self.messages = []

# Usage
agent = StripeAgentChat(api_key="your_api_key")

# First question
print(agent.chat("Why is my webhook returning 400 errors?"))

# Follow-up (maintains context)
print(agent.chat("How do I verify the signature in Next.js?"))

# Start fresh
agent.clear_history()
```

### TypeScript/JavaScript Implementation

```typescript
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const systemPrompt = fs.readFileSync('docs/stripe_agent_prompt.md', 'utf-8');

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

class StripeAgent {
  private messages: Message[] = [];

  async chat(userMessage: string): Promise<string> {
    this.messages.push({ role: 'user', content: userMessage });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: this.messages,
    });

    const assistantMessage = response.content[0].type === 'text' 
      ? response.content[0].text 
      : '';
    
    this.messages.push({ role: 'assistant', content: assistantMessage });
    return assistantMessage;
  }

  clearHistory(): void {
    this.messages = [];
  }
}

// Usage
const agent = new StripeAgent();
const answer = await agent.chat('How do I handle card_declined errors?');
console.log(answer);
```

---

## Method 3: Agentic Tools (Live API Access)

**Best for:** Automated diagnosis, real-time data access
**Setup time:** 15 minutes
**Requirements:** Anthropic API key + Stripe API key

This method gives Claude tools to actually query your Stripe account.

### Tool Definitions

```python
import anthropic
import stripe
import json

stripe.api_key = "your_stripe_secret_key"
client = anthropic.Anthropic(api_key="your_anthropic_api_key")

# Define tools the agent can use
tools = [
    {
        "name": "get_payment_intent",
        "description": "Retrieve a payment intent by ID to see its status, error codes, and metadata",
        "input_schema": {
            "type": "object",
            "properties": {
                "payment_intent_id": {
                    "type": "string",
                    "description": "The payment intent ID (starts with pi_)"
                }
            },
            "required": ["payment_intent_id"]
        }
    },
    {
        "name": "get_subscription",
        "description": "Retrieve a subscription by ID to see its status, current period, and items",
        "input_schema": {
            "type": "object",
            "properties": {
                "subscription_id": {
                    "type": "string",
                    "description": "The subscription ID (starts with sub_)"
                }
            },
            "required": ["subscription_id"]
        }
    },
    {
        "name": "list_recent_events",
        "description": "List recent webhook events, optionally filtered by type",
        "input_schema": {
            "type": "object",
            "properties": {
                "event_type": {
                    "type": "string",
                    "description": "Optional event type filter (e.g., 'checkout.session.completed')"
                },
                "limit": {
                    "type": "integer",
                    "description": "Number of events to retrieve (max 100)",
                    "default": 10
                }
            }
        }
    },
    {
        "name": "get_customer",
        "description": "Retrieve a customer by ID or email",
        "input_schema": {
            "type": "object",
            "properties": {
                "customer_id": {
                    "type": "string",
                    "description": "Customer ID (starts with cus_)"
                },
                "email": {
                    "type": "string",
                    "description": "Customer email (alternative to ID)"
                }
            }
        }
    },
    {
        "name": "list_webhook_endpoints",
        "description": "List all configured webhook endpoints and their status",
        "input_schema": {
            "type": "object",
            "properties": {}
        }
    }
]

def execute_tool(name: str, input_data: dict) -> str:
    """Execute a tool and return the result"""
    try:
        if name == "get_payment_intent":
            pi = stripe.PaymentIntent.retrieve(input_data["payment_intent_id"])
            return json.dumps({
                "id": pi.id,
                "status": pi.status,
                "amount": pi.amount,
                "currency": pi.currency,
                "last_payment_error": pi.last_payment_error,
                "metadata": pi.metadata
            }, indent=2)
        
        elif name == "get_subscription":
            sub = stripe.Subscription.retrieve(input_data["subscription_id"])
            return json.dumps({
                "id": sub.id,
                "status": sub.status,
                "current_period_end": sub.current_period_end,
                "cancel_at_period_end": sub.cancel_at_period_end,
                "items": [{"price": item.price.id} for item in sub["items"]["data"]]
            }, indent=2)
        
        elif name == "list_recent_events":
            params = {"limit": input_data.get("limit", 10)}
            if "event_type" in input_data:
                params["type"] = input_data["event_type"]
            events = stripe.Event.list(**params)
            return json.dumps([{
                "id": e.id,
                "type": e.type,
                "created": e.created
            } for e in events.data], indent=2)
        
        elif name == "get_customer":
            if "customer_id" in input_data:
                cust = stripe.Customer.retrieve(input_data["customer_id"])
            else:
                customers = stripe.Customer.list(email=input_data["email"], limit=1)
                cust = customers.data[0] if customers.data else None
            
            if not cust:
                return "Customer not found"
            
            return json.dumps({
                "id": cust.id,
                "email": cust.email,
                "name": cust.name,
                "created": cust.created
            }, indent=2)
        
        elif name == "list_webhook_endpoints":
            endpoints = stripe.WebhookEndpoint.list()
            return json.dumps([{
                "id": e.id,
                "url": e.url,
                "status": e.status,
                "enabled_events": e.enabled_events
            } for e in endpoints.data], indent=2)
        
        return f"Unknown tool: {name}"
    
    except stripe.error.StripeError as e:
        return f"Stripe API error: {e.user_message}"
    except Exception as e:
        return f"Error: {str(e)}"


def run_agent_with_tools(question: str) -> str:
    """Run the agent with tool access"""
    with open("docs/stripe_agent_prompt.md", "r") as f:
        system_prompt = f.read()
    
    messages = [{"role": "user", "content": question}]
    
    while True:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            system=system_prompt,
            tools=tools,
            messages=messages
        )
        
        # Check if we're done (no more tool calls)
        if response.stop_reason == "end_turn":
            # Extract final text response
            for block in response.content:
                if hasattr(block, 'text'):
                    return block.text
            return "No response generated"
        
        # Process tool calls
        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })
        
        # Add assistant response and tool results to messages
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})

# Usage
answer = run_agent_with_tools("""
Check the status of subscription sub_1234abc and tell me 
if there are any issues I should be aware of.
""")
print(answer)
```

---

## Method 4: Multi-Agent (Specialized Sub-Agents)

**Best for:** Complex issues, enterprise support systems
**Setup time:** 30 minutes
**Requirements:** Anthropic API key

This creates specialized agents for different Stripe domains.

### Architecture

```
┌─────────────────────────────────────────────────┐
│              Dispatcher Agent                    │
│   (Routes questions to specialized agents)       │
└─────────────────┬───────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Payment │ │ Webhook │ │ Connect │
│  Agent  │ │  Agent  │ │  Agent  │
└─────────┘ └─────────┘ └─────────┘
```

### Implementation

```python
import anthropic
from enum import Enum
from typing import Optional

client = anthropic.Anthropic(api_key="your_api_key")

class AgentType(Enum):
    PAYMENTS = "payments"
    WEBHOOKS = "webhooks"
    SUBSCRIPTIONS = "subscriptions"
    CONNECT = "connect"
    DISPUTES = "disputes"
    GENERAL = "general"

# Specialized prompts for each domain
SPECIALIZED_PROMPTS = {
    AgentType.PAYMENTS: """You are a Stripe Payments specialist. 
Focus on: Payment Intents, Checkout Sessions, card declines, 
3D Secure, Payment Methods, and payment failures.
Always provide specific decline codes and recovery strategies.""",
    
    AgentType.WEBHOOKS: """You are a Stripe Webhooks specialist.
Focus on: Webhook setup, signature verification, event handling,
retry logic, idempotency, and debugging delivery issues.
Always verify HTTPS and proper response codes.""",
    
    AgentType.SUBSCRIPTIONS: """You are a Stripe Subscriptions specialist.
Focus on: Billing cycles, proration, trials, cancellation,
dunning, invoices, and usage-based billing.
Always consider customer retention strategies.""",
    
    AgentType.CONNECT: """You are a Stripe Connect specialist.
Focus on: Account types, onboarding, transfers, payouts,
platform fees, and compliance requirements.
Always consider marketplace vs platform use cases.""",
    
    AgentType.DISPUTES: """You are a Stripe Disputes specialist.
Focus on: Evidence submission, fraud prevention, Radar rules,
chargeback management, and win rate optimization.
Always prioritize prevention over recovery.""",
    
    AgentType.GENERAL: """You are a general Stripe expert.
Handle any Stripe-related question with comprehensive knowledge."""
}

def classify_question(question: str) -> AgentType:
    """Use Claude to classify the question type"""
    response = client.messages.create(
        model="claude-haiku-3-20240307",  # Fast model for classification
        max_tokens=50,
        messages=[{
            "role": "user",
            "content": f"""Classify this Stripe question into ONE category:
- payments (card declines, checkout, payment intents)
- webhooks (event handling, signatures, delivery)
- subscriptions (billing, trials, cancellation)
- connect (marketplaces, payouts, connected accounts)
- disputes (chargebacks, fraud, evidence)
- general (other)

Question: {question}

Reply with only the category name."""
        }]
    )
    
    category = response.content[0].text.strip().lower()
    
    try:
        return AgentType(category)
    except ValueError:
        return AgentType.GENERAL


def get_specialized_response(question: str, agent_type: AgentType) -> str:
    """Get response from specialized agent"""
    with open("docs/stripe_agent_prompt.md", "r") as f:
        base_prompt = f.read()
    
    # Combine base prompt with specialization
    full_prompt = f"""{base_prompt}

---
## SPECIALIZATION
{SPECIALIZED_PROMPTS[agent_type]}

Focus your response on your area of expertise. If the question 
requires knowledge outside your specialty, acknowledge this and 
provide what help you can.
"""
    
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system=full_prompt,
        messages=[{"role": "user", "content": question}]
    )
    
    return response.content[0].text


def multi_agent_response(question: str) -> dict:
    """Route question to appropriate specialist and get response"""
    # Step 1: Classify
    agent_type = classify_question(question)
    
    # Step 2: Get specialized response
    response = get_specialized_response(question, agent_type)
    
    return {
        "specialist": agent_type.value,
        "response": response
    }


# Usage
result = multi_agent_response("""
We're building a marketplace and need to split payments 
between our platform and sellers. Sometimes sellers complain 
their payouts are delayed. How should we handle this?
""")

print(f"Handled by: {result['specialist']} specialist")
print(f"Response: {result['response']}")
```

---

## Framework Integrations

### Next.js API Route

```typescript
// app/api/stripe-agent/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(request: NextRequest) {
  const { question, conversationHistory = [] } = await request.json();

  if (!question) {
    return NextResponse.json(
      { error: 'Question is required' },
      { status: 400 }
    );
  }

  const promptPath = path.join(process.cwd(), 'docs', 'stripe_agent_prompt.md');
  const systemPrompt = fs.readFileSync(promptPath, 'utf-8');

  const messages = [
    ...conversationHistory,
    { role: 'user' as const, content: question }
  ];

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages,
    });

    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    return NextResponse.json({
      answer: assistantMessage,
      conversationHistory: [
        ...messages,
        { role: 'assistant', content: assistantMessage }
      ]
    });
  } catch (error) {
    console.error('Stripe agent error:', error);
    return NextResponse.json(
      { error: 'Failed to process question' },
      { status: 500 }
    );
  }
}
```

### React Hook

```typescript
// hooks/useStripeAgent.ts
import { useState, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useStripeAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (question: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          conversationHistory: messages
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      setMessages(prev => [
        ...prev,
        { role: 'user', content: question },
        { role: 'assistant', content: data.answer }
      ]);

      return data.answer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory
  };
}
```

### Slack Integration

```typescript
// Slack bot handler
import { App } from '@slack/bolt';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const systemPrompt = fs.readFileSync('docs/stripe_agent_prompt.md', 'utf-8');

// Store conversation history per channel
const conversations = new Map<string, Array<{role: string; content: string}>>();

app.message(async ({ message, say }) => {
  if (message.type !== 'message' || !('text' in message)) return;
  
  const channelId = message.channel;
  const userMessage = message.text;
  
  // Skip if not mentioning the bot or in DM
  if (!userMessage?.includes('<@') && message.channel_type !== 'im') return;
  
  // Get or create conversation history
  const history = conversations.get(channelId) || [];
  history.push({ role: 'user', content: userMessage });
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: history as any
    });
    
    const assistantMessage = response.content[0].type === 'text'
      ? response.content[0].text
      : 'I could not generate a response.';
    
    history.push({ role: 'assistant', content: assistantMessage });
    conversations.set(channelId, history.slice(-20)); // Keep last 20 messages
    
    await say(assistantMessage);
  } catch (error) {
    console.error('Stripe agent error:', error);
    await say('Sorry, I encountered an error processing your question.');
  }
});

// Clear history command
app.command('/clear-stripe-history', async ({ command, ack, respond }) => {
  await ack();
  conversations.delete(command.channel_id);
  await respond('Conversation history cleared!');
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Stripe Agent Slack bot is running!');
})();
```

---

## Best Practices

### 1. Token Management
```python
# Estimate tokens to avoid hitting limits
def estimate_tokens(text: str) -> int:
    # Rough estimate: 1 token ≈ 4 characters
    return len(text) // 4

# Truncate conversation history if needed
def manage_history(messages: list, max_tokens: int = 50000) -> list:
    total = sum(estimate_tokens(m['content']) for m in messages)
    while total > max_tokens and len(messages) > 2:
        messages.pop(0)
        total = sum(estimate_tokens(m['content']) for m in messages)
    return messages
```

### 2. Error Handling
```python
import anthropic

def safe_agent_call(question: str) -> str:
    try:
        return ask_stripe_agent(question)
    except anthropic.RateLimitError:
        return "The AI is currently busy. Please try again in a moment."
    except anthropic.APIError as e:
        return f"API error: {e.message}. Please try again."
    except Exception as e:
        return f"Unexpected error: {str(e)}"
```

### 3. Response Caching
```python
import hashlib
from functools import lru_cache

@lru_cache(maxsize=100)
def cached_agent_response(question_hash: str) -> str:
    # Note: Only cache general questions, not account-specific queries
    return ask_stripe_agent(question_hash)

def get_cached_or_fresh(question: str, use_cache: bool = True) -> str:
    if not use_cache:
        return ask_stripe_agent(question)
    
    question_hash = hashlib.md5(question.encode()).hexdigest()
    return cached_agent_response(question_hash)
```

### 4. Prompt Versioning
```python
import os
from datetime import datetime

def load_prompt_with_version() -> tuple[str, str]:
    prompt_path = "docs/stripe_agent_prompt.md"
    
    with open(prompt_path, "r") as f:
        content = f.read()
    
    # Get file modification time as version
    mtime = os.path.getmtime(prompt_path)
    version = datetime.fromtimestamp(mtime).isoformat()
    
    return content, version
```

---

## Security Considerations

1. **Never expose API keys in frontend code**
2. **Use environment variables for all secrets**
3. **Rate limit your agent endpoints**
4. **Log questions for abuse detection (but sanitize PII)**
5. **Consider authentication for agent API routes**
6. **Don't let the agent execute arbitrary Stripe API calls in production**

---

## Next Steps

1. Start with **Method 1** (Claude Web) to test the prompt
2. Graduate to **Method 2** (API) for production use
3. Add **Method 3** (Tools) when you need live data access
4. Scale to **Method 4** (Multi-Agent) for enterprise support

---

**You're now ready to deploy StripeBot Pro!**
