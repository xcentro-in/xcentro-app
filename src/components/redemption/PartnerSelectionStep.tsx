
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LoyaltyPartner } from "@/types/rewards";

interface PartnerSelectionStepProps {
  partners: LoyaltyPartner[];
  onPartnerSelect: (partnerId: string) => void;
}

const getPartnerIcon = (type: string): string => {
  switch (type) {
    case 'airline':
      return 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80';
    case 'hotel':
      return 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80';
    case 'car':
      return 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80';
    case 'event':
      return 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80';
    default:
      return 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80';
  }
};

const PartnerSelectionStep: React.FC<PartnerSelectionStepProps> = ({ partners, onPartnerSelect }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-lg mb-4">Select Your Loyalty Program</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {partners.length > 0 ? (
            partners.map(partner => (
              <div 
                key={partner.id} 
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => onPartnerSelect(partner.id)}
              >
                <div className="h-44 relative overflow-hidden">
                  <img 
                    src={getPartnerIcon(partner.type)} 
                    alt={partner.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <div className="p-3 bg-white dark:bg-slate-800">
                  <div className="font-bold text-lg">{partner.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {partner.membershipDetails?.membershipNumber || "Not linked"}
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 dark:bg-slate-800/90 rounded-full p-3 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 border border-dashed rounded-md col-span-3">
              <p className="text-muted-foreground mb-2">No linked loyalty programs found</p>
              <Button onClick={() => navigate("/settings")}>
                Set Up Partners in Settings
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerSelectionStep;
