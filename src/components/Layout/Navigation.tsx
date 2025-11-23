import React from 'react';
import type { ActiveView } from '../types';

interface NavigationProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  const navItems: { id: ActiveView; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'bugs', label: 'All Bugs' },
    { id: 'projects', label: 'Projects' },
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeView === item.id
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
