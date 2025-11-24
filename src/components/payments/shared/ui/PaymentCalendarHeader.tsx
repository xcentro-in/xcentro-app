
import React from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentCalendarHeaderProps {
  title?: string;
  description?: string;
}

const PaymentCalendarHeader: React.FC<PaymentCalendarHeaderProps> = ({
  title,
  description
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
      {(title || description) && (
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mt-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            {title && <h1 className="text-3xl font-bold tracking-tight mb-3 animate-slide-up">{title}</h1>}
            {description && (
              <p
                className="text-muted-foreground mb-4 animate-slide-up"
                style={{ animationDelay: "50ms" }}
              >
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      
      <div 
        className={`flex items-center gap-3 animate-slide-down ${!(title || description) ? 'justify-end w-full' : ''}`}
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
