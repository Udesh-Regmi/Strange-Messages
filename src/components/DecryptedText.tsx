import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

/**
* DecryptedText
*
* Props:
* - text: string
* - speed?: number
* - maxIterations?: number
* - sequential?: boolean
* - revealDirection?: "start" | "end" | "center"
* - useOriginalCharsOnly?: boolean
* - characters?: string
* - className?: string          (applied to revealed/normal letters)
* - encryptedClassName?: string (applied to encrypted letters)
* - parentClassName?: string    (applied to the top-level span container)
* - animateOn?: "view" | "hover"  (default: "hover")
*/
interface DecryptedTextProps {
  text: string; // Explicitly define 'text' as a string
  speed?: number; // Optional speed (default: 50)
  maxIterations?: number; // Optional max iterations (default: 10)
  sequential?: boolean; // Optional boolean (default: false)
  revealDirection?: "start" | "end" | "center"; // Optional reveal direction (default: "start")
  useOriginalCharsOnly?: boolean; // Optional (default: false)
  characters?: string; // Optional string (default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+')
  className?: string; // Optional className for revealed/normal letters
  encryptedClassName?: string; // Optional className for encrypted letters
  parentClassName?: string; // Optional className for the top-level span container
  animateOn?: "view" | "hover"; // Optional (default: "hover")
}
const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
speed = 50,
maxIterations = 10,
sequential = false,
revealDirection = 'start',
useOriginalCharsOnly = false,
characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
className = '',
parentClassName = '',
encryptedClassName = '',
animateOn = 'hover',
...props
})=> {
const [displayText, setDisplayText] = useState(text)
const [isHovering, setIsHovering] = useState(false)
const [isScrambling, setIsScrambling] = useState(false)
const [revealedIndices, setRevealedIndices] = useState(new Set())
const [hasAnimated, setHasAnimated] = useState(false)
const containerRef = useRef(null)

useEffect(() => {
  let interval : any 
  let currentIteration = 0

  const getNextIndex = (revealedSet: any ) => {
    const textLength = text.length
    switch (revealDirection) {
      case 'start':
        return revealedSet.size
      case 'end':
        return textLength - 1 - revealedSet.size
      case 'center': {
        const middle = Math.floor(textLength / 2)
        const offset = Math.floor(revealedSet.size / 2)
        const nextIndex =
          revealedSet.size % 2 === 0
            ? middle + offset
            : middle - offset - 1

        if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
          return nextIndex
        }
        for (let i = 0; i < textLength; i++) {
          if (!revealedSet.has(i)) return i
        }
        return 0
      }
      default:
        return revealedSet.size
    }
  }

  const availableChars = useOriginalCharsOnly
    ? Array.from(new Set(text.split(''))).filter((char) => char !== ' ')
    : characters.split('')

  const shuffleText = (originalText : any, currentRevealed: any) => {
    if (useOriginalCharsOnly) {
      const positions = originalText.split('').map((char: any, i: any) => ({
        char,
        isSpace: char === ' ',
        index: i,
        isRevealed: currentRevealed.has(i),
      }))

      const nonSpaceChars = positions
        .filter((p: any) => !p.isSpace && !p.isRevealed)
        .map((p: any) => p.char)

      for (let i = nonSpaceChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
          ;[nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]]
      }

      let charIndex = 0
      return positions
        .map((p: any) => {
          if (p.isSpace) return ' '
          if (p.isRevealed) return originalText[p.index]
          return nonSpaceChars[charIndex++]
        })
        .join('')
    } else {
      return originalText
        .split('')
        .map((char: any, i: any) => {
          if (char === ' ') return ' '
          if (currentRevealed.has(i)) return originalText[i]
          return availableChars[Math.floor(Math.random() * availableChars.length)]
        })
        .join('')
    }
  }

  if (isHovering) {
    setIsScrambling(true)
    interval = setInterval(() => {
      setRevealedIndices((prevRevealed) => {
        if (sequential) {
          if (prevRevealed.size < text.length) {
            const nextIndex = getNextIndex(prevRevealed)
            const newRevealed = new Set(prevRevealed)
            newRevealed.add(nextIndex)
            setDisplayText(shuffleText(text, newRevealed))
            return newRevealed
          } else {
            clearInterval(interval)
            setIsScrambling(false)
            return prevRevealed
          }
        } else {
          setDisplayText(shuffleText(text, prevRevealed))
          currentIteration++
          if (currentIteration >= maxIterations) {
            clearInterval(interval)
            setIsScrambling(false)
            setDisplayText(text)
          }
          return prevRevealed
        }
      })
    }, speed)
  } else {
    setDisplayText(text)
    setRevealedIndices(new Set())
    setIsScrambling(false)
  }

  return () => {
    if (interval) clearInterval(interval)
  }
}, [
  isHovering,
  text,
  speed,
  maxIterations,
  sequential,
  revealDirection,
  characters,
  useOriginalCharsOnly,
])

useEffect(() => {
  if (animateOn !== 'view') return

  const observerCallback = (entries: any) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting && !hasAnimated) {
        setIsHovering(true)
        setHasAnimated(true)
      }
    })
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  }

  const observer = new IntersectionObserver(observerCallback, observerOptions)
  const currentRef = containerRef.current
  if (currentRef) {
    observer.observe(currentRef)
  }

  return () => {
    if (currentRef) observer.unobserve(currentRef)
  }
}, [animateOn, hasAnimated])

const hoverProps =
  animateOn === 'hover'
    ? {
      onMouseEnter: () => setIsHovering(true),
      onMouseLeave: () => setIsHovering(false),
    }
    : {}

return (
  <motion.span
    ref={containerRef}
    className={`inline-block whitespace-pre-wrap relative ${parentClassName}`}
    {...hoverProps}
    {...props}
  >
    <span className="sr-only">{displayText}</span>

    <span aria-hidden="true">
      {displayText.split('').map((char, index) => {
        const isRevealedOrDone =
          revealedIndices.has(index) || !isScrambling || !isHovering

        return (
          <span
            key={index}
            className={isRevealedOrDone ? className : encryptedClassName}
          >
            {char}
          </span>
        )
      })}
    </span>
  </motion.span>
)
}
export default DecryptedText