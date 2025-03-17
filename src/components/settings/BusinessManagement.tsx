
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBusinesses } from "@/data/mockBusinesses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Clock, Check, FileText, PenLine, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

const BusinessManagement = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState(mockBusinesses);

  const handleEdit = (businessId: string) => {
    toast.info("Edit functionality will be implemented soon");
  };

  const handleDelete = (businessId: string) => {
    setBusinesses(businesses.filter(b => b.id !== businessId));
    toast.success("Business removed successfully");
  };

  const handleViewDetails = (businessId: string) => {
    toast.info("View details functionality will be implemented soon");
  };

  const handleAddBusiness = () => {
    navigate("/business-onboarding");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <Card key={business.id} className="bg-card">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <Building className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{business.name}</CardTitle>
                </div>
                <Badge variant={business.status === "verified" ? "success" : "outline"} className="ml-auto">
                  {business.status === "verified" ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Pending
                    </span>
                  )}
                </Badge>
              </div>
              <CardDescription>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div className="flex flex-col gap-1 mt-2">
                    <div><span className="font-medium">Type:</span> {business.type}</div>
                    <div><span className="font-medium">Model:</span> {business.model}</div>
                    <div><span className="font-medium">PAN:</span> {business.pan}</div>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between pt-3 border-t">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground" 
                onClick={() => handleViewDetails(business.id)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Details
              </Button>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground" 
                  onClick={() => handleEdit(business.id)}
                >
                  <PenLine className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10" 
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Business</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {business.name}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() => handleDelete(business.id)}
                      >
                        Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardFooter>
          </Card>
        ))}

        <Card className="bg-muted/40 border-dashed flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-muted/60 transition-colors" onClick={handleAddBusiness}>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-1">Add New Business</h3>
          <p className="text-sm text-muted-foreground text-center">Create and register a new business profile</p>
        </Card>
      </div>
    </div>
  );
};

export default BusinessManagement;
