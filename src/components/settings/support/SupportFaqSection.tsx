
import { useState } from "react";
import { FAQ } from "@/types/support";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SupportFaqSectionProps {
  faqs: FAQ[];
  onFaqClick?: () => void;
}

const SupportFaqSection = ({ faqs, onFaqClick }: SupportFaqSectionProps) => {
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({});

  const toggleFaq = (id: string) => {
    if (onFaqClick) {
      onFaqClick();
    }
    
    setOpenFaqs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (faqs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No FAQs found in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {faqs.map((faq) => (
        <Collapsible
          key={faq.id}
          open={openFaqs[faq.id]}
          onOpenChange={() => toggleFaq(faq.id)}
          className="border rounded-md"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-muted/50 rounded-md">
            <div className="flex items-center gap-2">
              {openFaqs[faq.id] ? (
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              )}
              <span className="font-medium">{faq.question}</span>
            </div>
            <Badge variant="outline" className="ml-auto">
              {faq.category}
            </Badge>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-3 pt-0 pl-9 text-sm text-muted-foreground border-t">
            {faq.answer}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
};

export default SupportFaqSection;
