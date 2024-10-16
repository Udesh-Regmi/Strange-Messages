import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    const { messageId } = params;

    // Validate messageId format
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        return Response.json(
            {
                success: false,
                message: "Invalid message ID format",
            },
            {
                status: 400,
            }
        );
    }

    await dbConnect();
    const session = await getServerSession(authOptions);

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

    try {
        const updatedResult = await UserModel.updateOne(
            { _id: session.user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (updatedResult.modifiedCount === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Message Deleted Successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(`Unexpected error while deleting: ${error}`);
        return Response.json(
            {
                success: false,
                message: "Unexpected deletion error",
            },
            {
                status: 500,
            }
        );
    }
}
