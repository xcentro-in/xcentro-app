
import React from "react";

interface SettingsHeaderProps {
  title: string;
  description: string;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight animate-slide-up">{title}</h1>
      <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
        {description}
      </p>
    </div>
  );
};

export default SettingsHeader;
