"use client";

import React from 'react';
import ProfileImage from './ProfileImage';
import CoinsOwned from './CoinsOwned';

const TopNav = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div className="bg-white shadow-2xl rounded-[2rem] pt-4 pb-4 px-6">
        <div className="flex justify-between items-center max-w-md mx-auto">
          {/* Left side - leaderboard rank number */}
          <div className="flex-shrink-0">
            
          </div>
          
          {/* Middle - Profile Image */}
          <div className="flex-shrink-0">
            <ProfileImage/>
          </div>
          
          {/* Right side - Coins Amount */}
          <div className="flex-shrink-0">
          <CoinsOwned amount={1250} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
