"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { TestTube } from 'lucide-react';

interface HintProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  remaining?: number;
}

const Hint: React.FC<HintProps> = ({ onClick, disabled, className = '', remaining }) => {
  return (
    <div className={`relative ${className}`}>
      <Button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="h-10 w-10 p-0 font-bold rounded-xl bg-yellow-400 text-gray-800 disabled:opacity-50"
        variant="outline"
      >
        <TestTube size={18} />
      </Button>
      {typeof remaining === 'number' && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] leading-none rounded-full h-4 w-4 flex items-center justify-center">
          {remaining}
        </span>
      )}
    </div>
  );
};

export default Hint;


