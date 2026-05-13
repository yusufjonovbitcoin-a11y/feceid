import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      addToast("Добро пожаловать в VisaBot!", "success");
      navigate("/dashboard", { replace: true });
    } else {
      setError("Неверный email или пароль");
      addToast("Ошибка входа. Проверьте данные", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-8">
          <div className="flex flex-col items-center mb-8">
            <img
              src="https://public.readdy.ai/ai/img_res/39e602a0-ab89-4803-ae04-94628044568a.png"
              alt="VisaBot Logo"
              className="w-16 h-16 object-contain mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">VisaBot</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Панель управления ботом</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <i className="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="superadmin@visabot.ru"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Пароль
              </label>
              <div className="relative">
                <i className="ri-lock-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                <i className="ri-error-warning-line"></i>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  Вход...
                </>
              ) : (
                <>
                  <i className="ri-login-box-line"></i>
                  Войти
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mb-2">Демо-аккаунты:</p>
            <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <p className="flex justify-between">
                <span>Супер-админ:</span>
                <span className="font-mono">superadmin@visabot.ru / admin123</span>
              </p>
              <p className="flex justify-between">
                <span>Оператор:</span>
                <span className="font-mono">operator@visabot.ru / operator123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}