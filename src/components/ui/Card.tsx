import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  animate?: boolean;
}

const Card: React.FC<CardProps> = memo(({
  children,
  className = '',
  hover = false,
  animate = false,
}) => {
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden';
  const hoverStyles = hover ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1' : '';
  
  if (animate) {
    return (
      <motion.div
        className={`${baseStyles} ${hoverStyles} ${className}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;