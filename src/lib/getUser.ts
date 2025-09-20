export type UserRole = "developer" | "owner" | "user"
export type User = {
  id: string
  role: UserRole
}

export function getUser() {
  return { id: "e", role: "user" } as User
}