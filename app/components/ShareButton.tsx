"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ShareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ className = '', ...props }) => {
  return (
    <Button
      type="button"
      className={cn('bg-primary-purple text-white', className)}
      {...props}
    >
      <span className="flex items-center gap-2">
        <span>Share</span>
        <span className="flex items-center gap-1">
          <img src="/images/coin.png" alt="Coin" className="h-4 w-4" />
          <span>+10</span>
        </span>
      </span>
    </Button>
  );
};

export default ShareButton;


