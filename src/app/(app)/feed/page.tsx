"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import testmessages from "@/testjson.json";
import Image from "next/image";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Feed = () => {
  const { data: session } = useSession();

  if (!session || !session.user) {
    return (
      <div className="bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-200 text-black flex items-center justify-center min-h-screen">
        <div className="text-center p-8 rounded-lg shadow-lg bg-white">
          <p className="text-xl font-semibold mb-4 text-indigo-900">
            Please login to proceed to Feed
          </p>
          <Link href="/sign-up">
            <Button className="ml-2 bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-200 text-indigo-900 p-4">
      {/* Add User Button */}
      <div className="self-end p-4">
        <Link href='/feed/connections'>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300">
          Add User
        </Button>
        </Link>
      </div>

      {/* Center Card Carousel */}
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center p-8 rounded-lg shadow-lg bg-white mb-8">
          <h1 className="text-5xl font-bold mb-6 text-black">Welcome to Feed </h1>
          <p className="text-lg font-medium mb-4 text-black">
           ............This page is not fully  functional yet............
          </p>
        </div>

        {/* Grid Layout for Carousels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {testmessages.map((user, userIndex) => (
            <div
              key={userIndex}
              className="flex justify-center items-center"
            >
              <Carousel
                plugins={[Autoplay({ delay: Math.floor(Math.random() * 3000 + 7000) })
                ]}
                className="w-full max-w-md"
              >
                <CarouselContent>
                  {user.messages.map((message, msgIndex) => (
                    <CarouselItem key={msgIndex}>
                      <Card className="bg-gray-800 overflow-hidden bg-cover">
                        <AspectRatio ratio={1 / 1}>
                          <Image
                            src={user.photo}
                            alt={user.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover rounded-t-md"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                            <h2 className="text-xl font-bold text-white mb-2">
                              {user.title}
                            </h2>
                            <p className="text-sm text-gray-200">{message}</p>
                            <span className="text-xs text-gray-400 mt-2">
                              {user.receivedAt}
                            </span>
                          </div>
                        </AspectRatio>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="text-black hover:text-slate-600 border border-gray-400 left-2" />
                <CarouselNext className="text-black hover:text-slate-600 border border-gray-400 right-2" />
              </Carousel>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Feed;
