import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Define a type for error responses
interface ErrorResponse {
    error: string; // Error message
    status: number; // HTTP status code
    details?: string; // Additional details about the error (optional)
}

// Utility function to handle errors centrally
function handleError(error: unknown): ErrorResponse {
    if (error instanceof Error) {
        console.error("Error:", error.message);
        return { error: error.message, status: 500 };
    } else {
        console.error("Unknown Error:", error);
        return { error: "An unexpected error occurred", status: 500 };
    }
}

// POST handler function
export async function POST(): Promise<NextResponse> {
    try {
        // Check for the API key in environment variables
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Missing Google Gemini API key");
            return NextResponse.json(
                { error: "Internal Server Error" },
                { status: 500 }
            );
        }
    
        // Initialize the Google Generative AI instance
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
        // Hardcoded prompt
        const prompt: string = `
Let me help refine this prompt to be clearer and more focused:
"Please create 3 engaging questions about your interests. Each question should:
Focus on one topic from: tech, vehicles (cars/bikes), or social media/travel donot include what topic has been included in question at last.
Make you think about your real experiences and opinions
Be written in simple, everyday English
Challenge your views a bit
Be separated by ||
No numbering needed
Get personal but stay comfortable
Be easy to understand and answer

For example, we want to know your real thoughts on things like why you prefer certain phones, what draws you to certain vehicles, or how you really feel about social media - the kind of stuff that shows who you are and what you value.
`;
    
        const result = await model.generateContent(prompt);
    
        // Check if the response contains candidates and extract the first candidate's text
        const candidates = result.response?.candidates;
        if (!candidates || candidates.length === 0 || !candidates[0]?.content) {
            console.error("No valid candidates found in the response.");
            return NextResponse.json(
                { error: "Failed to generate content" },
                { status: 500 }
            );
        }
        const output = candidates[0].content;
        
        const parts  = output?.parts[0]?.text; 
        const questionsArray = parts?.split("||").map(q => q.trim()); 

    
        return NextResponse.json({ output: questionsArray });
        
    } catch (error) {
      const { error: errorMsg, status } = handleError(error);

      // Return the error response with a status code
      return NextResponse.json(
          { error: errorMsg },
          { status }
      );
  }
}