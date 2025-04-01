
import React from "react";
import { List, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewTogglerProps {
  activeView: "list" | "calendar";
  onViewChange: (view: "list" | "calendar") => void;
}

const ViewToggler: React.FC<ViewTogglerProps> = ({
  activeView,
  onViewChange
}) => {
  return (
    <div className="flex border rounded-lg overflow-hidden">
      <Button 
        variant={activeView === "list" ? "default" : "ghost"}
        size="sm"
        className="rounded-none px-2"
        onClick={() => onViewChange("list")}
        title="List View"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button 
        variant={activeView === "calendar" ? "default" : "ghost"}
        size="sm"
        className="rounded-none px-2"
        onClick={() => onViewChange("calendar")}
        title="Calendar View"
      >
        <CalendarDays className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewToggler;
