"use client"
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

const DashboardPage = () =>
     {
    const [messages, setMessages] = useState<Message[]>([])
    const [isloading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const { toast } = useToast()
    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }

    const { data: session } = useSession()
    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema)
    })
    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages')
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>(`/api/accept-message`)
            setValue('acceptMessages', response.data.isAcceptingMessage)


        } catch (error) {
            const AxiosError = error as AxiosError<ApiResponse>
            toast({
                title: `Error `,
                description: AxiosError.response?.data.message || `Error while fetching messages`,
                variant: 'destructive'
            })

        } finally {
            setIsSwitchLoading(false)
        }


    }, [setValue])
    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsSwitchLoading(false)
        setIsLoading(true)
        try {
            const response = await axios.get<ApiResponse>(`/api/get-messages`)
            setMessages(response.data.messages || [])
            if (refresh) {
                toast({
                    title: `Refreshed Messages`,
                    description: `Showing latest messages`
                })
            }
        } catch (error) {
            const AxiosError = error as AxiosError<ApiResponse>
            toast({
                title: `Error `,
                description: AxiosError.response?.data.message || `Error while fetching messages`,
                variant: 'destructive'
            })

        } finally {
            setIsLoading(false)
            setIsSwitchLoading(false)
        }


    }, [setIsLoading, setMessages])
    useEffect(() => {
        if (!session || !session.user) return
        fetchMessages()
        fetchAcceptMessage()

    }, [session, setValue, fetchAcceptMessage, fetchMessages])

    //handle switch change
    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>(`/api/accept-message`, {
                acceptMessages: !acceptMessages,
            })
            setValue('acceptMessages', !acceptMessages)
            toast({
                title: response.data.message,
                variant: 'default'
            })

        } catch (error) {
            const AxiosError = error as AxiosError<ApiResponse>
            toast({
                title: `Error `,
                description: AxiosError.response?.data.message || `Failed while fetching messages`,
                variant: 'destructive'
            })

        }
    }

    const { username } = session?.user || {} as User
    const profileUrl = `${window.location.protocol}//${window.location.host}/user/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: `Url Copied`,
            description: `Url  copied to clipboard`
        })

    }

    if (!session || !session.user) {
        return (
            <div className="bg-black text-white flex items-center justify-center h-screen">
                <div>
                    Please Login to Proceed!
                    <Link href='/sign-up'>
                        <Button className="ml-2">Sign Up</Button>
                    </Link>
                </div>
            </div>
        );
    }
    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg">
            <header className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <div className="userinfo text-xl">Welcome back, {username}</div>
                </div>
                <div className="copybutton-info">
                    <h3 className="text-lg">Copy the URL to get anonymous messages.</h3>
                    <div className="w-full flex items-center flex-grow justify-between mt-2">
                        <input
                            type="text"
                            value={profileUrl}
                            disabled
                            className='input input-bordered w-full p-4 bg-gray-700 text-white border-gray-600 rounded-md shadow-sm'
                        />
                        <Button onClick={copyToClipboard} className="ml-2 bg-blue-600 hover:bg-blue-700 transition duration-300">
                            Copy
                        </Button>
                    </div>
                </div>
            </header>
            <Separator className="mb-6 border-gray-600" />
            
            <div className="mb-5 flex items-center">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                    className="bg-gray-700 border-gray-600"
                />
                <span className='m-5'>
                    Accept Messages {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>

            <Separator className="mb-6 border-gray-600" />

            <Button
                className='mt-4 border-gray-600 bg-blue-600 hover:bg-blue-700 transition duration-300'
                variant='outline'
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isloading ? (
                    <Loader2 className='animate-spin w-4 h-4' />
                ) : (
                    <RefreshCcw className='w-4 h-4' />
                )}
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {
                    messages.length > 0 ? (
                        messages.map((message) => (
                            <MessageCard
                                key={message._id}
                                message={message}
                                onMessageDelete={handleDeleteMessage}
                                className="bg-gray-700 p-4 rounded-lg shadow-md transition-transform transform hover:scale-[1.02]"
                            />
                        ))
                    ) : (
                        <p>No messages for you to display.</p>
                    )
                }
            </div>
        </div>
    );

};

export default DashboardPage;