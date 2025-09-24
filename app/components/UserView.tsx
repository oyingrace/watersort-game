"use client";

import React, { useState } from 'react';
import ProfileImage from './ProfileImage';
import CoinsOwned from './CoinsOwned';
import { Card } from '@/components/ui/card';
import BadgeCard from './BadgeCard';
import BadgeEarned from '@/app/level/components/BadgeEarned';

interface UserViewProps {
  children?: React.ReactNode;
  className?: string;
  onClose?: () => void;
  displayName?: string;
  username?: string;
  profileSrc?: string;
  coins?: number;
  rank?: number;
}

const UserView: React.FC<UserViewProps> = ({ children, className = "", onClose, displayName = "User", username = "@user", profileSrc, coins = 1250, rank = 1 }) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (onClose) onClose();
  };

  const [isBadgeOpen, setIsBadgeOpen] = useState(false);
  const [selectedBadgeLevel, setSelectedBadgeLevel] = useState<number | null>(null);

  const levelByBadgeName: Record<string, number> = {
    novice: 1,
    apprentice: 11,
    adventurer: 21,
    challenger: 31,
    seeker: 41,
    explorer: 51,
    warrior: 61,
    champion: 71,
    hero: 81,
    guardian: 91,
  };

  const openBadge = (name: string) => {
    const level = levelByBadgeName[name];
    if (level) {
      setSelectedBadgeLevel(level);
      setIsBadgeOpen(true);
    }
  };

  const badgeNames = [
    'novice',
    'apprentice',
    'adventurer',
    'challenger',
    'seeker',
    'explorer',
    'warrior',
    'champion',
    'hero',
    'guardian'
  ];

  return (
    <div 
      className={`fixed inset-0 z-[9999] ${className}`}
    >
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-gray-800 bg-opacity-20" onClick={handleBackdropClick}></div>
      
      {/* Modal content */}
      <div className="absolute bottom-0 left-0 right-0 h-3/4" onClick={(e) => e.stopPropagation()}>
      {/* Main scrollable container */}
      <div className="h-full bg-white rounded-t-3xl shadow-2xl overflow-hidden">
        {/* Rounded top edge with subtle gradient */}
        <div className="h-2 bg-gradient-to-b from-gray-100 to-transparent"></div>
        
        {/* Scrollable content area */}
        <div className="h-full overflow-y-auto scrollbar-hide px-4 pb-4">
          <div className="w-full flex justify-center pt-4 pb-2">
            <ProfileImage size="lg" src={profileSrc} />
          </div>
          <div className="w-full text-center mb-4">
            <p className="text-lg font-semibold text-gray-900">{displayName}</p>
            <p className="text-sm text-gray-500">{username}</p>
          </div>
          <div className="w-full flex justify-center items-center gap-3 mb-4">
            <Card className="font-semibold border-primary-purple text-gray-800 px-2 py-2 text-sm">
              #{rank}
            </Card>
            <CoinsOwned amount={coins} />
          </div>
          {/* Badges section */}
          <div className="w-full mb-4">
            <h1 className="text-gray-800 mb-2">Badges</h1>
            <div className="grid grid-cols-3 gap-3">
              {badgeNames.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => openBadge(name)}
                  className="focus:outline-none"
                >
                  <BadgeCard src={`/badges/${name}.png`} alt={`${name} badge`} size="md" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
      {isBadgeOpen && selectedBadgeLevel !== null && (
        <BadgeEarned
          isOpen={isBadgeOpen}
          levelNumber={selectedBadgeLevel}
          onClose={() => setIsBadgeOpen(false)}
          onMint={async () => {}}
        />
      )}
    </div>
  );
};

export default UserView;
