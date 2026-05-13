import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const handleLogout = () => {
    addToast("Вы успешно вышли из системы", "info");
    logout();
  };

  const handleTestNotification = () => {
    addToast("Новый слот найден! Москва, 15 мая", "success");
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Панель управления
        </h2>
        <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
          Онлайн
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title={theme === "light" ? "Тёмная тема" : "Светлая тема"}
        >
          <i className={`${theme === "light" ? "ri-moon-line" : "ri-sun-line"} text-lg`}></i>
        </button>
        <button
          onClick={handleTestNotification}
          className="w-9 h-9 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
          title="Уведомления"
        >
          <i className="ri-notification-3-line text-lg"></i>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="w-9 h-9 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
          <i className="ri-question-line text-lg"></i>
        </button>
        <div className="h-8 w-px bg-gray-200 dark:bg-slate-700"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.role === "super_admin" ? "Супер-админ" : "Оператор"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-9 h-9 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Выйти"
          >
            <i className="ri-logout-box-r-line text-lg"></i>
          </button>
        </div>
      </div>
    </header>
  );
}