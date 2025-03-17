
import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyPartnerStateProps {
  onAddNew: () => void;
}

const EmptyPartnerState: React.FC<EmptyPartnerStateProps> = ({ onAddNew }) => {
  return (
    <div className="text-center p-6 border border-dashed rounded-md">
      <p className="text-muted-foreground">No loyalty partners connected yet</p>
      <Button onClick={onAddNew} className="mt-4">Add Your First Partner</Button>
    </div>
  );
};

export default EmptyPartnerState;
