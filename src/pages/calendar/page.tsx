import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/context/ToastContext";
import { calendarBookings, type CalendarBooking } from "@/mocks/calendar";

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getBookingsForDate = (day: number): CalendarBooking[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarBookings.filter((b) => b.date === dateStr);
  };

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Календарь записей</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Визуальный обзор всех забронированных дат</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handlePrevMonth} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <i className="ri-arrow-left-s-line text-lg text-gray-600 dark:text-gray-300"></i>
          </button>
          <span className="text-base font-semibold text-gray-900 dark:text-white w-32 text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={handleNextMonth} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
            <i className="ri-arrow-right-s-line text-lg text-gray-600 dark:text-gray-300"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-5">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} className="aspect-square" />;
              const bookings = getBookingsForDate(day);
              const hasBookings = bookings.length > 0;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === "2026-05-13";

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`aspect-square rounded-lg border text-sm relative transition-all p-1 flex flex-col items-center justify-start ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : isToday
                        ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-600"
                  }`}
                >
                  <span className={`font-medium ${isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}`}>
                    {day}
                  </span>
                  {hasBookings && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                      {bookings.slice(0, 3).map((b, i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            b.status === "confirmed"
                              ? "bg-emerald-500"
                              : b.status === "pending"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        />
                      ))}
                      {bookings.length > 3 && (
                        <span className="text-[8px] text-gray-500 dark:text-gray-400 leading-none">+{bookings.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Подтверждено</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> В ожидании</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Отменено</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            {selectedDate ? `Записи на ${selectedDate}` : "Ближайшие записи"}
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {(selectedDate
              ? calendarBookings.filter((b) => b.date === selectedDate)
              : calendarBookings.slice(0, 6)
            ).map((booking) => (
              <div
                key={booking.id}
                onClick={() => navigate(`/clients/${booking.clientId}`)}
                className="p-3 rounded-lg border border-gray-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{booking.clientName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    booking.status === "confirmed"
                      ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                      : booking.status === "pending"
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  }`}>
                    {booking.status === "confirmed" ? "Подтверждено" : booking.status === "pending" ? "В ожидании" : "Отменено"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><i className="ri-time-line"></i> {booking.time}</span>
                  <span className="flex items-center gap-1"><i className="ri-map-pin-line"></i> {booking.city}</span>
                  <span className="flex items-center gap-1"><i className="ri-passport-line"></i> {booking.visaType}</span>
                </div>
              </div>
            ))}
            {(selectedDate ? calendarBookings.filter((b) => b.date === selectedDate) : calendarBookings.slice(0, 6)).length === 0 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">Нет записей на эту дату</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}