export type UserRole = "developer" | "owner" | "admin" | "accountant" | "viewer" | "user"
export type User = {
  id: string
  role: UserRole
}

export function getUser() {
  return { id: "e", role: "user" } as User
}