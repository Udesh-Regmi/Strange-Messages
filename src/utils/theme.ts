import type { Relation, ThemeConfig } from '@/types/birthday'; // Make sure the path is correct

export const relationThemes: Record<Relation, ThemeConfig> = {
  lover: {
    primary: 'from-rose-400 via-red-400 to-pink-400',
    secondary: 'from-rose-500 via-red-500 to-pink-500',
    accent: 'rose-300',
    background: 'from-rose-50 via-red-50 to-pink-50',
    text: 'text-black',
    borderGradient: 'border-gradient-to-r from-rose-400 via-red-400 to-pink-400',
    glowEffect: 'animate-glow-rose',
    particleEffects: ['hearts', 'sparkles', 'stars'],
    animations: ['floating', 'pulse', 'shimmer'],
    decorativeElements: ['❤️', '💕', '💑', '💘'],
    specialEffects: {
      hover: 'hover:shadow-xl hover:shadow-rose-200/50',
      active: 'active:scale-98',
      cards: 'backdrop-blur-sm bg-white/40',
      text: 'bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600'
    }
  },

  girlFriend: {
    primary: 'from-fuchsia-400 via-pink-400 to-purple-400',
    secondary: 'from-fuchsia-500 via-pink-500 to-purple-500',
    accent: 'fuchsia-300',
    background: 'from-fuchsia-50 via-pink-50 to-purple-50',
    text: 'text-fuchsia-800',
    borderGradient: 'border-gradient-to-r from-fuchsia-400 via-pink-400 to-purple-400',
    glowEffect: 'animate-glow-fuchsia',
    particleEffects: ['hearts', 'butterflies', 'flowers'],
    animations: ['bounce', 'float', 'twirl'],
    decorativeElements: ['💝', '🦋', '🌸', '✨'],
    specialEffects: {
      hover: 'hover:shadow-xl hover:shadow-fuchsia-200/50',
      active: 'active:scale-98',
      cards: 'backdrop-blur-sm bg-white/40',
      text: 'bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-600 to-purple-600'
    }
  },

  boyFriend: {
    primary: 'from-blue-400 via-indigo-400 to-violet-400',
    secondary: 'from-blue-500 via-indigo-500 to-violet-500',
    accent: 'blue-300',
    background: 'from-blue-50 via-indigo-50 to-violet-50',
    text: 'text-blue-800',
    borderGradient: 'border-gradient-to-r from-blue-400 via-indigo-400 to-violet-400',
    glowEffect: 'animate-glow-blue',
    particleEffects: ['stars', 'sparkles', 'hearts'],
    animations: ['slide', 'pulse', 'float'],
    decorativeElements: ['💙', '⭐', '✨', '💫'],
    specialEffects: {
      hover: 'hover:shadow-xl hover:shadow-blue-200/50',
      active: 'active:scale-98',
      cards: 'backdrop-blur-sm bg-white/40',
      text: 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600'
    }
  },

  husband: {
    primary: 'from-amber-400 via-rose-400 to-purple-400',
    secondary: 'from-amber-500 via-rose-500 to-purple-500',
    accent: 'amber-300',
    background: 'from-amber-50 via-rose-50 to-purple-50',
    text: 'text-amber-800',
    borderGradient: 'border-gradient-to-r from-amber-400 via-rose-400 to-purple-400',
    glowEffect: 'animate-glow-amber',
    particleEffects: ['rings', 'hearts', 'stars'],
    animations: ['float', 'pulse', 'shine'],
    decorativeElements: ['💍', '💑', '💖', '✨'],
    specialEffects: {
      hover: 'hover:shadow-xl hover:shadow-amber-200/50',
      active: 'active:scale-98',
      cards: 'backdrop-blur-sm bg-white/40',
      text: 'bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-purple-600'
    }
  },
  
  friend: {
    primary: 'from-rose-400 via-amber-400 to-pink-400',
    secondary: 'from-rose-500 via-amber-500 to-pink-500',
    accent: 'rose-300',
    background: 'from-rose-50 via-amber-50 to-pink-50',
    text: 'text-rose-800',
    borderGradient: 'border-gradient-to-r from-rose-400 via-amber-400 to-pink-400',
    glowEffect: 'animate-glow-rose',
    particleEffects: ['rings', 'sparkles', 'hearts'],
    animations: ['float', 'pulse', 'sparkle'],
    decorativeElements: ['💍', '💝', '💑', '✨'],
    specialEffects: {
      hover: 'hover:shadow-xl hover:shadow-rose-200/50',
      active: 'active:scale-98',
      cards: 'backdrop-blur-sm bg-white/40',
      text: 'bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600'
    }
  },

  sister: {
    primary: 'from-purple-400 via-pink-400 to-violet-400',
    secondary: 'from-purple-500 via-pink-500 to-violet-500',
    accent: 'purple-300',
    background: 'from-purple-50 via-pink-50 to-violet-50',
    text: 'text-purple-800',
    borderGradient: 'border-gradient-to-r from-purple-400 via-pink-400 to-violet-400',
    glowEffect: 'animate-glow-purple',
    particleEffects: ['butterflies', 'sparkles', 'petals'],
    animations: ['breeze', 'bounce', 'shimmer'],
    decorativeElements: ['💜', '👭', '🌸'],
    specialEffects: {
      hover: 'hover:shadow-xl hover:shadow-purple-200/50',
      active: 'active:scale-98',
      cards: 'backdrop-blur-md bg-white/40',
      text: 'bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600'
    }
  },

  brother: {
    primary: 'from-blue-500 via-indigo-500 to-cyan-500',
    secondary: 'from-blue-600 via-indigo-600 to-cyan-600',
    accent: 'blue-300',
    background: 'from-blue-50 via-indigo-50 to-cyan-50',
    text: 'text-blue-900',
    borderGradient: 'border-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500',
    glowEffect: 'animate-glow-blue',
    particleEffects: ['lightning', 'orbs', 'waves'],
    animations: ['hover-float', 'glow', 'pulse'],
    decorativeElements: ['💙', '🧑‍🤝‍🧑', '⚡'],
    specialEffects: {
      hover: 'hover:shadow-xl hover:shadow-blue-200/50',
      active: 'active:scale-97',
      cards: 'backdrop-blur-md bg-white/40',
      text: 'bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600'
    }
  },

  nothing: {
    primary: 'from-green-400 via-teal-400 to-emerald-400',
    secondary: 'from-green-500 via-teal-500 to-emerald-500',
    accent: 'green-300',
    background: 'from-green-50 via-teal-50 to-emerald-50',
    text: 'text-green-800',
    borderGradient: 'border-gradient-to-r from-green-400 via-teal-400 to-emerald-400',
    glowEffect: 'animate-glow-green',
    particleEffects: ['confetti', 'balloons', 'bubbles'],
    animations: ['wave', 'zoom', 'spin'],
    decorativeElements: ['💚', '🤝', '🌿'],
    specialEffects: {
      hover: 'hover:shadow-xl hover:shadow-green-200/50',
      active: 'active:scale-99',
      cards: 'backdrop-blur-md bg-white/40',
      text: 'bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600'
    }
  },

  one_sided: {
    primary: 'from-gray-400 via-blue-400 to-indigo-400',
    secondary: 'from-gray-500 via-blue-500 to-indigo-500',
    accent: 'gray-300',
    background: 'from-gray-50 via-blue-50 to-indigo-50',
    text: 'text-gray-700',
    borderGradient: 'border-gradient-to-r from-gray-400 via-blue-400 to-indigo-400',
    glowEffect: 'animate-glow-gray',
    particleEffects: ['falling-petals', 'rain', 'broken-hearts'],
    animations: ['fade', 'slow-glow', 'drift'],
    decorativeElements: ['💔', '😔', '💭'],
    specialEffects: {
      hover: 'hover:shadow-lg hover:shadow-gray-300/50',
      active: 'active:scale-100',
      cards: 'backdrop-blur-md bg-white/30',
      text: 'bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-blue-600'
    }
  },

  bestFriend: {
    primary: 'from-yellow-400 via-orange-400 to-amber-400',
    secondary: 'from-yellow-500 via-orange-500 to-amber-500',
    accent: 'yellow-300',
    background: 'from-yellow-50 via-orange-50 to-amber-50',
    text: 'text-yellow-800',
    borderGradient: 'border-gradient-to-r from-yellow-400 via-orange-400 to-amber-400',
    glowEffect: 'animate-glow-yellow',
    particleEffects: ['smiley-faces', 'sunbursts', 'glitters'],
    animations: ['bounce', 'vibrate', 'spin'],
    decorativeElements: ['🌟', '😊', '🎉'],
    specialEffects: {
      hover: 'hover:shadow-xl hover:shadow-yellow-200/50',
      active: 'active:scale-98',
      cards: 'backdrop-blur-md bg-white/40',
      text: 'bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-orange-600'
    }
  },

  mother: {
    primary: 'from-pink-500 via-rose-500 to-fuchsia-500',
    secondary: 'from-pink-600 via-rose-600 to-fuchsia-600',
    accent: 'pink-300',
    background: 'from-pink-50 via-rose-50 to-fuchsia-50',
    text: 'text-pink-900',
    borderGradient: 'border-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500',
    glowEffect: 'animate-glow-pink',
    particleEffects: ['flowers', 'hearts', 'butterflies'],
    animations: ['gentle-glow', 'soft-fade', 'wave'],
    decorativeElements: ['🌹', '👩‍👧', '💗'],
    specialEffects: {
      hover: 'hover:shadow-xl hover:shadow-pink-200/50',
      active: 'active:scale-97',
      cards: 'backdrop-blur-md bg-white/40',
      text: 'bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600'
    }
  },

  father: {
    primary: 'from-gray-600 via-blue-700 to-gray-800',
    secondary: 'from-gray-700 via-blue-800 to-gray-900',
    accent: 'gray-400',
    background: 'from-gray-50 via-blue-50 to-gray-100',
    text: 'text-gray-900',
    borderGradient: 'border-gradient-to-r from-gray-600 via-blue-700 to-gray-800',
    glowEffect: 'animate-glow-gray',
    particleEffects: ['stars', 'mountains', 'shields'],
    animations: ['subtle-pulse', 'steady-glow', 'fade'],
    decorativeElements: ['🛡️', '👨‍👦', '💙'],
    specialEffects: {
      hover: 'hover:shadow-xl hover:shadow-gray-300/50',
      active: 'active:scale-98',
      cards: 'backdrop-blur-md bg-white/40',
      text: 'bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-blue-700'
    }
  },

  // Add other relationships with similar detailed configurations...
};