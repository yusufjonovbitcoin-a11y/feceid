export interface User {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "operator";
}

export const users: User[] = [
  { id: "1", email: "superadmin@visabot.ru", name: "Алексей Иванов", role: "super_admin" },
  { id: "2", email: "operator@visabot.ru", name: "Мария Козлова", role: "operator" },
];

const rolePermissions: Record<string, string[]> = {
  super_admin: [
    "dashboard", "analytics", "clients", "queue", "slots", "calendar",
    "servers", "videos", "logs", "operators", "settings",
  ],
  operator: [
    "dashboard", "clients", "queue", "slots", "calendar",
    "videos", "logs",
  ],
};

export function canAccess(role: string, pageId: string): boolean {
  return rolePermissions[role]?.includes(pageId) ?? false;
}

export function authenticate(email: string, password: string): User | null {
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  if (email === "superadmin@visabot.ru" && password === "admin123") return user;
  if (email === "operator@visabot.ru" && password === "operator123") return user;
  return null;
}