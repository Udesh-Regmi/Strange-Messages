// // types/birthday.ts
// export type Relation = 'sister' | 'brother' | 'friend' | 'love' | 'bestFriend';

// export interface ThemeConfig {
//   primary: string;
//   secondary: string;
//   accent: string;
//   background: string;
//   text: string;
// }

// export interface BirthdayWish {
//   recipientName: string;
//   dateOfBirth: string;
//   description: string;
//   imageUrls: string[];
//   createdBy: string;
//   relation: Relation;
// }

// // utils/themes.ts
// export const relationThemes: Record<Relation, ThemeConfig> = {
//   sister: {
//     primary: 'from-pink-400 to-purple-400',
//     secondary: 'from-pink-500 to-purple-500',
//     accent: 'pink-300',
//     background: 'from-pink-100 via-purple-100 to-pink-100',
//     text: 'text-purple-800'
//   },
//   brother: {
//     primary: 'from-blue-400 to-indigo-400',
//     secondary: 'from-blue-500 to-indigo-500',
//     accent: 'blue-300',
//     background: 'from-blue-100 via-indigo-100 to-blue-100',
//     text: 'text-indigo-800'
//   },
//   friend: {
//     primary: 'from-green-400 to-teal-400',
//     secondary: 'from-green-500 to-teal-500',
//     accent: 'green-300',
//     background: 'from-green-100 via-teal-100 to-green-100',
//     text: 'text-teal-800'
//   },
//   love: {
//     primary: 'from-red-400 to-pink-400',
//     secondary: 'from-red-500 to-pink-500',
//     accent: 'red-300',
//     background: 'from-red-100 via-pink-100 to-red-100',
//     text: 'text-red-800'
//   },
//   bestFriend: {
//     primary: 'from-yellow-400 to-orange-400',
//     secondary: 'from-yellow-500 to-orange-500',
//     accent: 'yellow-300',
//     background: 'from-yellow-100 via-orange-100 to-yellow-100',
//     text: 'text-orange-800'
//   }
// };

// // components/BirthdayWishPage.tsx
// "use client";
// import { useEffect, useState, useRef } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion';
// import confetti from 'canvas-confetti';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
// import type { BirthdayWish, ThemeConfig } from '@/types/birthday';
// import { relationThemes } from '@/utils/themes';

// gsap.registerPlugin(ScrollTrigger);

// const BirthdayWishPage = () => {
//   const params = useParams();
//   const router = useRouter();
//   const [wish, setWish] = useState<BirthdayWish | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const messageRef = useRef<HTMLDivElement>(null);
//   const imagesRef = useRef<HTMLDivElement>(null);

//   const theme: ThemeConfig = wish ? relationThemes[wish.relation] : relationThemes.friend;

//   useEffect(() => {
//     const fetchWish = async () => {
//       try {
//         const response = await axios.get(`/api/birthday-wish?wishId=${params.wishId}`);
//         setWish(response.data);
//         triggerConfetti();
//       } catch (error) {
//         console.error('Error fetching birthday wish:', error);
//         setError('Failed to load birthday wish');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWish();
//   }, [params.wishId]);

//   useEffect(() => {
//     if (!loading && messageRef.current && imagesRef.current) {
//       // GSAP Animations
//       gsap.fromTo(messageRef.current,
//         { opacity: 0, y: 50 },
//         { 
//           opacity: 1, 
//           y: 0, 
//           duration: 1,
//           scrollTrigger: {
//             trigger: messageRef.current,
//             start: 'top center'
//           }
//         }
//       );

//       gsap.fromTo(imagesRef.current.children,
//         { opacity: 0, scale: 0.8 },
//         { 
//           opacity: 1, 
//           scale: 1, 
//           duration: 0.8,
//           stagger: 0.2,
//           scrollTrigger: {
//             trigger: imagesRef.current,
//             start: 'top center'
//           }
//         }
//       );
//     }
//   }, [loading, wish]);

//   const triggerConfetti = () => {
//     const duration = 3000;
//     const end = Date.now() + duration;

//     const interval = setInterval(() => {
//       if (Date.now() > end) {
//         return clearInterval(interval);
//       }

//       confetti({
//         particleCount: 50,
//         spread: 60,
//         origin: { y: 0.6 },
//         colors: ['#FF69B4', '#4B0082', '#9370DB']
//       });
//     }, 250);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className={`h-16 w-16 border-t-4 border-${theme.accent} rounded-full`}
//         />
//       </div>
//     );
//   }

//   if (error || !wish) {
//     return (
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="flex items-center justify-center min-h-screen"
//       >
//         <div className="bg-red-50 p-6 rounded-lg text-red-600">
//           <p className="text-xl">{error || 'Birthday wish not found'}</p>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <div 
//       ref={containerRef}
//       className={`min-h-screen bg-gradient-to-r ${theme.background} py-12 px-4`}
//     >
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-6xl mx-auto"
//       >
//         {/* Header Section */}
//         <motion.div
//           className={`bg-gradient-to-r ${theme.primary} rounded-3xl p-8 mb-12 relative overflow-hidden`}
//           initial={{ scale: 0.9 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <motion.h1
//             className="text-5xl font-bold text-white text-center mb-6"
//             animate={{ scale: [1, 1.02, 1] }}
//             transition={{ duration: 2, repeat: Infinity }}
//           >
//             Happy Birthday {wish.recipientName}! 🎉
//           </motion.h1>

//           <motion.div
//             ref={messageRef}
//             className="bg-white/90 rounded-2xl p-8 backdrop-blur-sm"
//           >
//             <p className={`text-xl leading-relaxed ${theme.text}`}>
//               {wish.description}
//             </p>
//             <motion.div
//               className="mt-4 text-right"
//               initial={{ x: 20, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.5 }}
//             >
//               <span className={`inline-block ${theme.text} font-semibold`}>
//                 With love,
//                 <br />
//                 {wish.createdBy}
//               </span>
//             </motion.div>
//           </motion.div>
//         </motion.div>

//         {/* Image Gallery */}
//         <motion.div
//           ref={imagesRef}
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//         >
//           <AnimatePresence>
//             {wish.imageUrls.map((url, index) => (
//               <motion.div
//                 key={url}
//                 className="relative aspect-square rounded-2xl overflow-hidden shadow-xl"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 whileHover={{ scale: 1.05 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <Image
//                   src={url}
//                   alt={`Birthday memory ${index + 1}`}
//                   fill
//                   className="object-cover"
//                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   priority={index < 2}
//                 />
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default BirthdayWishPage;

import BirthdayWishClient from '@/components/BirthdayWishClient';
export default function BirthdayWishPage() {
    return <BirthdayWishClient />;
  }