
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import AddPayeeForm from "@/components/payees/AddPayeeForm";
import PayeeList from "@/components/payees/PayeeList";
import { toast } from "sonner";

const PayeeManagement = () => {
  const [showAddPayee, setShowAddPayee] = useState(false);

  const handlePayeeAdded = () => {
    toast.success("Payee added successfully", {
      description: "The payee has been added to your account",
    });
    setShowAddPayee(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight animate-slide-up">
            Manage Payees
          </h1>
          <p
            className="text-muted-foreground mt-1 animate-slide-up"
            style={{ animationDelay: "50ms" }}
          >
            Add and manage your payment recipients in one place
          </p>
        </div>

        <div
          className="flex gap-3 animate-slide-down"
          style={{ animationDelay: "100ms" }}
        >
          {!showAddPayee ? (
            <Button
              className="h-10 gap-2"
              onClick={() => setShowAddPayee(true)}
            >
              <Plus className="h-4 w-4" />
              Add New Payee
            </Button>
          ) : (
            <Button
              variant="outline"
              className="h-10 gap-2"
              onClick={() => setShowAddPayee(false)}
            >
              Back to Payee List
            </Button>
          )}
        </div>
      </div>

      <Card className="animate-scale-in">
        <CardContent className="pt-6">
          {showAddPayee ? (
            <AddPayeeForm onPayeeAdded={handlePayeeAdded} />
          ) : (
            <PayeeList />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PayeeManagement;
