export interface Operator {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "operator";
  status: "active" | "blocked";
  createdAt: string;
  lastLogin: string;
  actionsCount: number;
}

export const operators: Operator[] = [
  { id: "op-001", name: "Алексей Иванов", email: "superadmin@visabot.ru", role: "super_admin", status: "active", createdAt: "2026-01-10", lastLogin: "2026-05-13 09:15", actionsCount: 342 },
  { id: "op-002", name: "Мария Козлова", email: "operator@visabot.ru", role: "operator", status: "active", createdAt: "2026-02-15", lastLogin: "2026-05-12 16:30", actionsCount: 156 },
  { id: "op-003", name: "Дмитрий Соколов", email: "dmitry@visabot.ru", role: "operator", status: "active", createdAt: "2026-03-01", lastLogin: "2026-05-11 11:00", actionsCount: 89 },
  { id: "op-004", name: "Ольга Волкова", email: "olga@visabot.ru", role: "operator", status: "blocked", createdAt: "2026-03-20", lastLogin: "2026-04-28 14:20", actionsCount: 45 },
  { id: "op-005", name: "Игорь Петров", email: "igor@visabot.ru", role: "operator", status: "active", createdAt: "2026-04-05", lastLogin: "2026-05-10 08:45", actionsCount: 67 },
];

export interface AuditLog {
  id: string;
  operatorName: string;
  action: string;
  target: string;
  timestamp: string;
  ip: string;
}

export const auditLogs: AuditLog[] = [
  { id: "a-001", operatorName: "Алексей Иванов", action: "Добавил клиента", target: "Анна Петрова", timestamp: "2026-05-13 10:00", ip: "185.12.45.10" },
  { id: "a-002", operatorName: "Мария Козлова", action: "Изменил статус", target: "Очередь #5", timestamp: "2026-05-13 09:45", ip: "92.53.12.8" },
  { id: "a-003", operatorName: "Алексей Иванов", action: "Запустил бота", target: "Бот #1", timestamp: "2026-05-13 08:00", ip: "185.12.45.10" },
  { id: "a-004", operatorName: "Дмитрий Соколов", action: "Загрузил видео", target: "Видео для Иван Смирнов", timestamp: "2026-05-12 17:30", ip: "77.88.21.5" },
  { id: "a-005", operatorName: "Мария Козлова", action: "Добавил клиента", target: "Елена Соколова", timestamp: "2026-05-12 14:15", ip: "92.53.12.8" },
  { id: "a-006", operatorName: "Игорь Петров", action: "Остановил сервер", target: "Server-3", timestamp: "2026-05-11 22:00", ip: "109.120.34.2" },
  { id: "a-007", operatorName: "Алексей Иванов", action: "Заблокировал оператора", target: "Ольга Волкова", timestamp: "2026-04-29 09:00", ip: "185.12.45.10" },
];