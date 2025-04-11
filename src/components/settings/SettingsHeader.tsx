
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SettingsHeaderProps {
  title: string;
  description: string;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ title, description }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">{title}</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          {description}
        </p>
      </div>
      <Button 
        variant="ghost" 
        className="gap-2 text-sm font-medium"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-4 w-4" /> 
        Back to work
      </Button>
    </div>
  );
};

export default SettingsHeader;
