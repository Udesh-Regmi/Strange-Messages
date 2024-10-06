"use client"
import { useSession,signOut } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import { User } from "next-auth";
import { Button } from './ui/button';


const NavigationBar = () => {
    const {data : session } = useSession()
    const user : User = session?.user as User
    return (
        <nav className="bg-gray-900 text-white shadow-lg p-4">
          <div className="container mx-auto flex items-center justify-between">
            <a href="/" className="text-2xl font-bold tracking-tight text-indigo-300 hover:text-indigo-400">
              Anonymous Messages
            </a>
            <div>
              {session ? (
                <>
                  <span className="mr-4 text-gray-300">
                    Welcome back, {user.username || user.email} 😊
                  </span>
                  <Button
                    onClick={() => signOut()}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
                  >
                    Logout 🥺
                  </Button>
                </>
              ) : (
                <Link href="/sign-in">
                  <Button className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition duration-300 ease-in-out">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      );
      
};

export default NavigationBar;