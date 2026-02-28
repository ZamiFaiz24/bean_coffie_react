'use client';

import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  user?: any;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  user,
  onLogout,
  isCollapsed,
  onToggle,
}: SidebarProps) {
  if (isCollapsed) {
    return (
      <div className="w-16 bg-white border-r border-coffee-200 shadow-sm flex flex-col items-center py-4 space-y-4">
        <button
          onClick={onToggle}
          className="hover:bg-coffee-100 rounded-lg p-2 transition"
        >
          <ChevronRight className="w-6 h-6 text-coffee-700" />
        </button>

        {/* Logo - Collapsed */}
        <img src="/images/logo.png" alt="Logo" className="w-10 h-10" />

        <div className="flex-1 flex flex-col space-y-2">
          <button
            onClick={() => onSelectCategory('all')}
            className={`p-2 rounded-lg transition ${
              selectedCategory === 'all'
                ? 'bg-coffee-600 text-white'
                : 'hover:bg-coffee-100 text-coffee-700'
            }`}
            title="All Categories"
          >
            📋
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(String(category.id))}
              className={`p-2 rounded-lg transition ${
                selectedCategory === String(category.id)
                  ? 'bg-coffee-600 text-white'
                  : 'hover:bg-coffee-100 text-coffee-700'
              }`}
              title={category.name}
            >
              {category.name[0]}
            </button>
          ))}
        </div>

        <button
          onClick={onLogout}
          className="hover:bg-red-100 text-red-600 rounded-lg p-2 transition"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-coffee-200 shadow-sm flex flex-col h-full p-4 space-y-4">
      <div className="flex justify-between items-center border-b border-coffee-200 pb-4">
        <div className="flex-1">
          <div className="text-center mb-3">
            {/* Logo - Full */}
            <img src="/images/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-2" />
            <h2 className="font-bold text-coffee-800">Bean Coffee</h2>
            <p className="text-xs text-coffee-600">POS System</p>
          </div>

          {user && (
            <div className="bg-coffee-100 rounded-lg p-3 text-center">
              <p className="text-sm font-semibold text-coffee-800 truncate">{user.name}</p>
              <p className="text-xs text-coffee-600">{user.role}</p>
            </div>
          )}
        </div>

        <button
          onClick={onToggle}
          className="hover:bg-coffee-100 rounded-lg p-2 transition ml-2"
        >
          <ChevronLeft className="w-5 h-5 text-coffee-700" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <p className="text-xs font-bold text-coffee-700 uppercase mb-3">Categories</p>
        
        <Button
          onClick={() => onSelectCategory('all')}
          variant={selectedCategory === 'all' ? 'default' : 'ghost'}
          className={`w-full justify-start mb-2 ${
            selectedCategory === 'all'
              ? 'bg-coffee-700 text-white hover:bg-coffee-800'
              : 'text-coffee-700 hover:bg-coffee-100'
          }`}
        >
          📋 All Categories
        </Button>

        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => onSelectCategory(String(category.id))}
              variant={selectedCategory === String(category.id) ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                selectedCategory === String(category.id)
                  ? 'bg-coffee-700 text-white hover:bg-coffee-800'
                  : 'text-coffee-700 hover:bg-coffee-100'
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="border-t border-coffee-200 pt-4">
        <Button
          onClick={onLogout}
          variant="destructive"
          className="w-full bg-red-500 hover:bg-red-600 flex items-center justify-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}