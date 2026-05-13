import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/context/ToastContext";
import {
  clients,
  type Client,
  VISA_SUB_TYPES,
  parseVisaSubType,
  parseVisaType,
  parseClientCategory,
  parseAppointmentFor,
} from "@/mocks/clients";

const MAX_CLIENT_IMAGE_BYTES = 190 * 1024;
const MAX_CLIENT_VIDEO_BYTES = 45 * 1024 * 1024;

function readFileAsDataUrl(file: File, maxBytes: number): Promise<string> {
  if (file.size > maxBytes) {
    return Promise.reject(new Error("FILE_TOO_LARGE"));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
export default function ClientsPage() {
  const [clientList, setClientList] = useState<Client[]>(clients);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const cities = useMemo(() => {
    const set = new Set(clientList.map((c) => c.city));
    return Array.from(set);
  }, [clientList]);

  const filtered = useMemo(() => {
    return clientList.filter((c) => {
      const matchesSearch =
        `${c.first_name} ${c.last_name} ${c.email}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesCity = cityFilter === "all" || c.city === cityFilter;
      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [clientList, search, statusFilter, cityFilter]);

  const handleDelete = (id: string) => {
    if (window.confirm("Удалить клиента?")) {
      setClientList((prev) => prev.filter((c) => c.id !== id));
      addToast("Клиент удалён", "success");
    }
  };

  const handleTogglePause = (client: Client) => {
    setClientList((prev) =>
      prev.map((c) =>
        c.id === client.id
          ? { ...c, status: c.status === "На паузе" ? "В очереди" : "На паузе" }
          : c
      )
    );
    addToast(client.status === "На паузе" ? "Клиент возобновлён" : "Клиент поставлен на паузу", "info");
  };

  const handleSave = (client: Client) => {
    if (editingClient) {
      setClientList((prev) =>
        prev.map((c) => (c.id === client.id ? client : c))
      );
      addToast("Клиент обновлён", "success");
    } else {
      setClientList((prev) => [client, ...prev]);
      addToast("Клиент добавлен", "success");
    }
    setShowModal(false);
    setEditingClient(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportText(text);
      addToast(`Файл ${file.name} загружен`, "success");
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!importText.trim()) {
      addToast("Загрузите файл или вставьте данные", "warning");
      return;
    }
    const lines = importText.trim().split("\n");
    const newClients: Client[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim());
      if (cols.length < 4) continue;
      const extended = cols.length >= 14;
      newClients.push({
        id: `imp-${Date.now()}-${i}`,
        first_name: cols[0] || "",
        last_name: cols[1] || "",
        birth_date: cols[2] || "",
        passport_number: cols[3] || "",
        phone: cols[4] || "",
        email: cols[5] || "",
        city: cols[6] || "Москва",
        category: extended
          ? parseClientCategory(cols[7])
          : "Normal",
        appointment_for: extended
          ? parseAppointmentFor(cols[8])
          : "individual",
        number_of_members:
          extended && parseAppointmentFor(cols[8]) === "Family" ? 2 : 1,
        location: extended ? cols[9] || "" : "",
        visa_type: extended ? parseVisaType(cols[10]) : "Short Term Visa",
        visa_sub_type: extended
          ? parseVisaSubType(cols[11])
          : parseVisaSubType(cols[7]),
        travel_date: "",
        intended_arrival_date: "",
        intended_departure_date: "",
        account_login: extended ? cols[12] || "" : cols[8] || "",
        account_password: extended ? cols[13] || "" : cols[9] || "",
        otp_password: "",
        card_info: "",
        photo_url: "",
        video_url: "",
        status: "В очереди",
        priority: 0,
        created_at: new Date().toISOString().split("T")[0],
      });
    }
    setClientList((prev) => [...newClients, ...prev]);
    setShowImportModal(false);
    setImportText("");
    addToast(`Импортировано ${newClients.length} клиентов`, "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">База клиентов</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Управление клиентами и их данными
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2.5 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <i className="ri-upload-2-line"></i>
            Импорт CSV
          </button>
          <button
            onClick={() => {
              setEditingClient(null);
              setShowModal(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <i className="ri-add-line"></i>
            Добавить клиента
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени, email..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
        >
          <option value="all">Все статусы</option>
          <option value="В очереди">В очереди</option>
          <option value="На паузе">На паузе</option>
          <option value="Записан">Записан</option>
          <option value="Ошибка">Ошибка</option>
        </select>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
        >
          <option value="all">Все города</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Паспорт
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Город / Виза
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Приоритет
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Добавлен
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/clients/${client.id}`} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {client.first_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {client.first_name} {client.last_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{client.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {client.passport_number}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{client.city}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {client.visa_type} · {client.visa_sub_type}
                      {client.category !== "Normal" && (
                        <span className="text-gray-400"> · {client.category}</span>
                      )}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        client.status === "Записан"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : client.status === "В очереди"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          : client.status === "На паузе"
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {client.priority || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {client.created_at}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/clients/${client.id}`}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                        title="Профиль"
                      >
                        <i className="ri-user-line"></i>
                      </Link>
                      <button
                        onClick={() => {
                          setEditingClient(client);
                          setShowModal(true);
                        }}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                        title="Редактировать"
                      >
                        <i className="ri-pencil-line"></i>
                      </button>
                      <button
                        onClick={() => handleTogglePause(client)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
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
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400 dark:text-gray-500">
            <i className="ri-user-search-line text-3xl mb-2"></i>
            <p>Клиенты не найдены</p>
          </div>
        )}
      </div>

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Импорт клиентов</h2>
              <button onClick={() => setShowImportModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Загрузите CSV: Имя, Фамилия, Дата рождения, Паспорт, Телефон, Email, Город, Виза (подтип), Логин, Пароль — или расширенный формат (14 колонок): …Город, Category, Appointment, Location, VisaType, VisaSubType, Логин, Пароль
              </p>
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:border-emerald-400 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <i className="ri-upload-cloud-line text-lg"></i>
                Нажмите чтобы выбрать файл CSV
              </button>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Или вставьте содержимое CSV сюда..."
                className="w-full h-40 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={() => setShowImportModal(false)} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">Отмена</button>
              <button onClick={handleImport} className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors">Импортировать</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <ClientModal
          client={editingClient}
          onClose={() => {
            setShowModal(false);
            setEditingClient(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ClientModal({
  client,
  onClose,
  onSave,
}: {
  client: Client | null;
  onClose: () => void;
  onSave: (client: Client) => void;
}) {
  const { addToast } = useToast();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<Client>>(
    client || {
      first_name: "",
      last_name: "",
      birth_date: "",
      passport_number: "",
      phone: "",
      email: "",
      city: "Москва",
      category: "Normal",
      appointment_for: "individual",
      number_of_members: 1,
      location: "",
      visa_type: "Short Term Visa",
      visa_sub_type: "schengen Visa",
      travel_date: "",
      intended_arrival_date: "",
      intended_departure_date: "",
      account_login: "",
      account_password: "",
      otp_password: "",
      card_info: "",
      photo_url: "",
      video_url: "",
      status: "В очереди",
      priority: 0,
    }
  );

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const url = await readFileAsDataUrl(file, MAX_CLIENT_IMAGE_BYTES);
      setForm((f) => ({ ...f, photo_url: url }));
      addToast("Фото добавлено", "success");
    } catch {
      addToast("Фото слишком большое (макс. 190 КБ)", "warning");
    }
  };

  const handleVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const nameLower = file.name.toLowerCase();
    const isMp4Ext = nameLower.endsWith(".mp4");
    const isMp4Mime =
      !file.type ||
      file.type === "video/mp4" ||
      (isMp4Ext && file.type === "application/octet-stream");
    if (!isMp4Ext || !isMp4Mime) {
      addToast("Только файл MP4 (.mp4)", "warning");
      return;
    }
    try {
      const url = await readFileAsDataUrl(file, MAX_CLIENT_VIDEO_BYTES);
      setForm((f) => ({ ...f, video_url: url }));
      addToast("Видео добавлено", "success");
    } catch {
      addToast("Видео слишком большое (макс. 45 МБ)", "warning");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const place =
      (form.city || form.location || "").trim() || "Москва";
    const appt = form.appointment_for || "individual";
    const numberOfMembers =
      appt === "Family"
        ? Math.max(2, Math.min(99, Number(form.number_of_members) || 2))
        : 1;
    const newClient: Client = {
      id: client?.id || `c${Date.now()}`,
      first_name: form.first_name || "",
      last_name: form.last_name || "",
      birth_date: form.birth_date || "",
      passport_number: form.passport_number || "",
      phone: form.phone || "",
      email: form.email || "",
      city: place,
      category: form.category || "Normal",
      appointment_for: appt,
      number_of_members: numberOfMembers,
      location: place,
      visa_type: form.visa_type || "Short Term Visa",
      visa_sub_type: parseVisaSubType(form.visa_sub_type),
      travel_date: form.travel_date || "",
      intended_arrival_date: form.intended_arrival_date || "",
      intended_departure_date: form.intended_departure_date || "",
      account_login: form.account_login || "",
      account_password: form.account_password || "",
      otp_password: form.otp_password || "",
      card_info: form.card_info || "",
      photo_url: form.photo_url || "",
      video_url: form.video_url || "",
      status: (form.status as Client["status"]) || "В очереди",
      priority: Number(form.priority) || 0,
      created_at: client?.created_at || new Date().toISOString().split("T")[0],
    };
    onSave(newClient);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {client ? "Редактировать клиента" : "Добавить клиента"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Имя
              </label>
              <input
                required
                value={form.first_name || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, first_name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Фамилия
              </label>
              <input
                required
                value={form.last_name || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, last_name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Дата рождения
              </label>
              <input
                type="date"
                required
                value={form.birth_date || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, birth_date: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category
              </label>
              <select
                value={form.category || "Normal"}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    category: e.target.value as Client["category"],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              >
                <option value="Normal">Normal</option>
                <option value="Premium">Premium</option>
                <option value="Prime Time">Prime Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Appointment For
              </label>
              <select
                value={form.appointment_for || "individual"}
                onChange={(e) => {
                  const v = e.target.value as Client["appointment_for"];
                  setForm((f) => ({
                    ...f,
                    appointment_for: v,
                    number_of_members:
                      v === "Family"
                        ? Math.max(2, f.number_of_members ?? 2)
                        : 1,
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              >
                <option value="individual">individual</option>
                <option value="Family">Family</option>
              </select>
              {form.appointment_for === "Family" ? (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Number Of Members
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="2–99"
                    value={
                      form.number_of_members === undefined ||
                      form.number_of_members === null
                        ? ""
                        : String(form.number_of_members)
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\s/g, "");
                      if (raw === "") {
                        setForm((f) => ({ ...f, number_of_members: undefined }));
                        return;
                      }
                      if (!/^\d+$/.test(raw)) return;
                      const n = Number.parseInt(raw, 10);
                      if (Number.isNaN(n)) return;
                      setForm((f) => ({ ...f, number_of_members: n }));
                    }}
                    onBlur={() => {
                      setForm((f) => {
                        if (f.appointment_for !== "Family") return f;
                        const m = f.number_of_members;
                        if (
                          m === undefined ||
                          m === null ||
                          Number.isNaN(Number(m)) ||
                          Number(m) < 2
                        ) {
                          return { ...f, number_of_members: 2 };
                        }
                        return {
                          ...f,
                          number_of_members: Math.min(99, Math.max(2, Number(m))),
                        };
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              ) : null}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Город / Location
              </label>
              <input
                value={form.city || form.location || ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((f) => ({ ...f, city: v, location: v }));
                }}
                placeholder="Москва, офис, адрес…"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Visa Type
              </label>
              <select
                value={form.visa_type || "Short Term Visa"}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    visa_type: e.target.value as Client["visa_type"],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              >
                <option value="National Visa">National Visa</option>
                <option value="Short Term Visa">Short Term Visa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Visa Sub Type
              </label>
              <select
                value={form.visa_sub_type || "schengen Visa"}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    visa_sub_type: e.target.value as Client["visa_sub_type"],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              >
                {VISA_SUB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Travel Date
              </label>
              <input
                type="date"
                value={form.travel_date || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, travel_date: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Intended Date Of Arrival
              </label>
              <input
                type="date"
                value={form.intended_arrival_date || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    intended_arrival_date: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Intended Date Of Departure
              </label>
              <input
                type="date"
                value={form.intended_departure_date || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    intended_departure_date: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Логин от аккаунта
              </label>
              <input
                value={form.account_login || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, account_login: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Пароль от аккаунта
              </label>
              <input
                type="password"
                value={form.account_password || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, account_password: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                OTP password
              </label>
              <input
                type="password"
                autoComplete="new-password"
                value={form.otp_password || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, otp_password: e.target.value }))
                }
                placeholder="App password / OTP"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Карта
              </label>
              <input
                value={form.card_info || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, card_info: e.target.value }))
                }
                placeholder="Номер карты / держатель"
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Статус
              </label>
              <select
                value={form.status || "В очереди"}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
              >
                <option>В очереди</option>
                <option>На паузе</option>
                <option>Записан</option>
                <option>Ошибка</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Приоритет
              </label>
              <input
                type="number"
                value={form.priority || 0}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priority: Number(e.target.value) }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3">
            <p className="text-sm font-semibold text-gray-900">Фото и видео</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50/90 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-800">Фото</span>
                  {form.photo_url ? (
                    <button
                      type="button"
                      onClick={() => {
                        setForm((f) => ({ ...f, photo_url: "" }));
                        if (imageInputRef.current) imageInputRef.current.value = "";
                      }}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Удалить
                    </button>
                  ) : null}
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageFile}
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-emerald-400 hover:text-emerald-700 hover:bg-white transition-colors"
                >
                  <i className="ri-image-add-line text-lg"></i>
                  Выбрать фото
                </button>
                <p className="text-xs text-gray-500">JPG, PNG, WebP — до 190 КБ</p>
                {form.photo_url ? (
                  <img
                    src={form.photo_url}
                    alt=""
                    className="w-full max-h-44 object-contain rounded-lg border border-gray-200 bg-white"
                  />
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">Нет фото</p>
                )}
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50/90 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-800">Видео</span>
                  {form.video_url ? (
                    <button
                      type="button"
                      onClick={() => {
                        setForm((f) => ({ ...f, video_url: "" }));
                        if (videoInputRef.current) videoInputRef.current.value = "";
                      }}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Удалить
                    </button>
                  ) : null}
                </div>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/mp4,.mp4"
                  className="hidden"
                  onChange={handleVideoFile}
                />
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-emerald-400 hover:text-emerald-700 hover:bg-white transition-colors"
                >
                  <i className="ri-movie-2-line text-lg"></i>
                  Выбрать видео
                </button>
                <p className="text-xs text-gray-500">Только MP4 — до 45 МБ</p>
                {form.video_url ? (
                  <video
                    src={form.video_url}
                    controls
                    className="w-full max-h-44 rounded-lg border border-gray-200 bg-black"
                  />
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">Нет видео</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
              {client ? "Сохранить" : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}