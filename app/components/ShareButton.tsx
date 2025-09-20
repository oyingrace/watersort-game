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
      Share (+50 pts)
    </Button>
  );
};

export default ShareButton;


