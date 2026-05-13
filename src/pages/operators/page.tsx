import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { operators, auditLogs, type Operator } from "@/mocks/operators";

export default function OperatorsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [operatorsList, setOperatorsList] = useState<Operator[]>(operators);

  const filtered = operatorsList.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setOperatorsList((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: o.status === "active" ? "blocked" : "active" } : o
      )
    );
    addToast("Статус оператора изменён", "success");
  };

  const handleDelete = (id: string) => {
    setOperatorsList((prev) => prev.filter((o) => o.id !== id));
    addToast("Оператор удалён", "success");
  };

  if (user?.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <i className="ri-lock-line text-5xl text-gray-300 dark:text-slate-600 mb-4"></i>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Доступ ограничен</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Только супер-админ может управлять операторами</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Операторы</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Управление доступом и аудит действий</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAudit(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <i className="ri-history-line"></i>
            История действий
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors whitespace-nowrap"
          >
            <i className="ri-add-line"></i>
            Добавить оператора
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <div className="relative max-w-md">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Поиск по имени или email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Оператор</th>
                <th className="text-left px-4 py-3 font-medium">Роль</th>
                <th className="text-left px-4 py-3 font-medium">Статус</th>
                <th className="text-left px-4 py-3 font-medium">Действий</th>
                <th className="text-left px-4 py-3 font-medium">Последний вход</th>
                <th className="text-right px-4 py-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filtered.map((op) => (
                <tr key={op.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-medium text-sm">
                        {op.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{op.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{op.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      op.role === "super_admin"
                        ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                    }`}>
                      {op.role === "super_admin" ? "Супер-админ" : "Оператор"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      op.status === "active"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}>
                      {op.status === "active" ? "Активен" : "Заблокирован"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{op.actionsCount}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{op.lastLogin}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(op.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition-colors"
                        title={op.status === "active" ? "Заблокировать" : "Разблокировать"}
                      >
                        <i className={`${op.status === "active" ? "ri-lock-line" : "ri-lock-unlock-line"}`}></i>
                      </button>
                      <button
                        onClick={() => handleDelete(op.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors"
                        title="Удалить"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAudit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">История действий</h3>
              <button onClick={() => setShowAudit(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <i className="ri-close-line text-gray-500 dark:text-gray-400"></i>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 sticky top-0">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium">Время</th>
                    <th className="text-left px-5 py-3 font-medium">Оператор</th>
                    <th className="text-left px-5 py-3 font-medium">Действие</th>
                    <th className="text-left px-5 py-3 font-medium">Цель</th>
                    <th className="text-left px-5 py-3 font-medium">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">{log.timestamp}</td>
                      <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">{log.operatorName}</td>
                      <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{log.action}</td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{log.target}</td>
                      <td className="px-5 py-3 text-xs text-gray-400 dark:text-gray-500">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Добавить оператора</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Имя</label>
                <input type="text" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Пароль</label>
                <input type="password" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Роль</label>
                <select className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="operator">Оператор</option>
                  <option value="super_admin">Супер-админ</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">Отмена</button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  addToast("Оператор добавлен", "success");
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}