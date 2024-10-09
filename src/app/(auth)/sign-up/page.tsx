"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import {Loader2 } from "lucide-react"
import React, { useEffect, useState } from 'react';
import {  useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"



const SignUpPage = () => {
  const [username, setusername] = useState('')
  const [usernameMessage, setusernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername]= useState(false)
  const [isSubmitting, setisSubmitting]= useState(false)
  const debounced= useDebounceCallback(setusername,1000)
  const { toast } = useToast()
  const router = useRouter()

  //zod implementation
  const form =useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      username:'',
      email:'',
      password:'',
    }
  })

useEffect(()=>{
  const chequeUniqueness = async ()=>{
    if(username){
      setisCheckingUsername(true)
      setusernameMessage('')
      try {
      const response=  await axios.get(`/api/check-username-unique?username=${username}`)
    //   console.log(response.data.message)
        setusernameMessage(response.data.message)
      } catch (error) {
        const axiosError= error as AxiosError<ApiResponse>
        setusernameMessage(
          axiosError.response?.data.message ?? `Error checking username`
        )
        
        
      }
      finally{
        setisCheckingUsername(false)
      }

    }

  }
  chequeUniqueness()
}, [username])
const onSubmit= async (data : z.infer<typeof signUpSchema>) => {
  setisSubmitting(true)
  try {
   const response= await axios.post<ApiResponse>(`/api/sign-up`,data)
   toast({
    title : 'Success', 
    description: response?.data.message, 

   })
   router.replace(`/verify/${username}`)
    
  } catch (error) {
    console.error(`Error in signing user ${error}`)
    const axiosError= error as AxiosError<ApiResponse>
    const errorMessage = axiosError.response?.data.message

    toast({
      title: `Signup failed `, 
      description: errorMessage,
      variant: "destructive", 
    })
  }
  finally{
    setisSubmitting(false)
  }
}

    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-xl ring-2 ring-indigo-200 ring-opacity-50">
      <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-5">
                Join Anonymous Messages
              </h1>
              <p className="mb-3">Signup to enjoy Anonymous Adventure </p>
       </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                      <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                      <Input placeholder="Username" 
                      {...field}
                      onChange={(e)=>{
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                      
                      />
                      </FormControl>
                      {
                        isCheckingUsername && <Loader2 className="animate-spin"/> 
                      }
                        <p className={`text-sm ${usernameMessage ==='username is unique' ? 'text-green-500':'text-red-500'}`}>
                            ;..... {usernameMessage}
                        </p>
                      
                      
                      <FormMessage />
                      </FormItem>
                      )}
                      />
                        <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                      <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                      <Input placeholder="Email" 
                      {...field}                 
                      />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                      )}
                      />

                      <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                      <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                      <Input placeholder="Password" 
                      {...field}                 
                      />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                      )}
                      />
                    
                    <Button type="submit" disabled={isSubmitting} >
                       {
                        isSubmitting ? (
                          <>
                          <Loader2 className="mr-3 h-4 w-4 animate-spin"/> Please Wait !
                          </>
                        ):('Sign Up')
                       }
                    </Button>
                  </form>
              </Form>
              <div className="text-center mt-3 ">
                <p>Already a member? {' '}
                  <Link href='/sign-in' className="text-blue-600"> SignIn</Link>
                </p>
              </div>

          </div>
        </div>
    );
};

export default SignUpPage; 