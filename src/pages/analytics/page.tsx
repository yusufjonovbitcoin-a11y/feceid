import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/context/ToastContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { bookingStats, cityStats, weeklyStats, botPerformance } from "@/mocks/analytics";

const COLORS = ["#10b981", "#ef4444", "#f59e0b", "#06b6d4", "#f97316"];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleExport = () => {
    addToast("Отчёт экспортирован в CSV", "success");
  };

  const totalSuccess = bookingStats.reduce((s, b) => s + b.successful, 0);
  const totalFailed = bookingStats.reduce((s, b) => s + b.failed, 0);
  const totalPending = bookingStats.reduce((s, b) => s + b.pending, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Аналитика</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Статистика и метрики работы бота</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
            {(["7d", "30d", "90d"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap ${
                  period === p
                    ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {p === "7d" ? "7 дней" : p === "30d" ? "30 дней" : "90 дней"}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors whitespace-nowrap"
          >
            <i className="ri-download-line"></i>
            Экспорт
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Успешных записей", value: totalSuccess, color: "text-emerald-600", icon: "ri-check-double-line" },
          { label: "Ошибок", value: totalFailed, color: "text-red-500", icon: "ri-close-circle-line" },
          { label: "В ожидании", value: totalPending, color: "text-amber-500", icon: "ri-time-line" },
          { label: "Процент успеха", value: `${botPerformance.successRate}%`, color: "text-blue-600", icon: "ri-percent-line" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-slate-800 ${stat.color}`}>
                <i className={`${stat.icon} text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Записи по дням</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bookingStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="successful" name="Успешно" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" name="Ошибки" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Распределение по городам</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={cityStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="successful"
                nameKey="city"
                label
              >
                {cityStats.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Динамика по неделям</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bookings" name="Записи" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Производительность бота</h3>
          <div className="space-y-4">
            {[
              { label: "Аптайм", value: `${botPerformance.uptime} ч`, desc: "Без перерыва" },
              { label: "Проверок слотов", value: botPerformance.totalChecks.toLocaleString(), desc: "Всего проверок" },
              { label: "Среднее время", value: `${botPerformance.avgResponseTime} сек`, desc: "Отклик на слот" },
              { label: "Успешность", value: `${botPerformance.successRate}%`, desc: "Процент успеха" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}