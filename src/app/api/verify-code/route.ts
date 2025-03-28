import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request:Request) {
    await dbConnect()
    try {
       const {username, code} = await request.json()
      const decodedUsername=  decodeURIComponent(username)
    const user=  await  UserModel.findOne({
        username: decodedUsername,

      })
      if(!user){
        return Response.json({
            success: false, 
            message : `User not found`
        },{
            status:500,
        })
      }
      const isCodeValid= user.verifyCode === code
      const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeNotExpired && isCodeValid){
            user.isVerified = true; 
            await user.save()
            return Response.json({
                success: true, 
                message : `Account verified Successfully`
            },{
                status:201,
            })

        }else if(!isCodeNotExpired){
            
            return Response.json({
                success: false, 
                message : `Verification code has been expired . Please sign up again  `
            },{
                status:400,
            })

        }else{
            return Response.json({
                success: false, 
                message : `Verification code unmatched | Incorrrect verification code `
            },{
                status:404,
            })

        }
    } catch (error) {
        console.error(`Error verifying user ${error}`)
        return Response.json({
            success: false, 
            message : "Error verifying user", 
        }, 
        {
            status : 400,
        })
    }
    
}



