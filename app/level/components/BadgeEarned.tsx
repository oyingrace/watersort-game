"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge, getBadgeForLevel } from '@/lib/levelGenerator';
import MintBadge from '@/app/components/MintBadge';
import BadgeCard from '@/app/components/BadgeCard';

interface BadgeEarnedProps {
  isOpen: boolean;
  onClose: () => void;
  onMint: () => Promise<void>;
  levelNumber: number;
}


const BADGE_IMAGE_MAP: Record<Badge, string> = {
  'Novice': 'novice.png',
  'Apprentice': 'apprentice.png',
  'Adventurer': 'adventurer.png',
  'Challenger': 'challenger.png',
  'Seeker': 'seeker.png',
  'Explorer': 'explorer.png',
  'Warrior': 'warrior.png',
  'Champion': 'champion.png',
  'Hero': 'hero.png',
  'Guardian': 'guardian.png',
};

const BadgeEarned: React.FC<BadgeEarnedProps> = ({ isOpen, onClose, onMint, levelNumber }) => {
  const badge = getBadgeForLevel(levelNumber);
  
  if (!badge) return null;

  const badgeImage = BADGE_IMAGE_MAP[badge];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Badge content */}
            <div className="text-center">
              {/* Badge image */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mb-6"
              >
                <div className="flex justify-center">
                  <BadgeCard src={`/badges/${badgeImage}`} alt={`${badge} Badge`} size="lg" />
                </div>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 mb-8"
              >
                Congrats! You've unlocked the {badge} badge.
              </motion.p>

              {/* Action buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3 justify-center"
              >
                <MintBadge onMint={onMint} />
                <Button
                  type="button"
                  onClick={onClose}
                  variant="outline"
                  className="px-6 py-2 border-yellow-400 text-gray-700 hover:bg-gray-50"
                >
                  Later
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BadgeEarned;
