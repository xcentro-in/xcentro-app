
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import TopNav from "./TopNav";
import { useEffect } from "react";
import { toast } from "sonner";

const Layout = () => {
  useEffect(() => {
    // Simulate a welcome notification on first load
    const timeout = setTimeout(() => {
      toast("Welcome to PayStrive", {
        description: "Your premium business payment platform",
      });
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto p-6 transition-all duration-300 ease-in-out">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
