
import { Outlet, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const SettingsLayout = () => {
  const navigate = useNavigate();
  
  const handleBackToWork = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <header className="h-16 border-b border-border px-6 flex items-center sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
        <Button 
          variant="ghost" 
          className="gap-2 text-sm font-medium"
          onClick={handleBackToWork}
        >
          <ArrowLeft className="h-4 w-4" /> 
          Back to work
        </Button>
      </header>
      
      {/* Main content area */}
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SettingsLayout;
