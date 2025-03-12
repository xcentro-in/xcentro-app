
import React from "react";
import { ChevronRight } from "lucide-react";
import { RedemptionCategory } from "@/types/rewards";

interface CategorySelectorProps {
  categories: RedemptionCategory[];
  onCategorySelect: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, onCategorySelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
      {categories.map(category => (
        <div 
          key={category.id}
          className="flex flex-col p-4 border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
          onClick={() => onCategorySelect(category.id)}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <category.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="font-medium">{category.title}</div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Starting from {category.pointsNeeded.toLocaleString()} points
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySelector;
