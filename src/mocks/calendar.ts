export interface CalendarBooking {
  id: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  city: string;
  visaType: string;
  status: "confirmed" | "pending" | "cancelled";
}

export const calendarBookings: CalendarBooking[] = [
  { id: "cal-001", clientId: "cl-001", clientName: "Анна Петрова", date: "2026-05-15", time: "10:30", city: "Москва", visaType: "Краткосрочная", status: "confirmed" },
  { id: "cal-002", clientId: "cl-002", clientName: "Иван Смирнов", date: "2026-05-15", time: "14:00", city: "Санкт-Петербург", visaType: "Краткосрочная", status: "confirmed" },
  { id: "cal-003", clientId: "cl-003", clientName: "Мария Козлова", date: "2026-05-16", time: "11:00", city: "Москва", visaType: "Долгосрочная", status: "pending" },
  { id: "cal-004", clientId: "cl-004", clientName: "Алексей Новиков", date: "2026-05-17", time: "09:00", city: "Екатеринбург", visaType: "Краткосрочная", status: "confirmed" },
  { id: "cal-005", clientId: "cl-005", clientName: "Ольга Морозова", date: "2026-05-18", time: "12:30", city: "Москва", visaType: "Краткосрочная", status: "confirmed" },
  { id: "cal-006", clientId: "cl-006", clientName: "Дмитрий Волков", date: "2026-05-19", time: "15:00", city: "Санкт-Петербург", visaType: "Долгосрочная", status: "pending" },
  { id: "cal-007", clientId: "cl-007", clientName: "Елена Соколова", date: "2026-05-20", time: "10:00", city: "Казань", visaType: "Краткосрочная", status: "confirmed" },
  { id: "cal-008", clientId: "cl-008", clientName: "Павел Лебедев", date: "2026-05-21", time: "13:00", city: "Москва", visaType: "Долгосрочная", status: "cancelled" },
  { id: "cal-009", clientId: "cl-009", clientName: "Наталья Кузнецова", date: "2026-05-22", time: "11:30", city: "Новосибирск", visaType: "Краткосрочная", status: "confirmed" },
  { id: "cal-010", clientId: "cl-010", clientName: "Сергей Попов", date: "2026-05-23", time: "14:30", city: "Москва", visaType: "Краткосрочная", status: "confirmed" },
];