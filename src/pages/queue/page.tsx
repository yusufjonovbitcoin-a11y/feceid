import { useState } from "react";
import { clients, type Client } from "@/mocks/clients";

export default function QueuePage() {
  const [queue, setQueue] = useState<Client[]>(
    clients
      .filter((c) => c.status === "В очереди" || c.status === "На паузе")
      .sort((a, b) => a.priority - b.priority)
  );

  const moveUp = (index: number) => {
    if (index === 0) return;
    setQueue((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next.map((c, i) => ({ ...c, priority: i + 1 }));
    });
  };

  const moveDown = (index: number) => {
    if (index === queue.length - 1) return;
    setQueue((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next.map((c, i) => ({ ...c, priority: i + 1 }));
    });
  };

  const togglePause = (id: string) => {
    setQueue((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "На паузе" ? "В очереди" : "На паузе" }
          : c
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Очередь клиентов</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Управление приоритетами и порядком записи
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-sm text-gray-600">
            {queue.filter((c) => c.status === "В очереди").length} активных
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Позиция
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Город / Виза
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Приоритет
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {queue.map((client, index) => (
                <tr
                  key={client.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    client.status === "На паузе" ? "bg-gray-50/50" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">
                      #{index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700">
                        {client.first_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {client.first_name} {client.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700">{client.city}</p>
                    <p className="text-xs text-gray-500">
                      {client.visa_sub_type}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        client.status === "В очереди"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">
                      {client.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-30"
                        title="Выше"
                      >
                        <i className="ri-arrow-up-line"></i>
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === queue.length - 1}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-30"
                        title="Ниже"
                      >
                        <i className="ri-arrow-down-line"></i>
                      </button>
                      <button
                        onClick={() => togglePause(client.id)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title={
                          client.status === "На паузе"
                            ? "Возобновить"
                            : "Пауза"
                        }
                      >
                        <i
                          className={`${
                            client.status === "На паузе"
                              ? "ri-play-circle-line"
                              : "ri-pause-circle-line"
                          }`}
                        ></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {queue.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <i className="ri-list-check-2 text-3xl mb-2"></i>
            <p>Очередь пуста</p>
          </div>
        )}
      </div>
    </div>
  );
}