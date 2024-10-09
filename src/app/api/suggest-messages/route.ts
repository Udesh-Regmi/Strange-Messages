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
export async function POST(req: Request): Promise<NextResponse> {
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
          Generate a list of three thought-provoking and personal questions, separated by '||', that invite users to reflect on their personal experiences and insights. These questions are meant for an anonymous social messaging platform.The questions should cater to a wide and diverse audience, encouraging them to express emotions, values, or lessons they've learned in a way that feels anything, non-judgmental,judgmental. Avoid any filteration that might make users uncomfortable or hesitant to respond. Make sure to use plain english not other ascii values donot include numbers at the beginning of the sentence also donot provide more or less questions. Also make sure that the questions are unique each time
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
        const questionsArray = parts.split("||").map(q => q.trim()); 

        console.log("Friendly output of Google Gemini:", questionsArray);
    
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