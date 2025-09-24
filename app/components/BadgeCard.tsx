"use client";
import React from 'react';
import { Card } from '@/components/ui/card';

interface BadgeCardProps {
  src: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BadgeCard = ({
  src,
  alt = 'Badge',
  size = 'md',
  className = ''
}: BadgeCardProps) => {
  const sizeClasses: Record<NonNullable<BadgeCardProps['size']>, string> = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36'
  };

  return (
    <Card
      className={`bg-transparent border border-primary-purple rounded-2xl p-3 flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      <img src={src} alt={alt} loading="lazy" className="max-w-full max-h-full object-contain" />
    </Card>
  );
};

export default BadgeCard;


