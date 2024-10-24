"use client";

import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

const Feed = () => {
    const { data: session } = useSession();

    if (!session || !session.user) {
        return (
            <div className="bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-200 text-black flex items-center justify-center min-h-screen">
                <div className="text-center p-8 rounded-lg shadow-lg bg-white">
                    <p className="text-xl font-semibold mb-4 text-indigo-900">Please login to proceed to Feed</p>
                    <Link href='/sign-up'>
                        <Button className="ml-2 bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300">
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="flex flex-grow justify-center items-center min-h-screen bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-200 text-indigo-900">
            <div className="text-center p-8 rounded-lg shadow-lg bg-white">
                <h1 className="text-5xl font-bold mb-6 text-black">Welcome to Feed</h1>
                <p className="text-lg font-medium mb-4 text-black">Enjoy the latest updates and posts from your connections.</p>
                <Link href='/'>
                        <Button className="ml-2 bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300">
                            Explore Feed
                        </Button>
                    </Link>
            </div>
        </main>
    );
};

export default Feed;
