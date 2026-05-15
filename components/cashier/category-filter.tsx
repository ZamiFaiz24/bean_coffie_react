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
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-charcoal-900">
          Categories
        </h3>

        <p className="text-xs text-charcoal-500 mt-1">
          Filter products by category
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* All Items */}
        <Button
          onClick={() => onSelectCategory('all')}
          variant="ghost"
          className={`
            rounded-full px-5 transition-colors duration-200

            ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white'
                : 'bg-white border border-charcoal-200 text-charcoal-700 hover:bg-emerald-50 hover:text-emerald-700'
            }
          `}
        >
          All Items
        </Button>

        {/* Categories */}
        {categories.map((category) => {
          const isActive = selectedCategory === String(category.id);

          return (
            <Button
              key={category.id}
              onClick={() => onSelectCategory(String(category.id))}
              variant="ghost"
              className={`
                rounded-full px-5 transition-colors duration-200

                ${
                  isActive
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white'
                    : 'bg-white border border-charcoal-200 text-charcoal-700 hover:bg-emerald-50 hover:text-emerald-700'
                }
              `}
            >
              {category.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}