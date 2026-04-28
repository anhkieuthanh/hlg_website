export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  phone: string;
  position: string;
  role: "admin" | "student";
  is_active: boolean;
  department_id: number | null;
  department_name: string | null;
  points: number;
  created_at: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string;
  level: "beginner" | "intermediate" | "advanced";
  is_published: boolean;
  is_sequential: boolean;
  duration_minutes: number;
  deadline: string | null;
  access_days: number | null;
  category_id: number | null;
  category_name: string | null;
  created_at: string;
  updated_at: string;
  enrollment_count: number;
  avg_rating: number;
  module_count: number;
}

export interface Module {
  id: number;
  title: string;
  order: number;
  course_id: number;
  sections: Section[];
}

export interface Section {
  id: number;
  title: string;
  order: number;
  module_id: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  lesson_type: "video" | "text" | "slide" | "mixed";
  content: string;
  video_url: string;
  duration_minutes: number;
  order: number;
  section_id: number;
  attachment_url: string;
  attachment_name: string;
  completed: boolean;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  enrolled_at: string;
  completed_at: string | null;
  course_title: string;
  course_thumbnail: string;
  progress_percent: number;
}

export interface Review {
  id: number;
  user_id: number;
  user_name: string;
  course_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Quiz {
  id: number;
  title: string;
  lesson_id: number;
  passing_score: number;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: number;
  question_text: string;
  quiz_type: "multiple_choice" | "true_false" | "short_answer";
  options: string;
  points: number;
  order: number;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  badge_type: string;
  points_value: number;
  earned_at?: string;
}

export interface LeaderboardEntry {
  user_id: number;
  full_name: string;
  avatar_url: string;
  department_name: string | null;
  points: number;
  badges_count: number;
  rank: number;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  order: number;
  course_id: number | null;
  is_global: boolean;
}

export interface QAQuestion {
  id: number;
  user_id: number;
  user_name: string;
  course_id: number;
  title: string;
  body: string;
  is_resolved: boolean;
  created_at: string;
  answers: QAAnswer[];
}

export interface QAAnswer {
  id: number;
  user_id: number;
  user_name: string;
  body: string;
  is_accepted: boolean;
  created_at: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  event_date: string;
  course_id: number | null;
  user_id: number | null;
  is_global: boolean;
}

export interface Bookmark {
  id: number;
  lesson_id: number;
  lesson_title: string;
  created_at: string;
}

export interface Note {
  id: number;
  lesson_id: number;
  content: string;
  timestamp_seconds: number | null;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  total_courses: number;
  total_enrollments: number;
  total_completions: number;
  active_users_30d: number;
}
