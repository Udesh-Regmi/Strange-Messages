import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";


export  async function POST(request:Request) {

    await dbConnect()
   const {username, content}=  await request.json()

   try {
   const user = await  UserModel.findOne({
        username
    })  
    if(!user){
        return Response.json(
            {
              success: false,
              message: `User not found`,
            },
            {
              status: 404,
            }
          );
    }
    //is user accepting the message 
    if(!user.isAcceptingMessage){
        return Response.json(
            {
              success: false,
              message: `User is not accepting the messages at this time `,
            },
            {
              status: 403,
            }
          );

    }
    const newMessage = {content, createdAt : new Date()}

    user.messages.push(newMessage as Message)
    await user.save()
    return Response.json(
        {
          success: true,
          message: `Message sent successfully `,
        },
        {
          status: 404,
        }
      );
   } catch (error) {
    console.error(`Error on catch while addding a new messages ${error}`)
    return Response.json(
        {
          success: false,
          message: `Error while adding new message to the user`,
        },
        {
          status: 500,
        }
      );
    
   }
    
}
