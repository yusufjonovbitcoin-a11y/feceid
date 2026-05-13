import { useState } from "react";
import { clients } from "@/mocks/clients";

interface VideoRecord {
  id: string;
  client_id: string;
  client_name: string;
  filename: string;
  size: string;
  uploaded_at: string;
  status: "pending" | "verified" | "rejected";
}

const mockVideos: VideoRecord[] = [
  {
    id: "v1",
    client_id: "c1",
    client_name: "Анна Петрова",
    filename: "anna_verification.mp4",
    size: "12.4 MB",
    uploaded_at: "2026-05-12 10:30",
    status: "verified",
  },
  {
    id: "v2",
    client_id: "c2",
    client_name: "Дмитрий Соколов",
    filename: "dmitry_verification.mp4",
    size: "15.1 MB",
    uploaded_at: "2026-05-13 13:55",
    status: "pending",
  },
  {
    id: "v3",
    client_id: "c5",
    client_name: "Ольга Новикова",
    filename: "olga_verification.mp4",
    size: "9.8 MB",
    uploaded_at: "2026-05-11 16:20",
    status: "verified",
  },
  {
    id: "v4",
    client_id: "c7",
    client_name: "Ксения Лебедева",
    filename: "ksenia_verification.mp4",
    size: "11.2 MB",
    uploaded_at: "2026-05-13 09:15",
    status: "pending",
  },
];

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoRecord[]>(mockVideos);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<string>("");

  const filtered = videos.filter(
    (v) =>
      v.client_name.toLowerCase().includes(search.toLowerCase()) ||
      v.filename.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = () => {
    if (!selectedClient) return;
    const client = clients.find((c) => c.id === selectedClient);
    if (!client) return;
    const newVideo: VideoRecord = {
      id: `v${Date.now()}`,
      client_id: client.id,
      client_name: `${client.first_name} ${client.last_name}`,
      filename: `${client.first_name.toLowerCase()}_verification.mp4`,
      size: "10.5 MB",
      uploaded_at: new Date().toISOString().slice(0, 16).replace("T", " "),
      status: "pending",
    };
    setVideos((prev) => [newVideo, ...prev]);
    setSelectedClient("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Видео верификация
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Управление видео-верификациями клиентов
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Загрузить видео
        </h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Выберите клиента</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.first_name} {c.last_name} — {c.city}
              </option>
            ))}
          </select>
          <button
            onClick={handleUpload}
            disabled={!selectedClient}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-medium rounded-lg text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <i className="ri-upload-cloud-line"></i>
            Загрузить видео
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Видео записывается через{" "}
          <a
            href="https://videorecorderweb.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline"
          >
            videorecorderweb.netlify.app
          </a>
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по клиенту или файлу..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Клиент
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Файл
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Размер
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Загружено
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Статус
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((video) => (
                <tr key={video.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700">
                        {video.client_name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {video.client_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <i className="ri-video-line text-gray-400"></i>
                      <span className="text-sm text-gray-700">
                        {video.filename}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {video.size}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {video.uploaded_at}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        video.status === "verified"
                          ? "bg-emerald-100 text-emerald-700"
                          : video.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {video.status === "verified"
                        ? "Подтверждено"
                        : video.status === "pending"
                        ? "В обработке"
                        : "Отклонено"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <i className="ri-video-line text-3xl mb-2"></i>
            <p>Видео не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}