import { useState } from "react";
import { clients } from "@/mocks/clients";

interface FoundSlot {
  id: string;
  city: string;
  date: string;
  time: string;
  category: string;
  status: "available" | "booked" | "expired";
  found_at: string;
}

const mockSlots: FoundSlot[] = [
  {
    id: "slot1",
    city: "Москва",
    date: "2026-05-18",
    time: "10:30",
    category: "Шенген (туризм)",
    status: "booked",
    found_at: "2026-05-13 14:28:10",
  },
  {
    id: "slot2",
    city: "Санкт-Петербург",
    date: "2026-05-19",
    time: "14:00",
    category: "Шенген (бизнес)",
    status: "available",
    found_at: "2026-05-13 14:15:33",
  },
  {
    id: "slot3",
    city: "Казань",
    date: "2026-05-20",
    time: "09:00",
    category: "Шенген (студенческая)",
    status: "booked",
    found_at: "2026-05-13 14:10:05",
  },
  {
    id: "slot4",
    city: "Москва",
    date: "2026-05-21",
    time: "11:00",
    category: "Шенген (туризм)",
    status: "expired",
    found_at: "2026-05-13 13:55:42",
  },
];

export default function SlotsPage() {
  const [botActive, setBotActive] = useState(true);
  const [checkInterval, setCheckInterval] = useState(30);
  const [slots] = useState<FoundSlot[]>(mockSlots);

  const inQueue = clients.filter((c) => c.status === "В очереди").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Поиск слотов</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Мониторинг и бронирование свободных мест
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              botActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
            }`}
          ></span>
          <span className="text-sm font-medium text-gray-700">
            {botActive ? "Бот активен" : "Бот остановлен"}
          </span>
          <button
            onClick={() => setBotActive(!botActive)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              botActive
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            }`}
          >
            {botActive ? "Остановить" : "Запустить"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <i className="ri-user-search-line text-lg"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Клиентов в очереди</p>
              <p className="text-xl font-bold text-gray-900">{inQueue}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <i className="ri-calendar-check-line text-lg"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Найдено слотов</p>
              <p className="text-xl font-bold text-gray-900">{slots.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <i className="ri-time-line text-lg"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Последняя проверка</p>
              <p className="text-xl font-bold text-gray-900">14:32:15</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Настройки проверки
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Интервал проверки (секунды)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="120"
                value={checkInterval}
                onChange={(e) => setCheckInterval(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 w-12">
                {checkInterval}с
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Режим проверки
            </label>
            <select className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option>Все города</option>
              <option>Только Москва</option>
              <option>Только СПб</option>
              <option>Регионы</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">
            Найденные слоты
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Дата / Время
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Город
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Найден
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {slots.map((slot) => (
                <tr key={slot.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {slot.date}
                    </p>
                    <p className="text-xs text-gray-500">{slot.time}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {slot.city}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {slot.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        slot.status === "booked"
                          ? "bg-emerald-100 text-emerald-700"
                          : slot.status === "available"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {slot.status === "booked"
                        ? "Забронирован"
                        : slot.status === "available"
                        ? "Доступен"
                        : "Просрочен"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {slot.found_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}