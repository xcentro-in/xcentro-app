
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PaymentsHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight animate-slide-up">Payments</h1>
        <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
          Manage all your business transactions in one place
        </p>
      </div>
      
      <div className="flex gap-3 animate-slide-down" style={{ animationDelay: "100ms" }}>
        <Button 
          variant="outline" 
          className="h-10 gap-2"
          onClick={() => navigate('/payees')}
        >
          <Users className="h-4 w-4" />
          Manage Payees
        </Button>
        <Button 
          className="h-10 gap-2"
          onClick={() => navigate("/new-payment")}
        >
          <Plus className="h-4 w-4" />
          New Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentsHeader;
