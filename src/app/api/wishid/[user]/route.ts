import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import BirthdayWish from "@/model/birthdayModel";

export async function GET(request: Request) {
  try {
    // Connect to database
    await connectToDatabase();
    const createdBy = request.url.split("/")[5];
    // console.log("========================================================");
    if (createdBy) {
      const birthdayWishes = await BirthdayWish.find({ createdBy }).sort({
        createdAt: -1,
      }); // Sort by creation date, descending
      // console.log(birthdayWishes)

      if (birthdayWishes.length === 0) {
        return NextResponse.json(
          {
            message: `No birthday wishes found for user with createdBy: ${createdBy}`,
          },
          { status: 404 }
        );
      }
      const wishes= birthdayWishes.map((wish)=>{

        return{
            wishId:wish.wishId,
            recipientName:wish.recipientName,
            date:wish.createdAt,
            image: wish.imageUrls[0]
        }

      })
       

      return NextResponse.json(wishes) ;
    }
  } catch (error) {
    console.error("Error fetching birthday wishes:", error);
    return NextResponse.json(
      { message: "Error fetching birthday wishes" },
      { status: 500 }
    );
  }
}
