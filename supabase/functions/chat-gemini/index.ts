
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
    // Parse request body
    const { messages, maxTokens = 800 } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')

    if (!apiKey) {
      throw new Error('Missing Gemini API key')
    }

    // Format messages for Gemini (convert from chat format to prompt)
    const conversationHistory = messages.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }))

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.7,
      },
    })

    // Create a chat and send the conversation history
    const chat = model.startChat({
      history: conversationHistory.slice(0, -1), // All except the last message
      generationConfig: {
        maxOutputTokens: maxTokens,
      },
    })

    // Get the last user message to send
    const lastMessage = conversationHistory[conversationHistory.length - 1]
    console.log('Sending message to Gemini:', lastMessage)

    // Generate response from Gemini
    const result = await chat.sendMessage(lastMessage.parts[0].text)
    const response = result.response
    const text = response.text()

    console.log('Gemini response:', text)

    return new Response(
      JSON.stringify({
        content: text,
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
