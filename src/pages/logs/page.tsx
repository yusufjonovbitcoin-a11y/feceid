import { useState, useMemo } from "react";
import { logs, type LogEntry } from "@/mocks/logs";

export default function LogsPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const matchesType = typeFilter === "all" || l.type === typeFilter;
      const matchesSearch = l.message.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [typeFilter, search]);

  const counts = useMemo(() => {
    return {
      all: logs.length,
      success: logs.filter((l) => l.type === "success").length,
      error: logs.filter((l) => l.type === "error").length,
      warning: logs.filter((l) => l.type === "warning").length,
      info: logs.filter((l) => l.type === "info").length,
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Логи работы</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            История действий и событий системы
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {([
          ["all", "Все", counts.all],
          ["success", "Успешно", counts.success],
          ["error", "Ошибки", counts.error],
          ["warning", "Предупреждения", counts.warning],
          ["info", "Информация", counts.info],
        ] as const).map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => setTypeFilter(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              typeFilter === key
                ? key === "success"
                  ? "bg-emerald-100 text-emerald-700"
                  : key === "error"
                  ? "bg-red-100 text-red-700"
                  : key === "warning"
                  ? "bg-amber-100 text-amber-700"
                  : key === "info"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-700"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      <div className="relative">
        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по сообщению..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Сообщение
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Время
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        log.type === "success"
                          ? "bg-emerald-100 text-emerald-600"
                          : log.type === "error"
                          ? "bg-red-100 text-red-600"
                          : log.type === "warning"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      <i
                        className={`${
                          log.type === "success"
                            ? "ri-check-line"
                            : log.type === "error"
                            ? "ri-close-line"
                            : log.type === "warning"
                            ? "ri-alert-line"
                            : "ri-information-line"
                        }`}
                      ></i>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {log.message}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {log.client_id ? (
                      <a
                        href={`/clients`}
                        className="text-emerald-600 hover:underline"
                      >
                        Перейти
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {log.created_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <i className="ri-file-search-line text-3xl mb-2"></i>
            <p>Логи не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}