import { useState } from "react";

export default function SettingsPage() {
  const [botSpeed, setBotSpeed] = useState(30);
  const [retries, setRetries] = useState(3);
  const [notifications, setNotifications] = useState(true);
  const [autoRestart, setAutoRestart] = useState(true);
  const [backupInterval, setBackupInterval] = useState(60);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Настройки</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Конфигурация бота и системы
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
          <h3 className="text-base font-semibold text-gray-900">
            Параметры бота
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Интервал проверки слотов (секунды)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="120"
                value={botSpeed}
                onChange={(e) => setBotSpeed(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 w-14">
                {botSpeed}с
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Меньше значение — быстрее проверка, но выше нагрузка
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Количество попыток записи
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={retries}
              onChange={(e) => setRetries(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Автоматический перезапуск
              </p>
              <p className="text-xs text-gray-400">
                Перезапускать бота при ошибках
              </p>
            </div>
            <button
              onClick={() => setAutoRestart(!autoRestart)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                autoRestart ? "bg-emerald-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  autoRestart ? "translate-x-5" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
          <h3 className="text-base font-semibold text-gray-900">
            Уведомления и резервное копирование
          </h3>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Уведомления
              </p>
              <p className="text-xs text-gray-400">
                Отправлять уведомления об успешных записях
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                notifications ? "bg-emerald-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications ? "translate-x-5" : ""
                }`}
              ></span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Интервал резервного копирования (минуты)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="360"
                value={backupInterval}
                onChange={(e) => setBackupInterval(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-700 w-16">
                {backupInterval}м
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
              <i className="ri-download-line"></i>
              Скачать резервную копию сейчас
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Информация о системе
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-400">Версия бота</p>
            <p className="text-sm font-medium text-gray-900">2.1.0</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Время работы</p>
            <p className="text-sm font-medium text-gray-900">14 дней 6 часов</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Последнее обновление</p>
            <p className="text-sm font-medium text-gray-900">2026-05-10</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Статус лицензии</p>
            <p className="text-sm font-medium text-emerald-600">Активна</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors whitespace-nowrap">
          Сохранить настройки
        </button>
      </div>
    </div>
  );
}