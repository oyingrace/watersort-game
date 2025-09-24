"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface MintBadgeProps {
  onMint: () => Promise<void>;
  className?: string;
  disabled?: boolean;
}

const MintBadge: React.FC<MintBadgeProps> = ({ onMint, className = '', disabled = false }) => {
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);

  const handleMint = async () => {
    if (isMinting || isMinted || disabled) return;
    
    setIsMinting(true);
    try {
      await onMint();
      setIsMinted(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setIsMinted(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to mint badge:', error);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleMint}
      disabled={disabled || isMinting || isMinted}
      className={`h-10 px-4 font-semibold rounded-xl transition-all duration-200 ${
        isMinted 
          ? 'bg-green-500 text-white hover:bg-green-600' 
          : isMinting 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-yellow-400 text-gray-800 hover:bg-yellow-400'
      } ${className}`}
      variant="outline"
    >
      <div className="flex items-center gap-2">
        {isMinting && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          />
        )}
        {isMinted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-4 h-4 bg-white rounded-full flex items-center justify-center"
          >
            <span className="text-green-500 text-sm">✓</span>
          </motion.div>
        )}
        <span>
          {isMinted ? 'Minted!' : isMinting ? 'Minting...' : 'Mint'}
        </span>
      </div>
    </Button>
  );
};

export default MintBadge;
