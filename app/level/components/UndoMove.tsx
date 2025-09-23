"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Undo2 } from 'lucide-react';

interface UndoMoveProps {
  onClick: () => void;
  className?: string;
}

const UndoMove: React.FC<UndoMoveProps> = ({ onClick, className = '' }) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={`h-10 w-10 p-0 font-bold rounded-xl bg-yellow-400 text-gray-800 ${className}`}
      variant="outline"
    >
      <Undo2 size={18} />
    </Button>
  );
};

export default UndoMove;

