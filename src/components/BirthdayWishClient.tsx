"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import type { BirthdayWish, ThemeConfig } from "@/types/birthday";
import { relationThemes } from "@/utils/theme";

const defaultTheme: ThemeConfig = {
  primary: "from-blue-400 to-purple-400",
  secondary: "from-blue-500 to-purple-500",
  accent: "blue-300",
  background: "from-blue-100 via-purple-100 to-blue-100",
  text: "text-blue-800",
};

export default function BirthdayWishClient({ theme }: { theme?: ThemeConfig }) {
  const params = useParams();
  const [wish, setWish] = useState<BirthdayWish | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  const appliedTheme: ThemeConfig =
    theme || (wish?.relation ? relationThemes[wish.relation] : defaultTheme);

  useEffect(() => {
    const fetchWish = async () => {
      try {
        const response = await axios.get(
          `/api/birthday-wish?wishId=${params.wishId}`
        );
        setWish(response.data);
        triggerConfetti();
      } catch (error) {
        console.error("Error fetching birthday wish:", error);
        setError("Failed to load birthday wish");
      } finally {
        setLoading(false);
      }
    };

    fetchWish();
  }, [params.wishId]);

  useEffect(() => {
    if (!loading && messageRef.current && imagesRef.current) {
      gsap.fromTo(
        messageRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: messageRef.current,
            start: "top center",
          },
        }
      );

      gsap.fromTo(
        imagesRef.current.children,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: imagesRef.current,
            start: "top center",
          },
        }
      );
    }
  }, [loading, wish]);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#FF69B4", "#4B0082", "#9370DB"],
      });
    }, 250);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={`h-16 w-16 border-t-4 border-${appliedTheme.accent} rounded-full`}
        />
      </div>
    );
  }

  if (error || !wish) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
      >
        <div className="bg-red-50 p-6 rounded-lg text-red-600">
          <p className="text-xl">{error || "Birthday wish not found"}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-r ${appliedTheme.background} py-12 px-4`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <motion.div
          className={`bg-gradient-to-r ${appliedTheme.primary} rounded-3xl p-8 mb-12 relative overflow-hidden shadow-lg`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-5xl font-bold text-white text-center mb-6"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Happy Birthday {wish.recipientName}! 🎉
          </motion.h1>
          <motion.div
            ref={messageRef}
            className="bg-white/90 rounded-2xl p-8 backdrop-blur-sm"
          >
            <p className={`text-xl leading-relaxed ${appliedTheme.text}`}>
              {wish.description}
            </p>
            <motion.div
              className="mt-4 text-right"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className={`inline-block ${appliedTheme.text} font-semibold`}>
                Written With love,
                <br />
                {wish.createdBy}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          ref={imagesRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {wish.imageUrls.map((url, index) => (
           <motion.div
           key={url}
           className="relative aspect-square rounded-2xl  shadow-xl group"
           initial={{ opacity: 0, scale: 0.8 }}
           whileHover={{ scale: 1.1 }}
           transition={{ duration: 0.3 }}
         >
           <Image
             src={url}
             alt={`Birthday memory ${index + 1}`}
             fill
             className="object-cover transition-transform duration-300"
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
             priority={index < 2}
           />
         </motion.div>
         
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
