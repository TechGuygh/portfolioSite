
import React from 'react';
import { cn } from '../lib/utils';

export const Card = ({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div 
    onClick={onClick} 
    className={cn("bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden", className, onClick && "cursor-pointer")}
  >
    {children}
  </div>
);
