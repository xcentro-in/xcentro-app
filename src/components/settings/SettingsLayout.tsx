
import { Outlet } from "react-router-dom";
import { PageTitleProvider } from "@/contexts/PageTitleContext";

const SettingsLayout = () => {
  return (
    <PageTitleProvider>
      <div className="min-h-screen bg-background w-full">
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    </PageTitleProvider>
  );
};

export default SettingsLayout;
