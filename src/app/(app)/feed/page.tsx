"use client"
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

const Feed = () => {
    const { data: session } = useSession()
  
    if (!session || !session.user) {
        return (
            <div className="bg-black text-white flex items-center justify-center ">
                <div>
                    Please Login to Proceed to Feed
                    <Link href='/sign-up'>
                        <Button className="ml-2">Sign Up</Button>
                    </Link>
                </div>
            </div>
        );
    }
    return(
        <>
        <main className='flex flex-grow justify-center items-center'>
        WElcome to Feed 


        </main>
        </>
    )
   
    
};

export default Feed;