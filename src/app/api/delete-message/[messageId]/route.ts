import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
  const messageId = params.messageId;
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
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

  try {
      const updatedResult = await UserModel.updateOne(
          { _id: session.user._id }, // Use session.user._id directly
          { $pull: { messages: { _id: messageId } } }
      );

      if (updatedResult.modifiedCount === 0) {
          return Response.json(
              {
                  success: false,
                  message: `Message not found or already deleted`,
              },
              {
                  status: 404,
              }
          );
      }

      return Response.json(
          {
              success: true,
              message: `Message Deleted Successfully`,
          },
          {
              status: 200, // Use 200 for a successful deletion
          }
      );
  } catch (error) {
      console.error(`Unexpected error while deleting: ${error}`);
      return Response.json(
          {
              success: false,
              message: `Unexpected deletion error`,
          },
          {
              status: 500,
          }
      );
  }
}
