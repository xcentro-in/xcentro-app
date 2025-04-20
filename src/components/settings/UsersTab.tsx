import React from "react";
import UserAccessTabs from "@/components/user-access/UserAccessTabs";
import { mockUsers, mockPendingInvites } from "@/data/mockUsers";

const UsersTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">User Management</h2>
      </div>
      <UserAccessTabs
        users={mockUsers}
        pendingInvites={mockPendingInvites}
      />
    </div>
  );
};

export default UsersTab;