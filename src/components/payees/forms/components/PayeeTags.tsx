
import { Tag, Info } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TooltipProvider, 
  Tooltip, 
  TooltipTrigger, 
  TooltipContent 
} from "@/components/ui/tooltip";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";

// Tag descriptions for tooltips
const tagDescriptions: Record<string, string> = {
  "Vendor": "A company or individual that provides goods to your business",
  "Supplier": "A business that provides raw materials or components to your company",
  "Contractor": "An independent worker hired for specific projects or tasks",
  "Service Provider": "A company that offers services rather than physical products",
  "Consultant": "Professional who provides expert advice in a particular area"
};

interface PayeeTagsProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

const PayeeTags = ({ selectedTags, setSelectedTags }: PayeeTagsProps) => {
  const availableTags = ["Vendor", "Supplier", "Contractor", "Service Provider", "Consultant"];
  const [activeTagInfo, setActiveTagInfo] = useState<string | null>(null);
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const toggleTagInfo = (tag: string) => {
    setActiveTagInfo(activeTagInfo === tag ? null : tag);
  };

  return (
    <Card className="border-2 border-purple-100 bg-purple-50/30">
      <CardContent className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-purple-600" />
          <Label className="text-lg font-medium text-purple-800">Categorize Your Payee</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-purple-500 hover:text-purple-700 hover:bg-purple-100">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Select appropriate tags to categorize this payee for better reporting and insights</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-2">
          {availableTags.map(tag => (
            <div key={tag} className="flex items-center">
              <Badge 
                variant={selectedTags.includes(tag) ? "default" : "outline"} 
                className={`cursor-pointer text-sm py-1.5 px-3 transition-all ${
                  selectedTags.includes(tag) 
                    ? "bg-purple-600 hover:bg-purple-700" 
                    : "hover:border-purple-400 hover:text-purple-700"
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                    <Info className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-xs bg-slate-50 border-slate-200">
                  <div className="text-sm">
                    <p className="font-medium text-slate-800 mb-1">{tag}</p>
                    <p className="text-slate-600">{tagDescriptions[tag]}</p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PayeeTags;
