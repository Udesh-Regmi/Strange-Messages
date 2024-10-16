import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  // Check if session is valid
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;

  // Parse the request body
  const { acceptMessages } = await request.json();

  // Log for debugging


  try {
    // Update user acceptance status
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      // { new: true }
    );

    // Handle case where the user is not found or update fails
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "User not found or failed to update acceptance status",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Acceptance status updated successfully.",
        updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error updating message acceptance status: ${error}`);
    return Response.json(
      {
        success: false,
        message: "Failed to update message acceptance status",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  // Check if session is valid
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const userId = user._id;

  try {
    // Retrieve the user information
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(`Error retrieving message acceptance status: ${error}`);
    return Response.json(
      {
        success: false,
        message: "Error in getting message status",
      },
      {
        status: 500,
      }
    );
  }
}
