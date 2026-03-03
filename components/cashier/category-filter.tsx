'use client';

import { Category } from '@/types';
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-coffee-800">All Items</h3>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => onSelectCategory('all')}
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          className={`rounded-full ${
            selectedCategory === 'all'
              ? 'bg-coffee-600 text-white'
              : 'border-coffee-300 text-coffee-700 hover:bg-coffee-50'
          }`}
        >
          All Items
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => onSelectCategory(String(category.id))}
            variant={selectedCategory === String(category.id) ? 'default' : 'outline'}
            className={`rounded-full ${
              selectedCategory === String(category.id)
                ? 'bg-coffee-600 text-white'
                : 'border-coffee-300 text-coffee-700 hover:bg-coffee-50'
            }`}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
}