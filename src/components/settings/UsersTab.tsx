
import React from "react";
import UserAccessTabs from "@/components/user-access/UserAccessTabs";
import { mockUsers, mockPendingInvites } from "@/data/mockUsers";

const UsersTab = () => {
  return (
    <div className="space-y-6">
      <UserAccessTabs
        users={mockUsers}
        pendingInvites={mockPendingInvites}
      />
    </div>
  );
};

export default UsersTab;
