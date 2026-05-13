export interface Server {
  id: string;
  name: string;
  ip_address: string;
  location: string;
  status: "active" | "inactive" | "error";
  is_russian: boolean;
  last_check: string;
}

export const servers: Server[] = [
  {
    id: "s1",
    name: "RU-Moscow-01",
    ip_address: "185.12.34.56",
    location: "Москва, ДатаПро",
    status: "active",
    is_russian: true,
    last_check: "2026-05-13 14:32:15",
  },
  {
    id: "s2",
    name: "RU-SPb-01",
    ip_address: "188.56.78.90",
    location: "Санкт-Петербург, Selectel",
    status: "active",
    is_russian: true,
    last_check: "2026-05-13 14:31:45",
  },
  {
    id: "s3",
    name: "RU-Kazan-01",
    ip_address: "91.23.45.67",
    location: "Казань, Webzilla",
    status: "error",
    is_russian: true,
    last_check: "2026-05-13 14:25:00",
  },
  {
    id: "s4",
    name: "RU-Ekb-01",
    ip_address: "212.34.56.78",
    location: "Екатеринбург, Reg.ru",
    status: "active",
    is_russian: true,
    last_check: "2026-05-13 14:32:01",
  },
];