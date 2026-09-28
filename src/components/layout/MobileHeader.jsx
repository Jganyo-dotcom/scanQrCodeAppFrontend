import React from 'react';
import { Menu, UserCircle } from 'lucide-react';

export default function MobileHeader({ setIsOpen }) {
  return (
    <header className="flex h-16 items-center justify-between bg-white px-4 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
      >
        <Menu size={24} />
      </button>
      
      <span className="text-lg font-bold text-slate-900 dark:text-white">DevJay QR</span>
      
      <button className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
        <UserCircle size={24} />
      </button>
    </header>
  );
}