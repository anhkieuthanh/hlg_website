import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import type { Module, Lesson, Note } from "../types";
import toast from "react-hot-toast";
import { FiCheck, FiPlay, FiFileText, FiChevronDown, FiChevronRight, FiBookmark, FiDownload } from "react-icons/fi";

export default function LearningPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"lessons" | "notes">("lessons");

  useEffect(() => {
    if (!courseId) return;
    api.get<Module[]>(`/courses/${courseId}/modules`).then((r) => {
      setModules(r.data);
      const allModuleIds = new Set(r.data.map((m) => m.id));
      setExpandedModules(allModuleIds);
    });
  }, [courseId]);

  useEffect(() => {
    if (!lessonId || modules.length === 0) return;
    for (const mod of modules) {
      for (const sec of mod.sections) {
        const found = sec.lessons.find((l) => l.id === Number(lessonId));
        if (found) {
          setCurrentLesson(found);
          setCompleted(found.completed);
          break;
        }
      }
    }
    api.get<Note[]>(`/lessons/${lessonId}/notes`).then((r) => setNotes(r.data)).catch(() => {});
  }, [lessonId, modules]);

  const handleComplete = async () => {
    try {
      await api.post(`/lessons/${lessonId}/complete`);
      setCompleted(true);
      toast.success("Hoàn thành bài học! +10 điểm");
    } catch {
      toast.error("Lỗi đánh dấu hoàn thành");
    }
  };

  const handleBookmark = async () => {
    const { data } = await api.post(`/lessons/${lessonId}/bookmark`);
    toast.success(data.bookmarked ? "Đã bookmark" : "Đã bỏ bookmark");
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const { data } = await api.post(`/lessons/${lessonId}/notes`, { content: newNote });
      setNotes([data, ...notes]);
      setNewNote("");
    } catch {
      toast.error("Lỗi lưu ghi chú");
    }
  };

  const goToLesson = (lid: number) => navigate(`/learn/${courseId}/${lid}`);

  const toggleModule = (mid: number) => {
    const next = new Set(expandedModules);
    if (next.has(mid)) next.delete(mid); else next.add(mid);
    setExpandedModules(next);
  };

  return (
    <div className="flex h-[calc(100vh-56px)]">
      {/* Main Video/Content */}
      <div className="flex-1 overflow-y-auto">
        {currentLesson?.video_url ? (
          <div className="aspect-video bg-black">
            <iframe
              src={currentLesson.video_url}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={currentLesson.title}
            />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-8">
            <div className="prose max-w-none">
              <h1 className="text-2xl font-bold text-white mb-4">{currentLesson?.title}</h1>
              <div className="text-gray-300 whitespace-pre-line">{currentLesson?.content}</div>
            </div>
          </div>
        )}

        {/* Below video */}
        <div className="bg-gray-800 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">{currentLesson?.title}</h2>
              <div className="flex items-center gap-2">
                <button onClick={handleBookmark} className="p-2 text-gray-400 hover:text-yellow-400 transition-colors" title="Bookmark">
                  <FiBookmark />
                </button>
                {currentLesson?.attachment_url && (
                  <a href={currentLesson.attachment_url} className="p-2 text-gray-400 hover:text-green-400 transition-colors" title="Tải tài liệu">
                    <FiDownload />
                  </a>
                )}
              </div>
            </div>

            {currentLesson?.video_url && currentLesson?.content && (
              <p className="text-gray-400 mb-4">{currentLesson.content}</p>
            )}

            <button onClick={handleComplete} disabled={completed}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${completed ? "bg-green-600 text-white cursor-default" : "bg-primary-600 hover:bg-primary-700 text-white"}`}>
              <FiCheck /> {completed ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
        <div className="flex border-b border-gray-700">
          <button onClick={() => setSidebarTab("lessons")}
            className={`flex-1 py-3 text-sm font-medium ${sidebarTab === "lessons" ? "text-white border-b-2 border-primary-500" : "text-gray-400"}`}>
            Nội dung
          </button>
          <button onClick={() => setSidebarTab("notes")}
            className={`flex-1 py-3 text-sm font-medium ${sidebarTab === "notes" ? "text-white border-b-2 border-primary-500" : "text-gray-400"}`}>
            Ghi chú
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sidebarTab === "lessons" ? (
            <div>
              {modules.map((mod) => (
                <div key={mod.id}>
                  <button onClick={() => toggleModule(mod.id)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-750 hover:bg-gray-700 text-left">
                    <span className="text-sm font-medium text-gray-200">{mod.title}</span>
                    {expandedModules.has(mod.id) ? <FiChevronDown className="text-gray-400" /> : <FiChevronRight className="text-gray-400" />}
                  </button>
                  {expandedModules.has(mod.id) && mod.sections.map((sec) => (
                    <div key={sec.id}>
                      <div className="px-4 py-1.5 text-xs text-gray-500 font-medium uppercase">{sec.title}</div>
                      {sec.lessons.map((lesson) => (
                        <button key={lesson.id} onClick={() => goToLesson(lesson.id)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${lesson.id === Number(lessonId) ? "bg-primary-900/50 text-primary-300" : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"}`}>
                          {lesson.lesson_type === "video" ? <FiPlay className="flex-shrink-0 text-xs" /> : <FiFileText className="flex-shrink-0 text-xs" />}
                          <span className="text-sm flex-1 line-clamp-1">{lesson.title}</span>
                          <span className="text-xs">{lesson.duration_minutes}m</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)}
                className="w-full bg-gray-700 text-white border-gray-600 rounded-lg p-3 text-sm focus:ring-primary-500 focus:border-primary-500 outline-none" rows={3} placeholder="Thêm ghi chú..." />
              <button onClick={handleAddNote} className="btn-primary w-full mt-2 text-sm py-2">Lưu ghi chú</button>
              <div className="mt-4 space-y-3">
                {notes.map((n) => (
                  <div key={n.id} className="bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-200">{n.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(n.created_at).toLocaleDateString("vi-VN")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
