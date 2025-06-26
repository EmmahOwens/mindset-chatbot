
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.1.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse request body with higher default token limit
    const { messages, maxTokens = 2000 } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')

    if (!apiKey) {
      throw new Error('Missing Gemini API key')
    }

    // Format the conversation history for Gemini
    const conversationText = messages.map((msg: any) => 
      `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');
    
    // Add system instructions with guidance for complete responses
    const systemPrompt = `You are a helpful, empathetic mental health companion chatbot. 
    Respond to the following conversation, focusing on the last user message. 
    Be supportive, thoughtful, and provide meaningful guidance.
    
    IMPORTANT: Always provide complete responses. If your response is getting long, prioritize the most important points but ensure your response has a clear conclusion.
    
    Previous conversation:
    ${conversationText}
    
    Your response should be helpful, supportive, and tailored to continuing this conversation.`;

    // Initialize the Gemini API with higher token limit
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        maxOutputTokens: Math.min(maxTokens, 2048), // Cap at 2048 to stay within reasonable limits
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
      },
    })

    console.log('Sending prompt to Gemini with max tokens:', Math.min(maxTokens, 2048))

    // Generate response from Gemini
    const result = await model.generateContent(systemPrompt)
    const response = result.response
    const text = response.text()

    console.log('Gemini response length:', text.length, 'characters')

    // Check if response seems truncated (ends abruptly without punctuation)
    const lastChar = text.trim().slice(-1)
    const seemsTruncated = text.length > 100 && !['.',  '!', '?', ':', ';'].includes(lastChar)
    
    if (seemsTruncated) {
      console.log('Warning: Response may be truncated')
    }

    return new Response(
      JSON.stringify({
        content: text,
        truncated: seemsTruncated
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
