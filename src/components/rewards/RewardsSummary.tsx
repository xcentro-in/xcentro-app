import React, { useState, useEffect } from "react";
import { TrendingUp, Award, Gift, Share, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
interface RewardsSummaryProps {
  availablePoints: number;
  onRedeemClick: () => void;
}
const RewardsSummary: React.FC<RewardsSummaryProps> = ({
  availablePoints,
  onRedeemClick
}) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setProgress(78), 500);
    return () => clearTimeout(timer);
  }, []);
  return;
};
export default RewardsSummary;