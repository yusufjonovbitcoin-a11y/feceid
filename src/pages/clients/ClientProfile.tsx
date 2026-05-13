import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/context/ToastContext";
import { clients } from "@/mocks/clients";
import { calendarBookings } from "@/mocks/calendar";

export default function ClientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const client = clients.find((c) => c.id === id);
  const bookings = calendarBookings.filter((b) => b.clientId === id);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <i className="ri-user-unfollow-line text-5xl text-gray-300 dark:text-slate-600 mb-4"></i>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Клиент не найден</h2>
        <button
          onClick={() => navigate("/clients")}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors"
        >
          К списку клиентов
        </button>
      </div>
    );
  }

  const handleExportProfile = () => {
    addToast("Профиль клиента экспортирован", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/clients")}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          <i className="ri-arrow-left-line text-gray-600 dark:text-gray-300"></i>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{client.fullName}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">ID: {client.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Основная информация</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Дата рождения", value: client.birthDate },
                { label: "Номер паспорта", value: client.passport },
                { label: "Email", value: client.email },
                { label: "Телефон", value: client.phone },
                { label: "Город подачи", value: client.city },
                { label: "Категория визы", value: client.visaType },
                { label: "Логин", value: client.login },
                { label: "Пароль", value: "••••••••" },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{field.label}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{field.value || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">История записей</h3>
            {bookings.length > 0 ? (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        b.status === "confirmed" ? "bg-emerald-500" : b.status === "pending" ? "bg-amber-500" : "bg-red-500"
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{b.date} в {b.time}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{b.city} — {b.visaType}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      b.status === "confirmed"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : b.status === "pending"
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                    }`}>
                      {b.status === "confirmed" ? "Подтверждено" : b.status === "pending" ? "В ожидании" : "Отменено"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">Нет записей</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Статус</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Состояние</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  client.status === "active"
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                    : client.status === "paused"
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                }`}>
                  {client.status === "active" ? "Активен" : client.status === "paused" ? "На паузе" : "Завершён"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Приоритет</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">#{client.queuePosition || "—"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">В очереди</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{client.status !== "completed" ? "Да" : "Нет"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Видео верификация</h3>
            <div className="aspect-video rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
              <div className="text-center">
                <i className="ri-video-line text-3xl text-gray-300 dark:text-slate-600 mb-2"></i>
                <p className="text-xs text-gray-400 dark:text-gray-500">Видео загружено</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Действия</h3>
            <div className="space-y-2">
              <button
                onClick={handleExportProfile}
                className="w-full flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <i className="ri-download-line"></i>
                Экспорт профиля
              </button>
              <button
                onClick={() => {
                  addToast("Редактирование открыто", "info");
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                <i className="ri-edit-line"></i>
                Редактировать
              </button>
              <button
                onClick={() => {
                  addToast("Клиент удалён", "success");
                  navigate("/clients");
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 border border-red-200 dark:border-red-900/30 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <i className="ri-delete-bin-line"></i>
                Удалить клиента
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}