import { NextRequest, NextResponse } from "next/server"; // Import NextRequest
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

// Validation schema
const usernameBodySchema = z.object({
    username: usernameValidation,
});

export async function POST(req: NextRequest) {
    await dbConnect(); 

    try {
        // Parse the request body
        const body = await req.json();

        // Zod validation
        const result = usernameBodySchema.safeParse(body);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];

            return NextResponse.json(
                {
                    success: false,
                    message: usernameErrors.length > 0 ? usernameErrors.join(', ') : "Invalid request body",
                },
                { status: 400 }
            );
        }

        const { username } = result.data;

        // Check if the username exists and is verified
        const existingVerifiedUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUsername) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Username is already taken",
                },
                { status: 409 } // Use 409 Conflict for existing username
            );
        }

        // Username is unique
        return NextResponse.json(
            {
                success: true,
                message: "Username is unique",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(`Error checking username: ${error}`);

        return NextResponse.json(
            {
                success: false,
                message: "Error checking username",
            },
            { status: 500 }  // Change to 500 to represent server error
        );
    }
}
