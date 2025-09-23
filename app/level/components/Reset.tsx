"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface ResetProps {
  onClick: () => void;
  className?: string;
}

const Reset: React.FC<ResetProps> = ({ onClick, className = '' }) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={`h-10 w-10 p-0 font-bold rounded-xl bg-yellow-400 text-gray-800 ${className}`}
      variant="outline"
    >
      <RotateCcw size={18} />
    </Button>
  );
};

export default Reset;

