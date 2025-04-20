
import React, { useState } from "react";
import UserAccessTabs from "@/components/user-access/UserAccessTabs";
import { mockUsers, mockPendingInvites } from "@/data/mockUsers";
import { mockBusinesses } from "@/data/mockBusinesses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building } from "lucide-react";

const UsersTab = () => {
  const [selectedBusiness, setSelectedBusiness] = useState(mockBusinesses[0]?.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <UserAccessTabs
            users={mockUsers}
            pendingInvites={mockPendingInvites}
          />
        </div>
        <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
          <SelectTrigger className="w-[240px] ml-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <SelectValue placeholder="Select business" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {mockBusinesses.map((business) => (
              <SelectItem key={business.id} value={business.id}>
                <div className="flex items-center gap-2">
                  <span>{business.name}</span>
                  {business.status === "verified" && (
                    <span className="text-xs text-green-600">✓</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UsersTab;
