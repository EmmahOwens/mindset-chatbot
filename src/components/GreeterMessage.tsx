import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const GreeterMessage = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="mx-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-border max-w-md text-center"
          >
            <div className="mb-3">
              <span className="text-3xl">🌟</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Welcome to Your Safe Space
            </h2>
            <p className="text-sm text-muted-foreground">
              Your personal mental health companion is ready to listen
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
