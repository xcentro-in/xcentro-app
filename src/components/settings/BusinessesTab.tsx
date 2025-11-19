
import React from "react";
import { Button } from "@/components/ui/button";
import { Building, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BusinessManagement from "@/components/settings/BusinessManagement";

const BusinessesTab = () => {
  const navigate = useNavigate();

  const handleAddBusiness = () => {
    navigate("/business-onboarding");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Business Management</h2>
          <p className="text-muted-foreground mt-1">Manage your business profiles</p>
        </div>
        {/* <Button 
          className="flex items-center gap-2" 
          onClick={handleAddBusiness}
        >
          <Plus className="h-4 w-4" />
          Add New Business
        </Button> */}
      </div>
      <BusinessManagement />
    </div>
  );
};

export default BusinessesTab;
