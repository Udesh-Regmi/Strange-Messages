"use client";
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/User';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const DashboardPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const { toast } = useToast();
    const { data: session } = useSession();
    const [profileUrl, setProfileUrl] = useState<string | null>(null);


    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema),
        defaultValues: {
            acceptMessages: true,
        },
    });

    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    const handleDeleteMessage = (messageId: string) => {
        setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId));
    };

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-message');
            console.log(response.data.isAcceptingMessages);
            const isAcceptingMessage = response.data.isAcceptingMessages; // Explicitly convert to boolean
            setValue('acceptMessages', isAcceptingMessage as boolean);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || 'Error while fetching message acceptance status',
                variant: 'destructive',
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue, toast]);

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(response.data.messages || []);
            if (refresh) {
                toast({
                    title: 'Refreshed Messages',
                    description: 'Showing latest messages',
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || 'Error while fetching messages',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (session && session.user) {
            const { username } = session.user as User;
            if (typeof window !== "undefined") {
                const profileUrlValue = `${window.location.protocol}//${window.location.host}/user/${username}`;
                setProfileUrl(profileUrlValue);
            }
            fetchMessages(); // Fetch messages without affecting switch state
            fetchAcceptMessage(); // Fetch switch state only once on mount
        }
    }, [session, fetchAcceptMessage, fetchMessages]);

    const handleSwitchChange = async () => {
        setIsSwitchLoading(true);
        try {
            const newAcceptMessages = !acceptMessages; // Toggle based on current state
            const response = await axios.post<ApiResponse>('/api/accept-message', {
                acceptMessages: newAcceptMessages,
            });

            // Only update local state if server response is successful
            if (response.status === 200) {
                setValue('acceptMessages', newAcceptMessages); // Update form state
                toast({
                    title: response.data.message,
                    variant: 'default',
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message || 'Failed while changing message acceptance status',
                variant: 'destructive',
            });
        } finally {
            setIsSwitchLoading(false);
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        toast({
            title: 'Url Copied',
            description: 'Url copied to clipboard',
        });
    };

    if (!session || !session.user) {
        return (
            <div className=" text-black flex items-center justify-center w-full min-h-full ">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Please Login to Proceed!</h2>
                    <Link href="/sign-up">
                        <Button className="ml-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200">
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }
    
    const { username } = session.user as User;

    return (
<div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-white to-indigo-100 bg-opacity-80 backdrop-blur-lg text-black rounded-lg shadow-lg min-w-[90vw] min-h-screen">
<header className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                    <h1 className="text-4xl font-bold">Dashboard</h1>
                    <div className="userinfo text-xl">Welcome back, {username}!</div>
                </div>
                <div className="copybutton-info text-center">
                    <h3 className="text-lg">Copy the URL to receive anonymous messages:</h3>
                    <div className="flex items-center mt-2">
                        <input
                            type="text"
                            value={profileUrl || ''} // Fallback to an empty string if profileUrl is null
                            disabled
                            className='input input-bordered w-full p-4 bg-white-700 text-black border-white rounded-md shadow-sm'
                        />
                        <Button
                            onClick={() => profileUrl && copyToClipboard(profileUrl)} // Ensure profileUrl is defined before copying
                            className="ml-2 bg-blue-600 hover:bg-blue-700 transition duration-300"
                        >
                            Copy
                        </Button>
                    </div>
                </div>
            </header>
            
           <Separator className="mb-6 border-gray-600" />

           <div className="flex items-center mb-5">
               <Switch
                   {...register('acceptMessages')}
                   checked={acceptMessages}
                   onCheckedChange={handleSwitchChange}
                   disabled={isSwitchLoading}
                   className="bg-gray-700 border-gray-600"
               />
               <span className='m-5 text-lg'>
                   Accept Incoming Messages: <span className={`${acceptMessages ? 'text-green-600' : 'text-red-400'}`}>{acceptMessages ? 'On' : 'Off'}</span>
               </span>
           </div>

           <Separator className="mb-6 border-gray-600" />

           <Button
               className='mt-4 border-gray-600 bg-blue-600 hover:bg-blue-700 transition duration-300'
               onClick={(e) => {
                   e.preventDefault();
                   fetchMessages(true);
               }}
           >    
               {isLoading ? (
                   <Loader2 className='animate-spin w-4 h-4' />
               ) : (
                   <RefreshCcw className='w-4 h-4' />
               )}
               Refresh Messages
           </Button>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
               {
                   messages.length > 0 ? (
                       messages.map((message) => (
                           <MessageCard
                               key={message._id as string}
                               message={message}
                               onMessageDelete={handleDeleteMessage}
                           />
                       ))
                   ) : (
                       <p className="text-center text-gray-300">No messages for you to display.</p>
                   )
               }
           </div>
       </div>
   );
};

export default DashboardPage;