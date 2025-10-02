import React from 'react';
import GiftIcon from './icons/GiftIcon';

interface HeaderProps {
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome }) => {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <button onClick={onGoHome} className="flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-red-400 rounded-lg p-2">
            <GiftIcon className="h-6 w-6 text-red-500 mr-3 transition-transform group-hover:rotate-12" />
            <h1 className="text-xl font-bold text-slate-800 tracking-wider">
            Secret Santa Organizer
            </h1>
        </button>
      </div>
    </header>
  );
};

export default Header;