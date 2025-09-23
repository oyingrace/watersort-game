"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface SaveCoinsProps {
  onSave: () => Promise<void>;
  className?: string;
}

const SaveCoins: React.FC<SaveCoinsProps> = ({ onSave, className = '' }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (isSaving || isSaved) return;
    
    setIsSaving(true);
    try {
      await onSave();
      setIsSaved(true);
      // Reset after 2 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to save coins:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handleSave}
      disabled={isSaving || isSaved}
      className={`h-8 px-3 text-sm font-medium rounded-lg transition-all duration-200 ${
        isSaved 
          ? 'bg-green-500 text-white' 
          : isSaving 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      } ${className}`}
      variant="outline"
    >
      <div className="flex items-center gap-2">
        {isSaving && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
          />
        )}
        {isSaved && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 bg-white rounded-full flex items-center justify-center"
          >
            <span className="text-green-500 text-xs">✓</span>
          </motion.div>
        )}
        <span>
          {isSaved ? 'Saved' : isSaving ? 'Saving coins...' : 'Save coins'}
        </span>
      </div>
    </Button>
  );
};

export default SaveCoins;
