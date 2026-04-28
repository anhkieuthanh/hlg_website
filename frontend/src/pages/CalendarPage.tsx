import { useEffect, useState } from "react";
import api from "../api";
import type { CalendarEvent } from "../types";
import { FiCalendar, FiPlus } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function CalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", event_date: "" });

  useEffect(() => {
    api.get<CalendarEvent[]>("/calendar").then((r) => setEvents(r.data));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post<CalendarEvent>("/calendar", {
        ...form,
        event_date: new Date(form.event_date).toISOString(),
      });
      setEvents([...events, data].sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()));
      setForm({ title: "", description: "", event_date: "" });
      setShowForm(false);
      toast.success("Đã thêm sự kiện");
    } catch {
      toast.error("Lỗi thêm sự kiện");
    }
  };

  const groupByMonth = (evts: CalendarEvent[]) => {
    const groups: Record<string, CalendarEvent[]> = {};
    for (const ev of evts) {
      const key = new Date(ev.event_date).toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
      if (!groups[key]) groups[key] = [];
      groups[key].push(ev);
    }
    return groups;
  };

  const grouped = groupByMonth(events);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Lịch học tập</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus /> Thêm sự kiện
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-3">
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Tên sự kiện" required />
          <input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="input-field" required />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={2} placeholder="Mô tả (tùy chọn)" />
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-sm">Lưu</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Hủy</button>
          </div>
        </form>
      )}

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <FiCalendar className="text-5xl mx-auto mb-4 text-gray-300" />
          <p>Chưa có sự kiện nào</p>
        </div>
      ) : (
        Object.entries(grouped).map(([month, evts]) => (
          <div key={month} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 capitalize">{month}</h2>
            <div className="space-y-3">
              {evts.map((ev) => (
                <div key={ev.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4">
                  <div className="w-14 h-14 rounded-lg bg-primary-50 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary-700">{new Date(ev.event_date).getDate()}</span>
                    <span className="text-xs text-primary-500">{new Date(ev.event_date).toLocaleDateString("vi-VN", { weekday: "short" })}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{ev.title}</h3>
                    {ev.description && <p className="text-sm text-gray-500 mt-1">{ev.description}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(ev.event_date).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                      {ev.is_global && <span className="ml-2 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-xs">Toàn công ty</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
