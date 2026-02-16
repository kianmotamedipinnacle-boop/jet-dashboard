import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// In-memory storage for messages (in production, use a database)
const messagesStore = new Map<string, any[]>();

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message } = await request.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: 'Missing sessionId or message' },
        { status: 400 }
      );
    }

    // Create user message
    const userMessage = {
      id: `user-${Date.now()}`,
      content: message,
      role: 'user',
      timestamp: new Date().toISOString(),
      sessionId,
    };

    // Store user message
    const sessionMessages = messagesStore.get(sessionId) || [];
    sessionMessages.push(userMessage);
    messagesStore.set(sessionId, sessionMessages);

    // Generate AI response based on session context
    const aiResponse = await generateAIResponse(sessionId, message);

    // Create assistant message
    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      content: aiResponse,
      role: 'assistant',
      timestamp: new Date().toISOString(),
      sessionId,
    };

    // Store assistant message
    sessionMessages.push(assistantMessage);
    messagesStore.set(sessionId, sessionMessages);

    // Log activity
    await logActivity(sessionId, message, aiResponse);

    return NextResponse.json({
      success: true,
      reply: assistantMessage,
    });
  } catch (error) {
    console.error('Error processing message:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

async function generateAIResponse(sessionId: string, message: string): Promise<string> {
  // Context-aware responses based on session type
  const contextResponses: Record<string, string[]> = {
    medicare: [
      "I'll help you with Medicare-related information. ",
      "Regarding your Medicare query: ",
      "Here's what I found about Medicare: ",
    ],
    tech: [
      "Let me assist you with that technical question. ",
      "From a technical perspective: ",
      "Here's the technical solution: ",
    ],
    strategy: [
      "Let's think strategically about this. ",
      "From a strategic standpoint: ",
      "Here's my strategic analysis: ",
    ],
    general: [
      "I'd be happy to help with that. ",
      "Let me assist you: ",
      "Here's my response: ",
    ],
  };

  const prefix = contextResponses[sessionId]?.[Math.floor(Math.random() * 3)] || "Let me help you with that. ";
  
  // Simulate different types of responses based on message content
  if (message.toLowerCase().includes('status')) {
    return prefix + "I'm currently working on optimizing your workflow and monitoring various systems. All systems are operational.";
  } else if (message.toLowerCase().includes('help')) {
    return prefix + "I can assist you with various tasks including system monitoring, data analysis, workflow automation, and strategic planning. What would you like help with?";
  } else if (sessionId === 'medicare' && message.toLowerCase().includes('lead')) {
    return prefix + "The Medicare lead scoring system is operational. Current pipeline shows 15 high-quality leads with scores above 80. Would you like me to provide detailed analytics?";
  } else if (sessionId === 'tech' && message.toLowerCase().includes('deploy')) {
    return prefix + "Deployment status: All systems are green. The multi-chat interface is being integrated with the dashboard. Railway deployment will be completed shortly.";
  } else {
    // Default contextual response
    return prefix + `I understand you're asking about "${message}". Let me process this and provide you with relevant information. This ${sessionId} conversation context is maintained separately from other sessions.`;
  }
}

async function logActivity(sessionId: string, userMessage: string, aiResponse: string) {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      sessionId,
      event: 'chat_interaction',
      details: {
        userMessage: userMessage.substring(0, 100) + (userMessage.length > 100 ? '...' : ''),
        aiResponse: aiResponse.substring(0, 100) + (aiResponse.length > 100 ? '...' : ''),
      },
    };

    // Log to the activity API
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry),
    }).catch(err => console.error('Failed to log activity:', err));
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}