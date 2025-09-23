"use client";

import React, { useState } from 'react';
import { Play, ListTodo, Trophy } from 'lucide-react';

const BottomNav = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { id: 0, icon: ListTodo },
    { id: 1, icon: Play },
    { id: 2, icon: Trophy }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full overflow-x-hidden pb-4">
      <div className="mx-4 bg-white shadow-2xl rounded-[2rem] pt-4 pb-4 px-4">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(index)}
                className={`flex items-center justify-center p-3 rounded-2xl transition-all duration-300 ease-in-out ${
                  activeIndex === index
                    ? ' '
                    : 'text-gray-800'
                }`}
              >
                <IconComponent 
                  size={24} 
                  className={`transition-colors duration-300 ${
                    activeIndex === index
                      ? 'fill-gray-800'
                      : ' '
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Safe area for devices with bottom indicators */}
      <div className="bg-primary-purple h-safe-bottom"></div>
    </div>
  );
};

export default BottomNav;