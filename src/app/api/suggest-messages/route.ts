import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Define types for the incoming request and expected response
interface RequestBody {
    body: string; // Input body text
}

// Define a type for error responses
interface ErrorResponse {
    error: string; // Error message
    status: number; // HTTP status code
    details?: string; // Additional details about the error (optional)
}

// Utility function to handle errors centrally
function handleError(error: unknown): ErrorResponse {
    if (error instanceof Error && 'response' in error) {
        const apiError = error as any;
        const status = apiError.response?.status || 500;
        const message = apiError.response?.statusText || "API Error occurred";
        const details = apiError.response?.data?.message || "No additional information";

        console.error(`API Error - Status: ${status}, Message: ${message}, Details: ${details}`);
        return { error: message, status, details };
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
            throw new Error("Missing Google Gemini API key");
        }

        // Initialize the Google Generative AI instance
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Parse the request body and validate input
        const data: RequestBody = await req.json();
        if (!data.body || typeof data.body !== 'string') {
            return NextResponse.json(
                { error: "Invalid input: 'body' field is required and must be a string" },
                { status: 400 }
            );
        }

        // Define the prompt for generating friendly questions
        const prompt: string = `
            As an AI, create a list of three open-ended and engaging questions that encourage users to share personal insights and experiences. Format the questions as a single string, with each question separated by '||'. These questions are designed for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Aim for universal themes that foster friendly interaction and self-reflection without delving into sensitive topics. For example, structure the output like this: 'What’s a personal challenge you’ve overcome, and what did you learn from it? || How has a specific experience shaped who you are today? || If you could give advice to your younger self, what would it be?'. Ensure the questions are intriguing, encourage curiosity, and contribute to a positive and welcoming conversational environment.
`;

        // Generate content using the model
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const output: string = await response.text();

        // Format the output into a friendly text-stream format
        const friendlyOutput: string = output
            .split('||') // Split the output string by '||'
            .map((question, index) => `${index + 1}. ${question.trim()}`) // Add numbering and trim whitespace
            .join('\n'); 

        // Return the successful response with formatted output
        return NextResponse.json({ output: friendlyOutput });

    } catch (error) {
        const { error: errorMsg, status, details } = handleError(error);

        // Return the error response with a status code
        return NextResponse.json(
            { error: errorMsg, details },
            { status }
        );
    }
}
