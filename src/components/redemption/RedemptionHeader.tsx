
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RedemptionHeaderProps {
  title: string;
  description: string;
}

const RedemptionHeader: React.FC<RedemptionHeaderProps> = ({ title, description }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          {description}
        </p>
      </div>
      <Button 
        variant="outline" 
        onClick={() => navigate("/rewards")}
        className="flex items-center gap-2"
      >
        <ArrowLeftIcon className="h-4 w-4" /> 
        Back to Rewards
      </Button>
    </div>
  );
};

export default RedemptionHeader;
