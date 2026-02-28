import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Clock, Check, FileText, PenLine, Trash2, Plus, Loader2, AlertCircle } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { businessAPI } from "@/services/api";
import { Business } from "../../types/business";

interface BusinessWithLoading extends Business {
  isLoading: boolean;
  hasError: boolean;
}

const BusinessManagement = () => {
  const navigate = useNavigate();
  const { userRoles, isAuthenticated } = useAuth();
  const [businesses, setBusinesses] = useState<BusinessWithLoading[]>([]);

  // Load business details for each user role
  useEffect(() => {
    const loadBusinessDetails = async () => {
      if (!userRoles || userRoles.length === 0) {
        setBusinesses([]);
        return;
      }

      // Initialize business list with loading states
      const initialBusinesses: BusinessWithLoading[] = userRoles.map(role => ({
        id: role.businessId,
        bid: role.businessId,
        name: 'Loading...',
        gstin: '',
        pan: '',
        businessType: '',
        userRole: role.role,
        status: 'verified' as const,
        isLoading: true,
        hasError: false,
      }));

      setBusinesses(initialBusinesses);

      // Load each business details individually
      for (let i = 0; i < userRoles.length; i++) {
        const role = userRoles[i];
        try {
          const response = await businessAPI.getBusiness();
          const businessData = response.data;

          setBusinesses(prev => prev.map(business => 
            business.id === role.businessId 
              ? {
                  ...business,
                  name: businessData.name,
                  gstin: businessData.gstin,
                  pan: businessData.pan,
                  businessType: businessData.businessType,
                  userRole: role.role, // Use role from auth context
                  isLoading: false,
                  hasError: false,
                }
              : business
          ));
        } catch (error) {
          console.error(`Failed to load business details for ${role.businessId}:`, error);
          setBusinesses(prev => prev.map(business => 
            business.id === role.businessId 
              ? {
                  ...business,
                  name: 'Failed to load',
                  isLoading: false,
                  hasError: true,
                }
              : business
          ));
        }
      }
    };

    if (isAuthenticated && userRoles) {
      loadBusinessDetails();
    }
  }, [userRoles, isAuthenticated]);


  const handleEdit = (businessId: string) => {
    toast.info("Edit functionality will be implemented soon");
  };

  const handleDelete = (businessId: string) => {
    // TODO: Implement actual business removal via API
    console.log("TODO: Implement business removal for:", businessId);
    toast.success("Business removed successfully");
  };

  const handleViewDetails = (businessId: string) => {
    toast.info("View details functionality will be implemented soon");
  };

  const handleAddBusiness = () => {
    navigate("/business-onboarding");
  };

  const handleRetryLoad = async (businessId: string) => {
    const role = userRoles?.find(r => r.businessId === businessId);
    if (!role) return;

    setBusinesses(prev => prev.map(business => 
      business.id === businessId 
        ? { ...business, isLoading: true, hasError: false }
        : business
    ));

    try {
      const response = await businessAPI.getBusiness();
      const businessData = response.data;

      setBusinesses(prev => prev.map(business => 
        business.id === businessId 
          ? {
              ...business,
              name: businessData.name,
              gstin: businessData.gstin,
              pan: businessData.pan,
              businessType: businessData.businessType,
              userRole: role.role,
              isLoading: false,
              hasError: false,
            }
          : business
      ));
    } catch (error) {
      console.error(`Failed to retry load business details for ${businessId}:`, error);
      setBusinesses(prev => prev.map(business => 
        business.id === businessId 
          ? {
              ...business,
              name: 'Failed to load',
              isLoading: false,
              hasError: true,
            }
          : business
      ));
    }
  };

  if (!isAuthenticated || !userRoles) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <Card key={business.id} className="bg-card">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    {business.isLoading ? (
                      <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    ) : business.hasError ? (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <Building className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <CardTitle className="text-lg">
                    {business.isLoading ? (
                      <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                    ) : business.hasError ? (
                      <span className="text-destructive">{business.name}</span>
                    ) : (
                      business.name
                    )}
                  </CardTitle>
                </div>
                {!business.isLoading && !business.hasError && (
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
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              {business.isLoading ? (
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              ) : business.hasError ? (
                <div className="text-sm text-destructive">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Failed to load business details</span>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  <div className="flex flex-col gap-1">
                    <div><span className="font-medium">GSTIN:</span> {business.gstin}</div>
                    <div><span className="font-medium">PAN:</span> {business.pan}</div>
                    <div><span className="font-medium">Type:</span> {business.businessType}</div>
                    <div><span className="font-medium">Your Role:</span> {business.userRole}</div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-3 border-t">
              {business.hasError ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRetryLoad(business.id)}
                  disabled={business.isLoading}
                >
                  {business.isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Retry'
                  )}
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground" 
                  onClick={() => handleViewDetails(business.id)}
                  disabled={business.isLoading}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Details
                </Button>
              )}
              {!business.hasError && (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-muted-foreground" 
                    onClick={() => handleEdit(business.id)}
                    disabled={business.isLoading}
                  >
                    <PenLine className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        disabled={business.isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently remove the business profile.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(business.id)}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      {businesses.length === 0 && isAuthenticated && userRoles && userRoles.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Building className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No businesses found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You are not associated with any business yet.
            </p>
            <Button className="mt-6" onClick={handleAddBusiness}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Business
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessManagement;
