
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(onComplete, 500); // Give exit animation time to complete
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-aod-purple-900 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: isAnimating ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          type: "spring", 
          stiffness: 100 
        }}
        className="mb-8"
      >
        <img 
          src="/lovable-uploads/ae1ff7ee-d261-49b5-b929-b41a26ce09ec.png" 
          alt="All On Desk Logo" 
          className="w-32 h-32 md:w-40 md:h-40"
        />
      </motion.div>
      
      <motion.h1 
        className="text-3xl md:text-4xl font-bold text-white mb-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        All On Desk
      </motion.h1>
      
      <motion.p
        className="text-aod-purple-200 text-lg text-center max-w-md px-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Government Budget Transparency Platform
      </motion.p>
      
      <motion.div 
        className="mt-8 relative w-48 h-1 bg-aod-purple-300 rounded-full overflow-hidden"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "12rem", opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <motion.div 
          className="absolute top-0 left-0 h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ delay: 1, duration: 1.2 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
