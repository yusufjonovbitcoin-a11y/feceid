import { useEffect, useState } from "react";
import { clients, type Client } from "@/mocks/clients";
import { servers } from "@/mocks/servers";
import { logs } from "@/mocks/logs";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalClients: 0,
    inQueue: 0,
    booked: 0,
    paused: 0,
    activeServers: 0,
    totalServers: 0,
    errors: 0,
  });

  const [recentLogs, setRecentLogs] = useState<typeof logs>([]);
  const [recentClients, setRecentClients] = useState<Client[]>([]);

  useEffect(() => {
    setStats({
      totalClients: clients.length,
      inQueue: clients.filter((c) => c.status === "В очереди").length,
      booked: clients.filter((c) => c.status === "Записан").length,
      paused: clients.filter((c) => c.status === "На паузе").length,
      activeServers: servers.filter((s) => s.status === "active").length,
      totalServers: servers.length,
      errors: logs.filter((l) => l.type === "error").length,
    });
    setRecentLogs(logs.slice(0, 5));
    setRecentClients(clients.slice(0, 5));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Дашборд</h1>
          <p className="text-sm text-gray-500 mt-0.5">Обзор системы в реальном времени</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm text-emerald-600 font-medium">Бот активен</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="ri-user-line"
          label="Всего клиентов"
          value={stats.totalClients}
          color="emerald"
        />
        <StatCard
          icon="ri-list-ordered"
          label="В очереди"
          value={stats.inQueue}
          color="amber"
        />
        <StatCard
          icon="ri-calendar-check-line"
          label="Успешных записей"
          value={stats.booked}
          color="emerald"
        />
        <StatCard
          icon="ri-pause-circle-line"
          label="На паузе"
          value={stats.paused}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Последние события</h3>
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{log.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{log.created_at}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Новые клиенты</h3>
          <div className="space-y-3">
            {recentClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700">
                  {client.first_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {client.first_name} {client.last_name}
                  </p>
                  <p className="text-xs text-gray-400">{client.city}</p>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    client.status === "Записан"
                      ? "bg-emerald-100 text-emerald-700"
                      : client.status === "В очереди"
                      ? "bg-blue-100 text-blue-700"
                      : client.status === "На паузе"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {client.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Статус серверов</h3>
          <div className="space-y-3">
            {servers.map((server) => (
              <div
                key={server.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      server.status === "active" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{server.name}</p>
                    <p className="text-xs text-gray-400">
                      {server.ip_address} · {server.location}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    server.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {server.status === "active" ? "Активен" : "Ошибка"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Быстрые действия</h3>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction icon="ri-user-add-line" label="Добавить клиента" path="/clients" />
            <QuickAction icon="ri-list-ordered" label="Управление очередью" path="/queue" />
            <QuickAction icon="ri-search-line" label="Проверить слоты" path="/slots" />
            <QuickAction icon="ri-settings-3-line" label="Настройки бота" path="/settings" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            color === "emerald"
              ? "bg-emerald-100 text-emerald-600"
              : color === "amber"
              ? "bg-amber-100 text-amber-600"
              : "bg-orange-100 text-orange-600"
          }`}
        >
          <i className={`${icon} text-lg`}></i>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  path,
}: {
  icon: string;
  label: string;
  path: string;
}) {
  return (
    <a
      href={path}
      className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-center"
    >
      <i className={`${icon} text-xl text-gray-500`}></i>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </a>
  );
}