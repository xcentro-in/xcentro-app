
import { Outlet } from "react-router-dom";

const SettingsLayout = () => {
  return (
    <div className="min-h-screen bg-background w-full">
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default SettingsLayout;
