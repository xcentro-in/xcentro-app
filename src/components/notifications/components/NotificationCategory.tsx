import { cn } from "@/lib/utils";

type Category = "announcements" | "rewards" | "payments" | "payees" | "approvals" | "security" | "insights";

interface NotificationCategoryProps {
  category: Category;
}

const categoryStyles = {
  announcements: "bg-blue-100 text-blue-800",
  rewards: "bg-amber-100 text-amber-800",
  payments: "bg-green-100 text-green-800",
  payees: "bg-purple-100 text-purple-800",
  approvals: "bg-indigo-100 text-indigo-800",
  security: "bg-red-100 text-red-800",
  insights: "bg-cyan-100 text-cyan-800"
} as const;

export const NotificationCategory = ({ category }: NotificationCategoryProps) => (
  <span className={cn(
    "inline-block px-2 py-0.5 text-xs rounded-full capitalize",
    categoryStyles[category]
  )}>
    {category}
  </span>
);