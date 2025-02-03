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
import { LinkIcon, Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CardContent } from '@/components/ui/card';
import Image from 'next/image';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
interface WishData {
    wishId: string;
    recipientName: string;
    date: string;
    image : string;
}

const DashboardPage = () => {




    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [isWishLoading, setIsWishLoading] = useState(false);

    const { toast } = useToast();
    const { data: session } = useSession();
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const [birthdayData, setBirthdayData] = useState<WishData[]>([]);


    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema),
        defaultValues: {
            acceptMessages: true,
        },
    });


    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    const handleWishRefresh = useCallback(async () => {
        if (!session?.user) return;

        try {
            setIsWishLoading(true);
            const { username } = session.user as User;
            const response = await axios.get<{ data: WishData[] }>(`/api/wishid/${username}`);

            if (response.data.data.length === 0 || !response.data.data) {
                toast({
                    title: 'No Wishes',
                    description: 'No birthday wishes found',
                    variant: 'destructive',
                });
            } else {
                setBirthdayData(response.data.data);
                toast({
                    title: 'Success',
                    description: 'Wishes refreshed successfully',
                });
            }
        } catch (error) {
            console.error('Error refreshing wishes', error);
            toast({
                title: 'Error',
                description: 'Failed to refresh wishes',
                variant: 'destructive',
            });
        } finally {
            setIsWishLoading(false);
        }
    }, [session, toast]);

    const handleWishClick = useCallback((wishId: string) => {
        window.open(`${window.location.origin}/birthday/${wishId}`, '_blank');
    }, []);




    const handleDeleteMessage = (messageId: string) => {
        setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId));
    };

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-message');
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
    useEffect(() => {
        const fetchWishIdofUser = async () => {
            const user = session?.user as User;
            try {
                const response = await axios.get(`/api/wishid/${user.username}`);
                setBirthdayData(response.data);
                return response.data;
            } catch (error) {
                console.log("Error fetching user", error);

            }
        }
        fetchWishIdofUser();
    }, [session]);



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
    const WishesSection = () => (
        <Card className="bg-white/90 backdrop-blur-sm shadow-sm">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl text-gray-800">Birthday Wishes</CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-indigo-600 hover:bg-indigo-50"
                        onClick={handleWishRefresh}
                        disabled={isWishLoading}
                    >
                        {isWishLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCcw className="h-4 w-4" />
                        )}
                        Refresh
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {birthdayData.length === 0 ? (
                    <div className="text-center py-4 text-gray-400">
                        No birthday wishes created yet
                    </div>
                ) : (
                    birthdayData.map((wish) => (
                        <motion.div
                            key={wish.wishId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div 
                                     onClick={() => handleWishClick(wish.wishId)}
                                    className='flex align-center gap-4 cursor-pointer'>
                                        <Image 
                                        src={wish.image}
                                         alt={wish.recipientName} 
                                         className=" rounded-full"
                                         width={64}
                                         height={12}
                                         
                                         
                                         />
                                        <div className="flex flex-col">
                                        <h3 className="font-semibold text-lg text-gray-800">{wish.recipientName}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Created: {new Date(wish.date).toLocaleDateString()}
                                        </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-indigo-600 hover:text-indigo-700"
                                        onClick={() => handleWishClick(wish.wishId)}
                                    >
                                        <LinkIcon className="h-4 w-4 mr-2 text-md" />
                                        View
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </CardContent>
        </Card>
    );

    const { username } = session?.user as User;

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
                            value={profileUrl || ''}
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
                Refresh
            </Button>
            <div className='mt-6 flex flex-col lg:flex-row justify-between items-start gap-6'>
    {/* Left side: Message section */}
    <div className="w-full lg:flex-1 grid grid-cols-1 gap-6 mt-4">
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
                <p className="text-center text-gray-500">No messages for you to display.</p>
            )
        }
    </div>

    {/* Right side: Wishes section */}
    <div className="w-full lg:w-1/3">
   
        <WishesSection />
    </div>
</div>

        </div>
    );
};

export default DashboardPage;