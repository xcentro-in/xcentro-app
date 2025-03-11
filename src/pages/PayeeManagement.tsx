
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import AddPayeeForm from "@/components/payees/AddPayeeForm";
import PayeeList from "@/components/payees/PayeeList";
import { toast } from "sonner";

const PayeeManagement = () => {
  const [activeTab, setActiveTab] = useState("view");

  const handlePayeeAdded = () => {
    toast.success("Payee added successfully", {
      description: "The payee has been added to your account",
    });
    setActiveTab("view");
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
          <Button
            className="h-10 gap-2"
            onClick={() => setActiveTab("add")}
          >
            <Plus className="h-4 w-4" />
            Add New Payee
          </Button>
        </div>
      </div>

      <Card className="animate-scale-in">
        <CardContent className="pt-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="view">View Payees</TabsTrigger>
              <TabsTrigger value="add">Add New Payee</TabsTrigger>
            </TabsList>

            <TabsContent value="view" className="mt-4">
              <PayeeList />
            </TabsContent>

            <TabsContent value="add" className="mt-4">
              <AddPayeeForm onPayeeAdded={handlePayeeAdded} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayeeManagement;
