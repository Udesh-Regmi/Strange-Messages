"use client";
import React, { useState, useCallback } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { messageSchema } from '@/schemas/messageSchema';

interface DynamicUserProps {
  params: {
    username: string;
  };
}
import hardcodedsuggestMessages from '@/suggest-messages.json'

const DynamicUser: React.FC<DynamicUserProps> = ({ params }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(hardcodedsuggestMessages);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isRefreshDisabled, setIsRefreshDisabled] = useState(false); // State to manage rate limiting

  const { toast } = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const fetchSuggestions = useCallback(async () => {
    if (isRefreshDisabled) return;


    setIsLoadingSuggestions(true);
    try {
      const response = await axios.post("/api/suggest-messages");
      if (response.data && Array.isArray(response.data.output)) {
        setSuggestedMessages(response.data.output);
        toast({
          title: "Suggestions Updated",
          description: "New message suggestions have been loaded.",
          variant: "default",
        });
      } else {
        throw new Error("Invalid response format");
      }
      setIsRefreshDisabled(true);
      setTimeout(() => {
        setIsRefreshDisabled(false);
      }, 90000);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to load message suggestions.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [isRefreshDisabled, toast])


  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    if (!params.username) {
      toast({
        title: "Error",
        description: "Username is not available",
        variant: "destructive",
      });
      return;
    }
    if (isSubmitting) {
      toast({
        title: "Wait",
        description: "Please wait 5 seconds before sending another message.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(async () => {
      try {
        const response = await axios.post(`/api/send-message`, {
          username: params.username,
          content: data.content,
        });

        toast({
          title: "Success",
          description: response.data.message || "Message sent successfully",
          variant: "default",
        });

        form.reset();
      } catch (error) {

        console.error(`Error sending message ${error}`)
        toast({
          title: "Error",
          description:  "Failed to send message",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 5000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 ">
      <main className="flex-grow flex items-center justify-center px-4 py-12 w-full">
        <Card className="w-full max-w-md shadow-lg rounded-lg">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              Send Anonymous Message to <span className="text-indigo-500">{params.username}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type your message here"
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              form.handleSubmit(onSubmit)();
                            }
                          }}
                          className="focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </FormControl>
                      <FormDescription>
                        Type your own message or use a suggestion below.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Suggested Messages:</p>
                    <Button
                      onClick={fetchSuggestions}
                      variant="ghost"
                      size="sm"
                      disabled={isLoadingSuggestions || isRefreshDisabled}
                      className="text-sm text-indigo-500 hover:text-indigo-600"
                    >
                      {isLoadingSuggestions ? "Refreshing..." : isRefreshDisabled ? "Please wait..." : "Refresh"}
                    </Button>
                  </div>
                  {isLoadingSuggestions ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, index) => (
                        <Skeleton key={index} className="h-10 w-full rounded-md animate-pulse" />
                      ))}
                    </div>
                  ) : suggestedMessages.length > 0 ? (
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {suggestedMessages.map((message, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => form.setValue("content", message, { shouldValidate: true })}
                                className="w-full text-left truncate hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors"
                              >
                                {message.length > 50 ? `${message.substring(0, 50)}...` : message}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>{message}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No suggestions available.</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DynamicUser;
