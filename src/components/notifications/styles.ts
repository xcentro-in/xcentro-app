export const notificationStyles = {
  container: {
    base: "p-3 border rounded-lg relative transition-all duration-200",
    read: "bg-card border-border/50 opacity-80",
    unread: "bg-card border-primary/30 shadow-sm",
    hover: "hover:shadow-md hover:border-primary/50 cursor-pointer"
  }
} as const;