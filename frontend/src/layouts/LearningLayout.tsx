import { Link } from "react-router-dom";
import { FiArrowLeft, FiBookOpen } from "react-icons/fi";
import { ReactNode } from "react";

export default function LearningLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 border-b border-gray-700 h-14 flex items-center px-4 gap-4">
        <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
          <FiArrowLeft className="text-xl" />
        </Link>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-600 rounded flex items-center justify-center">
            <FiBookOpen className="text-white text-sm" />
          </div>
          <span className="font-semibold text-white text-sm">HLG Academy</span>
        </Link>
      </header>
      {children}
    </div>
  );
}
