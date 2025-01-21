import { connectToDatabase } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import BirthdayWish from '@/model/birthdayModel';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    console.log(session);
    
    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        // Connect to database
        await connectToDatabase();

        // Get request body
        const body = await request.json();
        const { recipientName, dateOfBirth, description, relationship, imageUrls, createdBy } = body;

        // Generate unique wishId
        const wishId = uuidv4();

        // Create new birthday wish
        const birthdayWish = await BirthdayWish.create({
            recipientName,
            dateOfBirth,
            description,
            relationship,
            imageUrls,
            createdBy,
            wishId,
        });

        return NextResponse.json({
            message: 'Birthday wish created successfully',
            wishId,
            birthdayWish,
        });
    } catch (error) {
        console.error('Error creating birthday wish:', error);
        return NextResponse.json(
            { message: 'Error creating birthday wish' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        // Connect to database
        await connectToDatabase();

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const wishId = searchParams.get('wishId');

        if (wishId) {
            // Get specific birthday wish
            const birthdayWish = await BirthdayWish.findOne({ wishId });
            if (!birthdayWish) {
                return NextResponse.json(
                    { message: 'Birthday wish not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json(birthdayWish);
        }

        // Get all birthday wishes (you might want to add pagination here)
        const birthdayWishes = await BirthdayWish.find().sort({ createdAt: -1 });
        return NextResponse.json(birthdayWishes);
    } catch (error) {
        console.error('Error fetching birthday wishes:', error);
        return NextResponse.json(
            { message: 'Error fetching birthday wishes' },
            { status: 500 }
        );
    }
} 