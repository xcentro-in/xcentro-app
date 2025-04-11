import { Outlet } from "react-router-dom";

const SettingsLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default SettingsLayout;