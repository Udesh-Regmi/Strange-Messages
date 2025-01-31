
"use client"
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{ username: string }>()
    const { toast } = useToast()
    // zod implementation
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),

    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code,

            })
            toast({
                title: `Success`,
                description: response.data.message
            })
            router.replace('/sign-in')
        } catch (error) {
            console.error(`Error in signing user ${error}`)
            const axiosError = error as AxiosError<ApiResponse>

            toast({
                title: `Signup failed `,
                description: axiosError.response?.data.message,
                variant: "destructive",
            })


        }

    }

    return (
<div className="flex items-center justify-center min-h-screen bg-white">
<div className="w-full max-w-md p-8 space-y-8 bg-white bg-opacity-40 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl ring-2 ring-indigo-200 ring-opacity-50">
<div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-5">
                        Join Strange Messages
                    </h1>
                    <p className="mb-3">Verify Code to enjoy Strange Journey </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel> Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default VerifyAccount;