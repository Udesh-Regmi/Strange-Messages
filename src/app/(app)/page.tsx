"use client";
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Autoplay from 'embla-carousel-autoplay';
import messages from "@/messages.json";
import faqquestions from "@/faqquestions.json"
import { Card } from '@/components/ui/card';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Image from 'next/image';
import { Github, Instagram, Linkedin } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-dvh bg-black text-white">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <HoverCard>
          <HoverCardTrigger asChild>
            <section className="bg-gray-900 rounded-lg shadow-xl p-6 max-w-2xl mx-auto mb-6 transition-all duration-300 ease-in-out hover:bg-gray-800 hover:shadow-2xl cursor-pointer">
              <h1 className="text-3xl font-bold mb-4 text-center">
                Dive into an Anonymous Journey
              </h1>
              <p className="text-gray-300 text-sm text-center">
                Share your thoughts anonymously. Express yourself freely without revealing your identity.
              </p>
            </section>
          </HoverCardTrigger>
          <HoverCardContent className="w-80 bg-gray-700 border-gray-600 text-white">
            <p className="text-sm text-center">
              Start your anonymous journey today! Login to learn more about our platform and how it works.
            </p>
          </HoverCardContent>
        </HoverCard>
<div className="card w-full max-w-md">
        <Carousel
          plugins={[Autoplay({ delay: 5000 })]}
          className="w-full max-w-md">
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <Card className="bg-gray-800 border-gray-700 overflow-hidden">
                  <AspectRatio ratio={9 / 7}>
                    <Image
                      src={message.photo}
                      alt={message.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover rounded-t-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
                      <h2 className="text-xl font-bold text-white mb-2">{message.title}</h2>
                      <p className="text-sm text-gray-200">{message.content}</p>
                      <span className="text-xs text-gray-400 mt-2">{message.createdAt}</span>
                    </div>
                  </AspectRatio>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-black" />
          <CarouselNext className="text-black hover:text-slate-600" />
        </Carousel>
        </div>
      </main>

      <div className="faq-section flex flex-grow items-center justify-center py-8 px-4 pt-12">
        <Accordion type="single" collapsible className="w-full max-w-2xl bg-black rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-white mb-4 py-4">Frequently Asked Questions</h2>

          {faqquestions.map(({ id, question, answer }) => (
            <AccordionItem value={id} key={id}>
              <AccordionTrigger className="bg-zinc-900 text-white p-4 rounded-lg hover:bg-white hover:text-black transition-colors duration-200">
                {question}
              </AccordionTrigger>
              <AccordionContent className="p-4 text-white border-t border-gray-600">
                <div dangerouslySetInnerHTML={{ __html: answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="about-developer-side-bar flex flex-col justify-center align-middle text-center mb-4">
      <div className='text-white bg-black'>
      <Sheet>
    <SheetTrigger asChild>
        <Button variant="default">Learn More About the Developer</Button>
    </SheetTrigger>
    <SheetContent className="md:w-[40vw] sm:w-[70vw] bg-gray-900 text-white p-6 shadow-lg rounded-lg">
        <SheetHeader>
            <SheetTitle className="text-2xl font-bold mb-2 text-white">About the Developer</SheetTitle>
            <SheetDescription>
                Here’s some information about the developer. Feel free to reach out!
            </SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right font-semibold">
                    Name
                </Label>
                <Input id="name" value="Udesh Regmi" className="col-span-3 bg-gray-800 text-white" readOnly />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right font-semibold">
                    Role
                </Label>
                <Input id="role" value="Full Stack Developer" className="col-span-3 bg-gray-800 text-white" readOnly />
            </div>
            {/* Developer Skills */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skills" className="text-right font-semibold">
                    Skills
                </Label>
                <Input 
                    id="skills" 
                    value="JavaScript, TypeScript, React, MongoDB, Tailwind CSS" 
                    className="col-span-3 bg-gray-800 text-white" 
                    readOnly 
                />
            </div>
            {/* Developer Experience */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="experience" className="text-right font-semibold">
                    Experience
                </Label>
                <Input 
                    id="experience" 
                    value="1+ years in Web Development" 
                    className="col-span-3 bg-gray-800 text-white" 
                    readOnly 
                />
            </div>
            {/* Developer Contact Links */}
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right font-semibold">
                    Contact
                </Label>
                <div className="col-span-3 flex items-center space-x-4">
                    <a href="mailto:code.udesh@gmail.com" target="_blank" rel="noopener noreferrer">
                        <i className="fa fa-envelope text-xl text-blue-400 hover:text-white"></i>
                    </a>
                    <a href="https://github.com/Udesh-Regmi" target="_blank" rel="noopener noreferrer">
                    <Github/>            
                    </a>
                    <a href="https://www.linkedin.com/in/udesh-regmi/" target="_blank" rel="noopener noreferrer">
                    <Linkedin/>
                    </a>
                    <a href="https://www.instagram.com/udeshregmi/" target="_blank" rel="noopener noreferrer">
                    <Instagram/>

                    </a>
                </div>
            </div>
        </div>
        <SheetFooter>
            <SheetClose asChild>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">Close</Button>
            </SheetClose>
        </SheetFooter>
    </SheetContent>
</Sheet>

        </div>
      </div>

      <footer className='w-full flex flex-col items-center justify-center bg-gray-900 text-white p-2 text-sm'>
        <div className="links">
        
        </div>
        &copy; {new Date().getFullYear()}, Anonymous Messages. All Rights Reserved
      </footer>
    </div>
  );
};

export default HomePage;
