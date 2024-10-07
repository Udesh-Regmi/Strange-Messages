"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link"
import React from 'react';
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"



const signInPage = () => {
  const { toast } = useToast()
  const router = useRouter()

  //zod implementation
  const form =useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      identifier:'',
      password:'',
    }
  })


const onSubmit= async (data : z.infer<typeof signInSchema>) => {
   const result= await signIn('credentials',{
    redirect: false,
    identifier: data.identifier,
    password: data.password,
    callbackUrl: '/dashboard', // Specify the callback URL

   })
   if(result?.error){
    toast({
      title: 'Login Failed',
      description: 'Incorrect Email or Password',
      variant: 'destructive'
    })
   }
  if(result?.url){
    router.push(result.url); // Use the returned URL for redirection
  }
  // router.push(`/`)
}

    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-xl ring-2 ring-indigo-200 ring-opacity-50">
      <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-5">
              Welcome to Anonymous Messages
              </h1>
              <p className="mb-3">
              Sign in to explore and leave your anonymous thoughts. We value your feedback.
              </p>
       </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
               
                        <FormField
                      control={form.control}
                      name="identifier"
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
                    
                    <Button type="submit">
                      Sign In
                    </Button>
                  </form>
              </Form>
              <div className="text-center mt-3 ">
                <p>Not  a member? {' '}
                  <Link href='/sign-up' className="text-blue-600"> SignUp</Link>
                </p>
              </div>

          </div>
        </div>
    );
};

export default signInPage; 