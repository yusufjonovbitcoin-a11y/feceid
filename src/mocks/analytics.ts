export interface BookingStats {
  date: string;
  successful: number;
  failed: number;
  pending: number;
}

export interface CityStats {
  city: string;
  successful: number;
  failed: number;
}

export interface WeeklyStats {
  week: string;
  bookings: number;
  revenue: number;
}

export const bookingStats: BookingStats[] = [
  { date: "2026-05-07", successful: 4, failed: 1, pending: 2 },
  { date: "2026-05-08", successful: 6, failed: 0, pending: 3 },
  { date: "2026-05-09", successful: 3, failed: 2, pending: 1 },
  { date: "2026-05-10", successful: 8, failed: 1, pending: 4 },
  { date: "2026-05-11", successful: 5, failed: 0, pending: 2 },
  { date: "2026-05-12", successful: 7, failed: 1, pending: 3 },
  { date: "2026-05-13", successful: 3, failed: 0, pending: 1 },
];

export const cityStats: CityStats[] = [
  { city: "Москва", successful: 28, failed: 3 },
  { city: "Санкт-Петербург", successful: 15, failed: 2 },
  { city: "Екатеринбург", successful: 8, failed: 1 },
  { city: "Казань", successful: 5, failed: 0 },
  { city: "Новосибирск", successful: 4, failed: 1 },
];

export const weeklyStats: WeeklyStats[] = [
  { week: "Неделя 1", bookings: 12, revenue: 3600 },
  { week: "Неделя 2", bookings: 18, revenue: 5400 },
  { week: "Неделя 3", bookings: 22, revenue: 6600 },
  { week: "Неделя 4", bookings: 15, revenue: 4500 },
];

export const botPerformance = {
  uptime: 720,
  totalChecks: 4500,
  avgResponseTime: 1.2,
  successRate: 94,
};