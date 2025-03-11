
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SinglePaymentForm from "./SinglePaymentForm";
import BatchPaymentForm from "./BatchPaymentForm";

interface NewPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewPaymentDialog = ({ open, onOpenChange }: NewPaymentDialogProps) => {
  const [activeTab, setActiveTab] = useState("single");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Payment</DialogTitle>
          <DialogDescription>
            Create a new payment transaction
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Payment</TabsTrigger>
            <TabsTrigger value="batch">Batch Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-4">
            <SinglePaymentForm />
          </TabsContent>

          <TabsContent value="batch" className="mt-4">
            <BatchPaymentForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NewPaymentDialog;
