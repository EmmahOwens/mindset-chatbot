
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.1.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { messages = [] } = await req.json()
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('Missing Gemini API key')
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash', // Updated to a supported model
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    })

    // Create context-aware prompt based on conversation if available
    let prompt = "Generate 4 short conversation starters or follow-up questions that people might want to discuss with a mental health AI companion. Return them as a JSON array of strings. Keep each response under 40 characters."
    
    if (messages && messages.length > 0) {
      // Extract the last few messages for context (max 3)
      const recentMessages = messages.slice(-3);
      const conversationContext = recentMessages.map((msg: any) => 
        `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');
      
      prompt = `Based on the following conversation with a mental health AI companion:
      
${conversationContext}

Generate 4 short follow-up questions or statements the user might want to say next. These should be contextually relevant to the conversation and continue the discussion naturally. Return them as a JSON array of strings. Keep each response under 40 characters.`;
    }
    
    console.log("Generating suggestions with prompt:", prompt);
    
    const result = await model.generateContent(prompt)
    const response = result.response
    const responseText = response.text()
    
    console.log("Raw response:", responseText);
    
    // Parse the JSON array from the response
    let suggestions;
    try {
      // Look for anything that looks like a JSON array in the response
      const jsonMatch = responseText.match(/\[.*\]/s);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Couldn't find JSON array in response");
      }
    } catch (parseError) {
      console.error("Error parsing suggestions:", parseError);
      // Fallback suggestions
      suggestions = [
        "Can you tell me more about that?",
        "How did that make you feel?",
        "What helps you when you feel this way?",
        "I'd like to discuss a related concern"
      ];
    }

    return new Response(
      JSON.stringify({ suggestions }),
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
