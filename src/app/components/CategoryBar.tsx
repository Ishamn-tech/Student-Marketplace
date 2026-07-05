import { categories } from '../data/products';

interface CategoryBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryBar({ selectedCategory, onCategoryChange }: CategoryBarProps) {
  return (
    <div className="bg-white border-b sticky top-[112px] z-30">
      <div className="max-w-[1500px] mx-auto px-4 py-3">
        <div className="flex items-center gap-4 overflow-x-auto">
          <span className="text-sm font-medium text-gray-600 flex-shrink-0">Filter by:</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full flex-shrink-0 transition-colors ${
                selectedCategory === category
                  ? 'bg-[#232F3E] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
