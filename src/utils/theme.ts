
// src/utils/themes.ts
import type { Relation, ThemeConfig } from '@/types/birthday';

export const relationThemes: Record<Relation, ThemeConfig> = {
  sister: {
    primary: 'from-pink-400 to-purple-400',
    secondary: 'from-pink-500 to-purple-500',
    accent: 'pink-300',
    background: 'from-pink-100 via-purple-100 to-pink-100',
    text: 'text-purple-800'
  },
  brother: {
    primary: 'from-blue-400 to-indigo-400',
    secondary: 'from-blue-500 to-indigo-500',
    accent: 'blue-300',
    background: 'from-blue-100 via-indigo-100 to-blue-100',
    text: 'text-indigo-800'
  },
  friend: {
    primary: 'from-green-400 to-teal-400',
    secondary: 'from-green-500 to-teal-500',
    accent: 'green-300',
    background: 'from-green-100 via-teal-100 to-green-100',
    text: 'text-teal-800'
  },
  love: {
    primary: 'from-red-400 to-pink-400',
    secondary: 'from-red-500 to-pink-500',
    accent: 'red-300',
    background: 'from-red-100 via-pink-100 to-red-100',
    text: 'text-red-800'
  },
  bestFriend: {
    primary: 'from-yellow-400 to-orange-400',
    secondary: 'from-yellow-500 to-orange-500',
    accent: 'yellow-300',
    background: 'from-yellow-100 via-orange-100 to-yellow-100',
    text: 'text-orange-800'
  }
};