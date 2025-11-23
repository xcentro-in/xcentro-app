
import { BanknoteIcon, LightbulbIcon, UsersIcon } from "lucide-react";
import { PayeeType } from "@/types/payee";

export const getPayeeIcon = (type: PayeeType) => {
  switch (type) {
    case "vendor":
      return <BanknoteIcon className="h-4 w-4 text-blue-500" />;
    case "biller":
      return <LightbulbIcon className="h-4 w-4 text-yellow-500" />;
    case "employee":
      return <UsersIcon className="h-4 w-4 text-green-500" />;
  }
};

export const getPayeeTypeLabel = (type: PayeeType): string => {
  switch (type) {
    case "vendor":
      return "Vendor";
    case "biller":
      return "Biller";
    case "employee":
      return "Employee";
    default:
      return "Unknown";
  }
};
