
import React from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentCalendarHeaderProps {
  title: string;
  description?: string;
}

const PaymentCalendarHeader: React.FC<PaymentCalendarHeaderProps> = ({ 
  title, 
  description 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-3 animate-slide-up">{title}</h1>
        {description && (
          <p 
            className="text-muted-foreground mb-4 animate-slide-up" 
            style={{ animationDelay: "50ms" }}
          >
            {description}
          </p>
        )}
      </div>
      
      <div 
        className="flex items-center gap-3 animate-slide-down" 
        style={{ animationDelay: "100ms" }}
      >
        <Button 
          className="h-10 gap-2"
          onClick={() => navigate("/new-payment")}
        >
          <CalendarDays className="h-4 w-4" />
          Schedule Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentCalendarHeader;
