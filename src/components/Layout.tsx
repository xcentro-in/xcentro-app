
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import TopNav from "./TopNav";
import { useEffect } from "react";
import { toast } from "sonner";
import { PageTitleProvider } from "@/contexts/PageTitleContext";

const Layout = () => {
  // useEffect(() => {
  //   // Simulate a welcome notification on first load
  //   const timeout = setTimeout(() => {
  //     toast("Welcome to PaySphere", {
  //       description: "Your premium business payment platform",
  //     });
  //   }, 1000);
    
  //   return () => clearTimeout(timeout);
  // }, []);

  return (
    <PageTitleProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </PageTitleProvider>
  );
};

export default Layout;
