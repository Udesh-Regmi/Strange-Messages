import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(): Promise<Response> {
  console.time("GetMessagesExecutionTime"); // Start timing

  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    console.warn("User not authenticated");
    return Response.json(
      {
        success: false,
        message: `Not Authenticated`,
      },
      {
        status: 401,
      }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  console.log("Get Messages for User ID:", userId);

  try {
    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]);

    if (!userMessages || userMessages.length === 0) {
      console.warn("User not found in aggregate pipeline");
      return Response.json(
        {
          success: false,
          message: `User not found in aggregate pipeline`,
        },
        {
          status: 404, // Use 404 for not found
        }
      );
    }

    console.timeEnd("GetMessagesExecutionTime"); // End timing
    return Response.json(
      {
        success: true,
        messages: userMessages[0].messages,
      },
      {
        status: 200, // Use 200 for success
      }
    );

  } catch (error) {
    console.error(`Error fetching messages: ${error}`);
    return Response.json(
      {
        success: false,
        message: `Error getting the messages of User`,
      },
      {
        status: 500,
      }
    );
  }
}
