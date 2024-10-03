import { z } from "zod"


export const usernameValidation = z.string()
            .min(3, " Username must be atleast 3 characters")
            .max(20, "Username mustnot be more than 20 characters " )
            .regex(/^[a-zA-Z0-9_]+$/ , "Username must not contain specific characters")


export const signUpSchema = z.object({
    username: usernameValidation, 
    email : z.string().email({message: "Invalid Email Address"}), 
    password : z.string().min(8, {message: "Password must be atleast 8 characters long"}), 
    
})