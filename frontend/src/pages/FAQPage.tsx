import { useEffect, useState } from "react";
import api from "../api";
import type { FAQItem } from "../types";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";

export default function FAQPage() {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    api.get<FAQItem[]>("/faq").then((r) => setItems(r.data));
  }, []);

  const toggle = (id: number) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpanded(next);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <FiHelpCircle className="text-5xl text-primary-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">Câu hỏi thường gặp</h1>
        <p className="text-gray-500 mt-1">Những thắc mắc phổ biến về Hoàng Long Group Academy</p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button onClick={() => toggle(item.id)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
              <span className="font-medium text-gray-900 pr-4">{item.question}</span>
              <FiChevronDown className={`flex-shrink-0 text-gray-400 transition-transform ${expanded.has(item.id) ? "rotate-180" : ""}`} />
            </button>
            {expanded.has(item.id) && (
              <div className="px-5 pb-5 pt-0">
                <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
