"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import TrueFocus from "./TrueFocus";
import DecryptedText from "./DecryptedText";
import PixelTransition from "./PixelTransition";
import Stack from "./Stack";
import { motion } from "framer-motion";
import { Copy, CopyCheck } from 'lucide-react';


import type { BirthdayWish, ThemeConfig } from "@/types/birthday";
import { relationThemes } from "@/utils/theme";
import BookGallery from "./BookGallery";
import FloatingDecorations from "./FloatingDecorations";


const defaultTheme: ThemeConfig = {
  primary: 'from-red-400 to-pink-400',
  secondary: 'from-indigo-500 to-pink-500',
  accent: 'indigo-300',
  background: 'from-indigo-100 via-pink-100 to-indigo-100',
  text: 'text-indigo-800',
  borderGradient: 'border-gradient-to-r from-indigo-400 to-pink-400',
  glowEffect: 'animate-glow-indigo',
  particleEffects: ['bubbles', 'sparkles', 'stars'],
  animations: ['floating', 'pulse', 'shimmer'],
  decorativeElements: ['✨', '🌟', '💫', '🌸'],
  specialEffects: {
    hover: 'hover:shadow-xl hover:shadow-indigo-200/50',
    active: 'active:scale-98',
    cards: 'backdrop-blur-sm bg-white/40',
    text: 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600'
  }
};


// Initialize i18next for translations


export default function BirthdayWishClient({ theme }: { theme?: ThemeConfig }) {
  const params = useParams();
  const [wish, setWish] = useState<BirthdayWish | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false); // State to track if URL is copied


  const appliedTheme: ThemeConfig =
    theme || (wish?.relationship ? relationThemes[wish.relationship] : defaultTheme);

  const copyUrlToClipboard = () => {
    const pathname = window.location.pathname
    const currentUrl = `${window.location.origin}${pathname}`;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 7000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err);
      });
  };


  i18next.use(initReactI18next).init({
    resources: {
      en: {
        translation: {
          greeting: ` Happy ${wish?.occassion}🎉`,
          age: "years and many more to go ❤️",
          by: "Made with ❤️ by",
          error: "Birthday wish not found",
        },
      },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
  useEffect(() => {
    const fetchWish = async () => {
      try {
        const response = await axios.get(
          `/api/birthday-wish?wishId=${params.wishId}`
        );
        setWish(response.data);
      } catch (error) {
        console.error("Error fetching birthday wish:", error);
        setError(i18next.t("error"));
      } finally {
        setLoading(false);
      }
    };

    fetchWish();
  }, [params.wishId]);

  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    return today.getFullYear() - birth.getFullYear() -
      (today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate()) ? 1 : 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-16 w-16 border-t-4 border-indigo-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !wish) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-r ${appliedTheme.background} py-12 px-6`}
    >
      <FloatingDecorations
        emojis={appliedTheme.decorativeElements}

      />


      <div
        className="max-w-4xl mx-auto space-y-8">
            {/* URL Copy Section */}
        <motion.div
          animate={{ opacity: [0, 1], y: [40, 0] }}
          transition={{ duration: 2 }}
          className={`
            bg-gradient-to-r ${appliedTheme.secondary}
            rounded-2xl p-6 shadow-md
            ${appliedTheme.glowEffect}
            ${appliedTheme?.specialEffects?.hover}
            transform transition-all duration-300
          `}
        >
          <div className="flex items-center justify-between">
            <p className={`text-lg ${appliedTheme.text}`}>
              Share this wish with {wish.recipientName}!  💌
            </p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={copyUrlToClipboard}
              className={`
                flex items-end gap-2
                px-4 py-2 rounded-lg
                ${appliedTheme?.specialEffects?.hover}
                ${appliedTheme.text}
              `}
            >
              {isCopied ? (
                <>
                  < CopyCheck className="text-green-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="text-red-500" />
                  <span>Copy URL</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
        {/* Greeting Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, rotate: [-90, -80, -50, -30, -10, 0] }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`
            bg-gradient-to-r ${appliedTheme.primary} 
            rounded-2xl p-8 
            ${appliedTheme.glowEffect}
            ${appliedTheme?.specialEffects?.hover}
            ${appliedTheme?.specialEffects?.cards}
            ${appliedTheme?.text}
            transform transition-all duration-300
          `}
        >
          <TrueFocus
            sentence={i18next.t("greeting")}
            manualMode={false}
            blurAmount={10}
            borderColor={appliedTheme.accent}
            glowColor={appliedTheme.text}
            animationDuration={1}
            pauseBetweenAnimations={1}
          />
          <motion.p
            animate={{ scale: [0, 0.35, 0.5, 0.75, 1, 1.25, 1.5] }}
            transition={{ duration: 4 }}
            className="text-center text-xl">
            <DecryptedText
              text={wish.recipientName}
              animateOn="view"
              speed={100}
              maxIterations={75}
              characters="ABCDEFG1234!?@"
            />
          </motion.p>
        </motion.div>

        {/* Birthday Details */}
        <motion.div

          animate={{ scale: [0, 0.35, 0.5, 0.75, 1] }}
          transition={{ duration: 1 }}
          className={`
        ${appliedTheme.glowEffect}
          ${appliedTheme?.specialEffects?.cards}
          rounded-2xl shadow-md p-6 flex  align-middle justify-between  
          ${appliedTheme?.specialEffects?.hover}
          transform transition-all duration-600
        `}>
          <PixelTransition
            firstContent={
              <Image
                src={wish.imageUrls[0]}
                alt="Memory"
                width={400}
                height={400}
                className="rounded-lg"
              />
            }
            secondContent={
              <div className="flex items-center justify-center bg-indigo-100 rounded-lg h-full">
                <p className={`font-bold text-lg ${appliedTheme.text}`}>
                  {wish.description.slice(0, 25)}.......
                </p>
              </div>
            }
            gridSize={12}
            pixelColor={appliedTheme.accent}
            animationStepDuration={0.3}
          />
          {/* Stack Component */}
          <Stack
            wish={{ imageUrls: wish.imageUrls }}
            randomRotation={true}
            sensitivity={180}
            sendToBackOnClick={true}
          />
          <p> </p>

        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
          className={`
          bg-gradient-to-r ${appliedTheme.secondary}
          rounded-2xl p-6 shadow-md
          ${appliedTheme.glowEffect}
          ${appliedTheme?.specialEffects?.hover}
          transform transition-all duration-300
        `}>

          {/* Age Section */}
          <div
            className={` bg-white rounded-2xl shadow-md p-6`}>

            <p className=" text-3xl inline-block text-gray-600">{calculateAge(wish.dateOfBirth)} &nbsp; </p>
            <p className={`text-xl inline-block font-semibold ${appliedTheme.text}`}>
              {i18next.t("age")}
            </p>
            <p className="text-lg">
              <DecryptedText
                text={wish.description}
                animateOn="view"
                speed={100}
                maxIterations={100}
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234!?@"
              />
            </p>
            <p className={`text-right ${appliedTheme.text}`}>
              {i18next.t("by")}{" "}
              <DecryptedText
                text={wish.createdBy}
                animateOn="view"
                speed={100}
                maxIterations={50}
                characters="ABC123!?"
              />
            </p>

          </div>
        </motion.div>




        <div
          className={`
          ${appliedTheme?.specialEffects?.cards}
          rounded-2xl p-6
          ${appliedTheme?.specialEffects?.hover}
          transform transition-all duration-300
          ${appliedTheme.glowEffect}
          ${appliedTheme.borderGradient}
          ${appliedTheme.animations?.join(' ')}
          
        `}>
          <BookGallery
            images={wish.imageUrls}
          />
        </div>

        {/* Image Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wish.imageUrls.map((url, index) => (
            <div
              key={index}
              className="relative rounded-xl shadow-md overflow-hidden aspect-square"
            >
              <Image
                src={url}
                alt={`Memory ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
        </div> */}


      </div>
    </div>
  );
}
