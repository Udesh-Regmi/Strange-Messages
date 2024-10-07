"use client"

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User } from "next-auth";
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NavigationBar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  const NavItems = () => (
    <>
      <Link href="/" className="text-sm font-medium transition-colors hover:text-gray-300">
        Home
      </Link>
      <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-gray-300">
        Dashboard
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900 backdrop-blur supports-[backdrop-filter]:bg-gray-800">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold text-white sm:inline-block">
              Anonymous Messages
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium text-gray-200">
            <NavItems />
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-gray-700 focus-visible:bg-gray-700 focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="h-5 w-5 text-white" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 bg-gray-900">
            <MobileLink href="/" className="flex items-center" onOpenChange={() => {}}>
              <span className="font-bold text-white">Anonymous Messages</span>
            </MobileLink>
            <div className="my-4 flex flex-col space-y-3">
              <NavItems />
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search functionality here if needed */}
          </div>
          <nav className="flex items-center">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || ''} alt={user.username || user.email || ''} />
                      <AvatarFallback>{user.username?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 text-gray-200">
                  <DropdownMenuItem className="flex-col items-start">
                    <div className="text-sm font-medium">{user.username || user.email}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/sign-in">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

const MobileLink = ({ href, children, ...props }) => {
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
};

export default NavigationBar;
