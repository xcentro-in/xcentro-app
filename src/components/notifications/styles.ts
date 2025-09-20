export const notificationStyles = {
  container: {
    base: "p-3 border rounded-lg relative transition-colors",
    read: "bg-card",
    unread: "bg-accent/20",
    hover: "hover:bg-accent/30 cursor-pointer"
  }
} as const;