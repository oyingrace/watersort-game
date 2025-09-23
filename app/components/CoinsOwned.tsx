import React from 'react';
import { Card } from '@/components/ui/card';

interface CoinsOwnedProps {
  amount: number | string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  showText?: boolean;
}

const CoinsOwned = ({ 
  amount, 
  variant = "default",
  className = "",
  showText = true 
}: CoinsOwnedProps) => {
  const formatAmount = (value: number | string) => {
    if (typeof value === 'number') {
      return value.toFixed(0);
    }
    return value;
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Card className="font-semibold border-primary-purple text-gray-800 -ml-2 z-0 px-2 py-2">
        <div className="flex items-center gap-2">
          <img src="/images/coin.png" alt="Coin" className="h-4 w-4" />
          <span>{formatAmount(amount)}</span>
        </div>
      </Card>
    </div>
  );
};

export default CoinsOwned;
