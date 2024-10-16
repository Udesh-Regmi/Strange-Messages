import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username: usernameValidation, 
})
export async function GET(request:Request) {

    await dbConnect()

    try {
        const {searchParams} = new URL(request.url); 
        const queryParams = {
            username: searchParams.get('username')
        } 
        //validation with Zod
     const result= usernameQuerySchema.safeParse(queryParams)
     console.log(result);///   Checking TODO  : Remove

     if(!result.success){
        const usernameErrors = result.error.format().username?._errors || []

        return Response.json({
            success: false , 
            message : usernameErrors.length>0 ? usernameErrors.join(', ') : "Invalid query Parameters"
        }, {
            status : 400,
        })

     }
     const { username } = result.data

   const existingVerifiedUsername=  await  UserModel.findOne({
        username , 
        isVerified : true
     })
     if(existingVerifiedUsername){
        return Response.json({
            success: false , 
            message : "username is already taken "
        }, {
            status : 405,
        })

     }
     return Response.json({
        success: true , 
        message : "username is unique"
    }, {
        status : 200,
    })
     
        
    } catch (error) {
        console.error(`Error checking username ${error}`)
        return Response.json({
            success: false, 
            message : "Error checking username", 

        }, 
        {
            status : 400,
        }
    )
        
    }
    
}

