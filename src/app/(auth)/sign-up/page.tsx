"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignUpPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [debouncedUsername] = useDebounce(username, 500);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if (debouncedUsername) {
        try {
          const response = await axios.post(`/api/check-username-unique`, { username: debouncedUsername });
          if (response.data.success) {
            toast({
              title: "Username available",
              description: "This username is available for use.",
              variant: "default",
            });
          } else {
            toast({
              title: "Username taken",
              description: "This username is already in use. Please choose another.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error checking username:", error);
          toast({
            title: "Error",
            description: "An error occurred while checking the username.",
            variant: "destructive",
          });
        }
      }
    };

    checkUsernameUniqueness();
  }, [debouncedUsername, toast]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      // Check for username uniqueness before submitting the form
      const usernameCheckResponse = await axios.post(`/api/check-username-unique`, { username: data.username });
      
      if (!usernameCheckResponse.data.success) {
        toast({
          title: "Username taken",
          description: "This username is already in use. Please choose another.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return; // Prevent submission if username is not unique
      }
      
      const response = await axios.post<ApiResponse>(`/api/sign-up`, data);
      toast({
        title: "Success",
        description: response?.data.message,
      });
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      console.error(`Error in signing up user`, error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message || "An error occurred during sign up";
      toast({
        title: `Signup failed`,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
<div className="flex items-center justify-center min-h-screen bg-white">
<div className="w-full max-w-md p-8 space-y-8 bg-white bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl ring-2 ring-indigo-200 ring-opacity-50">
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
                    <Input 
                      placeholder="Username" 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />
                  </FormControl>
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
                    <Input placeholder="Email" {...field} />
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
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-3 h-4 w-4 animate-spin" /> Please Wait!
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-3">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
