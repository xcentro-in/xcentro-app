
import React from "react";

interface RewardsHeaderProps {
  title: string;
  description: string;
}

const RewardsHeader: React.FC<RewardsHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight animate-slide-up">{title}</h1>
      <p className="text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: "50ms" }}>
        {description}
      </p>
    </div>
  );
};

export default RewardsHeader;
