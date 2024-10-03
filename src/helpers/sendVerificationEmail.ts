import { ApiResponse } from "@/types/ApiResponse";
import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/verificationEmail";



export async function sendVerficationEmail(
    email : string,
    username: string,
    verifyCode : string
    ): Promise<ApiResponse>{
        try {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Anonoymous Message | Verification Code ',
                react: VerificationEmail({ username, otp:verifyCode}),
              });
            return {
                success: true, message : "Verification email sent successfully "
            }

            
        } catch (emailerror) {
            console.error(`Error sending verification Email ${emailerror}`)
            return {
                success: false, message : "Failed to send verification email"
            }
            
        }

    }



