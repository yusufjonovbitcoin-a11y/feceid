export interface LogEntry {
  id: string;
  type: "info" | "success" | "error" | "warning";
  message: string;
  client_id: string | null;
  created_at: string;
}

export const logs: LogEntry[] = [
  {
    id: "l1",
    type: "success",
    message: "Клиент Максим Козлов успешно записан на 20.05.2026 в Казань",
    client_id: "c4",
    created_at: "2026-05-13 14:30:22",
  },
  {
    id: "l2",
    type: "success",
    message: "Найден свободный слот в Москве на 18.05.2026",
    client_id: null,
    created_at: "2026-05-13 14:28:10",
  },
  {
    id: "l3",
    type: "error",
    message: "Ошибка подключения к серверу RU-Kazan-01, переключение на резервный",
    client_id: null,
    created_at: "2026-05-13 14:25:00",
  },
  {
    id: "l4",
    type: "info",
    message: "Начата проверка слотов для клиента Анна Петрова",
    client_id: "c1",
    created_at: "2026-05-13 14:20:00",
  },
  {
    id: "l5",
    type: "warning",
    message: "Медленный ответ от визового центра, увеличение таймаута",
    client_id: null,
    created_at: "2026-05-13 14:15:33",
  },
  {
    id: "l6",
    type: "success",
    message: "Игорь Попов успешно записан на 22.05.2026 в Самару",
    client_id: "c8",
    created_at: "2026-05-13 14:10:05",
  },
  {
    id: "l7",
    type: "error",
    message: "Не удалось записать клиента Александр Морозов — слот занят",
    client_id: "c6",
    created_at: "2026-05-13 14:05:18",
  },
  {
    id: "l8",
    type: "info",
    message: "Добавлен новый клиент Ольга Новикова в очередь",
    client_id: "c5",
    created_at: "2026-05-13 14:00:00",
  },
  {
    id: "l9",
    type: "info",
    message: "Загружено видео верификации для клиента Дмитрий Соколов",
    client_id: "c2",
    created_at: "2026-05-13 13:55:42",
  },
  {
    id: "l10",
    type: "success",
    message: "Сервер RU-SPb-01 прошел проверку, работает стабильно",
    client_id: null,
    created_at: "2026-05-13 13:50:00",
  },
];