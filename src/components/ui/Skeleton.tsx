'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height, 
  circle = false 
}) => {
  const style = {
    width: width || '100%',
    height: height,
    borderRadius: circle ? '50%' : undefined,
  };

  return (
    <div 
      className={`animate-pulse bg-[#f1efe9] rounded ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};
