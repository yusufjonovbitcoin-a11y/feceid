import { useState } from "react";
import { servers, type Server } from "@/mocks/servers";

export default function ServersPage() {
  const [serverList, setServerList] = useState<Server[]>(servers);
  const [showAdd, setShowAdd] = useState(false);

  const toggleStatus = (id: string) => {
    setServerList((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "inactive" : "active" }
          : s
      )
    );
  };

  const handleAdd = (server: Server) => {
    setServerList((prev) => [...prev, server]);
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Серверы</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Управление российскими серверами и IP-адресами
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <i className="ri-add-line"></i>
          Добавить сервер
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Всего серверов</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {serverList.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Активных</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {serverList.filter((s) => s.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">С ошибками</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {serverList.filter((s) => s.status === "error").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Российских IP</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {serverList.filter((s) => s.is_russian).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Сервер
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  IP-адрес
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Локация
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Последняя проверка
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {serverList.map((server) => (
                <tr key={server.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          server.status === "active"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">
                        {server.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-gray-700">
                    {server.ip_address}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {server.location}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        server.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : server.status === "error"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {server.status === "active"
                        ? "Активен"
                        : server.status === "error"
                        ? "Ошибка"
                        : "Неактивен"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {server.last_check}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleStatus(server.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                      style={{
                        backgroundColor:
                          server.status === "active" ? "#fee2e2" : "#d1fae5",
                        color:
                          server.status === "active" ? "#b91c1c" : "#059669",
                      }}
                    >
                      {server.status === "active" ? "Отключить" : "Включить"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <AddServerModal
          onClose={() => setShowAdd(false)}
          onSave={handleAdd}
        />
      )}
    </div>
  );
}

function AddServerModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (server: Server) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    ip_address: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `s${Date.now()}`,
      name: form.name,
      ip_address: form.ip_address,
      location: form.location,
      status: "active",
      is_russian: true,
      last_check: new Date().toISOString().slice(0, 19).replace("T", " "),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Добавить сервер
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Название
            </label>
            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              placeholder="RU-Moscow-02"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              IP-адрес
            </label>
            <input
              required
              value={form.ip_address}
              onChange={(e) =>
                setForm((f) => ({ ...f, ip_address: e.target.value }))
              }
              placeholder="185.12.34.57"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Локация
            </label>
            <input
              required
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
              placeholder="Москва, ДатаПро"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors whitespace-nowrap"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}