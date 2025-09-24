import React from 'react';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';

interface ProfileImageProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ProfileImage = ({ 
  src, 
  alt = "Profile", 
  size = 'md',
  className = ""
}: ProfileImageProps) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14', 
    lg: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 32
  };

  return (
    <Card className={`${sizeClasses[size]} bg-purple-300 rounded-lg border-0 shadow-sm flex items-center justify-center p-0 ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <User size={iconSizes[size]} className="text-yellow-700" />
      )}
    </Card>
  );
};

export default ProfileImage;
