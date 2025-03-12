
import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RedemptionCategory } from "@/types/rewards";

interface CategoryItemsProps {
  category: RedemptionCategory;
  onBackClick: () => void;
  onRedeemItem: (itemId: string, categoryId: string) => void;
  availablePoints: number;
}

const CategoryItems: React.FC<CategoryItemsProps> = ({ 
  category, 
  onBackClick, 
  onRedeemItem,
  availablePoints
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="px-2" 
          onClick={onBackClick}
        >
          <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
          Back to Categories
        </Button>
      </div>
      
      <h3 className="text-lg font-medium">{category.title}</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {category.items.map(item => (
          <Card key={item.id} className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center pt-0">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {item.pointsCost.toLocaleString()} points
              </Badge>
              <Button 
                size="sm" 
                onClick={() => onRedeemItem(item.id, category.id)}
                disabled={item.pointsCost > availablePoints}
              >
                Redeem Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryItems;
