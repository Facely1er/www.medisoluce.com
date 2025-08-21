import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextCarouselProps {
  texts: string[];
  interval?: number;
  className?: string;
}

const TextCarousel: React.FC<TextCarouselProps> = ({
  texts,
  interval = 4000,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const safeTexts = Array.isArray(texts) ? texts.filter(Boolean) : [];

  useEffect(() => {
    if (safeTexts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % safeTexts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [safeTexts.length, interval]);

  if (safeTexts.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {safeTexts.length > 1 ? (
        <AnimatePresence initial={false} mode="sync">
          <motion.span
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="block"
          >
            {safeTexts[currentIndex]}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="block">{safeTexts[0]}</span>
      )}
      
      {/* Progress indicators */}
      {safeTexts.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {safeTexts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary-500 scale-125' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary-300 dark:hover:bg-primary-700'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TextCarousel;