
import { User, UserInvite } from "@/types/user";

export const mockUsers: User[] = [
  {
    id: "user-001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    role: "owner",
    department: "Executive",
    status: "active",
    lastActive: "2023-09-15T14:30:00",
    dateAdded: "2023-01-10T10:00:00"
  },
  {
    id: "user-002",
    name: "Priya Singh",
    email: "priya@example.com",
    role: "admin",
    department: "Operations",
    status: "active",
    lastActive: "2023-09-14T16:45:00",
    dateAdded: "2023-02-15T11:30:00"
  },
  {
    id: "user-003",
    name: "Vikram Patel",
    email: "vikram@example.com",
    role: "finance_manager",
    department: "Finance",
    status: "active",
    lastActive: "2023-09-15T09:20:00",
    dateAdded: "2023-03-05T09:15:00"
  },
  {
    id: "user-004",
    name: "Deepa Gupta",
    email: "deepa@example.com",
    role: "accountant",
    department: "Finance",
    status: "active",
    lastActive: "2023-09-13T17:10:00",
    dateAdded: "2023-03-20T14:00:00"
  },
  {
    id: "user-005",
    name: "Arjun Reddy",
    email: "arjun@example.com",
    role: "basic_user",
    department: "Marketing",
    status: "active",
    lastActive: "2023-09-11T11:25:00",
    dateAdded: "2023-04-10T10:30:00"
  },
  {
    id: "user-006",
    name: "Neha Kapoor",
    email: "neha@example.com",
    role: "basic_user",
    department: "Sales",
    status: "active",
    lastActive: "2023-09-14T15:40:00",
    dateAdded: "2023-05-05T16:20:00"
  }
];

export const mockPendingInvites: UserInvite[] = [
  {
    id: "invite-001",
    email: "rajesh@example.com",
    role: "accountant",
    department: "Finance",
    invitedBy: "Rahul Sharma",
    invitedAt: "2023-09-12T11:30:00",
    expiresAt: "2023-09-19T11:30:00"
  },
  {
    id: "invite-002",
    email: "ananya@example.com",
    role: "basic_user",
    department: "Customer Support",
    invitedBy: "Priya Singh",
    invitedAt: "2023-09-14T09:45:00",
    expiresAt: "2023-09-21T09:45:00"
  }
];
