"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { messageSchema } from "@/schemas/messageSchema";
import { useToast } from "@/hooks/use-toast"; // Import toast hook
import axios, { AxiosError } from "axios";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface DynamicUserProps {
  params: {
    username: string; // Expecting the username from the route
  };
}

const DynamicUser = ({ params }: DynamicUserProps) => {
  const { toast } = useToast(); // Initialize toast
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    const username = params.username; // Accessing the username from params

    if (!username) {
      toast({
        title: "Error",
        description: "Username is not available",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(`/api/send-message`, {
        username,
        content: data.content,
      });

      // Show success message
      toast({
        title: response.data.message || "Message Sent",
        variant: 'default',
      });

      // Reset form fields after a successful submission
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError;

      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to send message",
        variant: 'destructive',
      });
    }
  };

  return (
    <>
    <div className="flex justify-center items-center min-h-[83vh] bg-black">
      <Card className="w-full max-w-md bg-gray-900 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Send Anonymous Message</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Message</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your message" 
                        {...field} 
                        className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-400">
                      Your message will be sent anonymously to {params.username}
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={form.handleSubmit(onSubmit)}
          >
            Send Message
          </Button>
        </CardFooter>
      </Card>
     
    </div>
    <div className=" w-full flex flex-col flex-grow justify-center align-middle text-center bg-black text-white">
        <h2>Want to receive anonymous messages?</h2> 
        <Link href='/sign-up'>
        <Button>Sign Up</Button>
        </Link>           
    </div>
   
    </>

  );
};

export default DynamicUser;
