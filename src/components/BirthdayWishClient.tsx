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

import type { BirthdayWish, ThemeConfig } from "@/types/birthday";
import { relationThemes } from "@/utils/theme";

const defaultTheme: ThemeConfig = {
  primary: "from-indigo-400 to-pink-400",
  secondary: "from-indigo-500 to-pink-500",
  accent: "indigo-300",
  background: "from-indigo-100 via-pink-100 to-indigo-100",
  text: "text-indigo-800",
};

// Initialize i18next for translations
i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        greeting: "Happy Birthday",
        age: "years and many more to go ❤️",
        by: "Created with ❤️ by",
        error: "Birthday wish not found",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default function BirthdayWishClient({ theme }: { theme?: ThemeConfig }) {
  const params = useParams();
  const [wish, setWish] = useState<BirthdayWish | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const appliedTheme: ThemeConfig =
    theme || (wish?.relation ? relationThemes[wish.relation] : defaultTheme);

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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Greeting Section */}
        <div
          className={`bg-gradient-to-r ${appliedTheme.primary} text-white rounded-2xl p-8 shadow-lg`}
        >
          <h1 className="text-4xl font-bold text-center mb-4">
            <TrueFocus
              sentence={i18next.t("greeting")}
              manualMode={false}
              blurAmount={10}
              borderColor="purple"
              animationDuration={2}
              pauseBetweenAnimations={4}
            />
          </h1>
          <p className="text-center text-xl">
            <DecryptedText
              text={wish.recipientName}
              animateOn="view"
              speed={100}
              maxIterations={75}
              characters="ABCDEFG1234!?@"
            />
          </p>
        </div>

        {/* Birthday Details */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between">
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
                <p className="text-indigo-700 font-bold text-lg">
                  {wish.dateOfBirth}
                </p>
              </div>
            }
            gridSize={12}
            pixelColor="#ddd"
            animationStepDuration={0.3}
          />
             {/* Stack Component */}
        <Stack
          wish={{ imageUrls: wish.imageUrls }}
          randomRotation={true}
          sensitivity={180}
          sendToBackOnClick={false}
        />

        </div>

        {/* Description */}
        <div
          className={`bg-gradient-to-r ${appliedTheme.secondary} text-gray-600 rounded-2xl p-6 shadow-md`}
        >
         
            {/* Age Section */}
        <div className="bg-white rounded-2xl shadow-md p-6">
        
          <p className=" text-3xl inline-block text-gray-600">{calculateAge(wish.dateOfBirth )} &nbsp; </p>
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
          <p className="text-right mt-4">
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
        </div>

     
      

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </div>
    </div>
  );
}
