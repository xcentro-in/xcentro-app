
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
    <div className="flex items-center gap-2">
      <Button 
        variant={activeView === "list" ? "secondary" : "ghost"}
        size="icon"
        className={`h-9 w-9 ${activeView === "list" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}`}
        onClick={() => onViewChange("list")}
        title="List View"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button 
        variant={activeView === "calendar" ? "secondary" : "ghost"}
        size="icon"
        className={`h-9 w-9 ${activeView === "calendar" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}`}
        onClick={() => onViewChange("calendar")}
        title="Calendar View"
      >
        <CalendarDays className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ViewToggler;
