import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import type { LeaderboardEntry } from "../types";
import { FiAward } from "react-icons/fi";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    api.get<LeaderboardEntry[]>("/users/leaderboard?limit=50").then((r) => setEntries(r.data));
  }, []);

  const medalColors = ["text-yellow-500", "text-gray-400", "text-amber-600"];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Bảng xếp hạng</h1>

      {/* Top 3 */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[entries[1], entries[0], entries[2]].map((e, i) => {
            const rank = [2, 1, 3][i];
            return (
              <div key={e.user_id} className={`bg-white rounded-xl border-2 p-5 text-center ${rank === 1 ? "border-yellow-400 -mt-4" : "border-gray-200 mt-4"}`}>
                <div className={`text-3xl mb-2 ${medalColors[rank - 1]}`}>
                  {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                </div>
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold mx-auto mb-2">
                  {e.full_name.charAt(0)}
                </div>
                <p className="font-semibold text-sm">{e.full_name}</p>
                <p className="text-xs text-gray-500">{e.department_name}</p>
                <p className="text-lg font-bold text-amber-600 mt-1">{e.points} điểm</p>
                <p className="text-xs text-gray-400"><FiAward className="inline" /> {e.badges_count} huy hiệu</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Học viên</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Phòng ban</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Điểm</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Huy hiệu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((e) => (
              <tr key={e.user_id} className={`${e.user_id === user?.id ? "bg-primary-50" : "hover:bg-gray-50"} transition-colors`}>
                <td className="px-4 py-3 text-sm font-medium text-gray-500">{e.rank}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-semibold">
                      {e.full_name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{e.full_name}</span>
                    {e.user_id === user?.id && <span className="text-xs bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded">Bạn</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{e.department_name || "—"}</td>
                <td className="px-4 py-3 text-sm font-semibold text-amber-600 text-right">{e.points}</td>
                <td className="px-4 py-3 text-sm text-gray-500 text-right">{e.badges_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
