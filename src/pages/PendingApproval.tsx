import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const PendingApproval = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 pb-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Icon */}
            <div className="rounded-full bg-amber-100 p-4">
              <Clock className="h-12 w-12 text-amber-600" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Pending Approval</h1>
              <p className="text-muted-foreground">
                Your access request is currently under review
              </p>
            </div>

            {/* Message */}
            <div className="space-y-3 w-full">
              <p className="text-sm text-muted-foreground">
                Your account has been successfully created and your KYC verification is complete.
                However, your access to the business is pending approval from the business owner.
              </p>
              <div className="rounded-lg border bg-muted/50 p-3">
                <p className="text-sm font-medium">
                  Approval may take up to 2 business days
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                You will receive an email notification once your access has been approved.
                Please check back later or contact your business administrator for more information.
              </p>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full mt-4"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;
