import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { canAccess } from "@/mocks/auth";

const navItems = [
  { path: "/dashboard", label: "Дашборд", icon: "ri-dashboard-line", id: "dashboard" },
  { path: "/analytics", label: "Аналитика", icon: "ri-bar-chart-box-line", id: "analytics" },
  { path: "/clients", label: "База клиентов", icon: "ri-user-settings-line", id: "clients" },
  { path: "/queue", label: "Очередь", icon: "ri-list-ordered", id: "queue" },
  { path: "/slots", label: "Поиск слотов", icon: "ri-search-line", id: "slots" },
  { path: "/calendar", label: "Календарь", icon: "ri-calendar-line", id: "calendar" },
  { path: "/servers", label: "Серверы", icon: "ri-server-line", id: "servers" },
  { path: "/videos", label: "Видео", icon: "ri-video-line", id: "videos" },
  { path: "/logs", label: "Логи", icon: "ri-file-list-line", id: "logs" },
  { path: "/operators", label: "Операторы", icon: "ri-team-line", id: "operators" },
  { path: "/settings", label: "Настройки", icon: "ri-settings-3-line", id: "settings" },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const filteredNav = navItems.filter((item) => {
    if (!user) return false;
    return canAccess(user.role, item.id);
  });

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <img
          src="https://public.readdy.ai/ai/img_res/39e602a0-ab89-4803-ae04-94628044568a.png"
          alt="VisaBot Logo"
          className="w-10 h-10 object-contain"
        />
        <div>
          <h1 className="text-lg font-bold leading-tight">VisaBot</h1>
          <p className="text-xs text-slate-400">Автозапись Испания</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-emerald-600/20 text-emerald-400"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <i className={`${item.icon} text-lg w-5 h-5 flex items-center justify-center`}></i>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0) || "?"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">
              {user?.role === "super_admin" ? "Супер-админ" : "Оператор"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}