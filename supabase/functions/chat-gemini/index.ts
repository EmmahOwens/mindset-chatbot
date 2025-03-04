
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

    // Format the conversation history for Gemini
    const conversationText = messages.map((msg: any) => 
      `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');
    
    // Add system instructions
    const systemPrompt = `You are a helpful, empathetic mental health companion chatbot. 
    Respond to the following conversation, focusing on the last user message. 
    Be supportive, thoughtful, and provide meaningful guidance.
    
    Previous conversation:
    ${conversationText}
    
    Your response should be helpful, supportive, and tailored to continuing this conversation.`;

    // Initialize the Gemini API
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',  // Updated to a supported model
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.7,
      },
    })

    console.log('Sending prompt to Gemini:', systemPrompt)

    // Generate response from Gemini
    const result = await model.generateContent(systemPrompt)
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
