"use client";
import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User } from 'next-auth';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MobileLinkProps {
  href: string;
  children: React.ReactNode;
  onOpenChange?: () => void;
}

const MobileLink = ({ href, children, onOpenChange }: MobileLinkProps) => (
  <Link href={href} onClick={onOpenChange}>
    {children}
  </Link>
);

const NavItems: React.FC = () => (
  <>
    <Link href="/" className="text-sm font-medium transition-colors hover:text-gray-500">
      Home
    </Link>
    <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-gray-500">
      Dashboard
    </Link>
    <Link href="/feed" className="text-sm font-medium transition-colors hover:text-gray-500">
      Feed
    </Link>
    <Link href="/buy-me-coffee" className="text-sm font-medium transition-colors hover:text-gray-500">
      Buy Coffee
    </Link>
    <Link href="/birthday-wish" className="text-sm font-medium transition-colors hover:text-gray-500">
      Wish Someone 
    </Link>
  </>
);

const NavigationBar: React.FC = () => {
  const { data: session } = useSession();
  const user: User | null = session?.user as User | null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white backdrop-blur-lg supports-[backdrop-filter]:bg-opacity-80 px-6">
      <div className="container flex h-14 items-center justify-between">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold text-black sm:inline-block">
              Strange Messages
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium text-gray-800">
            <NavItems />
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5 text-black" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 bg-white backdrop-blur-lg">
            <MobileLink href="/" onOpenChange={() => {}}>
              <span className="font-bold text-black">Strange Messages</span>
            </MobileLink>
            <div className="my-4 flex flex-col space-y-3">
              <NavItems />
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center space-x-2 md:justify-end">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image || ''} alt={user?.username || user?.email || ''} />
                    <AvatarFallback>{user?.username?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white text-gray-800">
                <DropdownMenuItem className="flex-col items-start">
                  <div className="text-sm font-medium">{user?.username || user?.email}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
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
              <Button variant="default" size="default" className='px-4 py-4'>
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavigationBar;
