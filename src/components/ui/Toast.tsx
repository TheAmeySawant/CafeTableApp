'use client';

import React, { useEffect, useState } from 'react';
import { ToastType } from './ToastProvider';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Small delay to trigger mount animation
    const timer = setTimeout(() => setIsRendered(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const getStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-white text-gray-800 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${isRendered ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}
        flex items-center gap-3 p-4 pr-10 min-w-[280px] max-w-sm rounded-xl shadow-lg border relative
        ${getStyle()}
      `}
      role="alert"
    >
      <span className="material-symbols-outlined shrink-0">
        {getIcon()}
      </span>
      <p className="font-sans font-medium text-sm leading-tight">
        {message}
      </p>
      
      <button 
        onClick={onClose}
        className="absolute top-1/2 -translate-y-1/2 right-3 text-current opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Close"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
};
