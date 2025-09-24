"use client";

import React, { useState } from 'react';
import ProfileImage from './ProfileImage';
import CoinsOwned from './CoinsOwned';
import UserView from './UserView';
import data from '@/app/leaderboard/components/WeeklyRankers.json';

const TopNav = () => {
  const [isUserViewOpen, setIsUserViewOpen] = useState(false);
  const currentUser = data[0];

  const handleProfileClick = () => {
    setIsUserViewOpen(!isUserViewOpen);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <div className="bg-white shadow-2xl rounded-[2rem] pt-2 pb-2 px-6">
          <div className="flex justify-between items-center max-w-md mx-auto">
            {/* Left side - user leaderboard rank number */}
            <div className="flex-shrink-0">
            {currentUser?.rank != null && (
              <div className="font-semibold border border-primary-purple rounded-xl text-gray-800 px-3 py-1 text-sm">
                #{currentUser.rank}
              </div>
            )}
            </div>
            
            {/* Middle - Profile Image */}
            <div className="flex-shrink-0">
              <button 
                onClick={handleProfileClick}
                className="transition-transform duration-200 hover:scale-105 active:scale-95"
                aria-label="Open user profile"
              >
                <span className="relative inline-block">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-1 rounded-2xl bg-primary-purple/60 ring-2 ring-primary-purple/40 motion-safe:animate-[ping_2s_ease-out_infinite]"
                  ></span>
                  <ProfileImage className="relative z-10"/>
                </span>
              </button>
            </div>
            
            {/* Right side - Coins Amount */}
            <div className="flex-shrink-0">
            <CoinsOwned amount={1250} />
            </div>
          </div>
        </div>
      </div>

      {/* UserView overlay */}
      {isUserViewOpen && <UserView onClose={() => setIsUserViewOpen(false)} />}
    </>
  );
};

export default TopNav;
