import type { L } from "@/lib/i18n";

export type User = {
  id: string;
  role: string;
  name: string;
  email: string;
  initials: string;
  timezone: string;
  status: "new" | "pending" | "active" | "rejected" | "suspended";
  createdUtc: string;
};

export type Session = {
  id: string;
  week: number;
  startUtc: string;
  endUtc: string;
  minutes: number | null;
  level: string;
  unitNo: number;
  topic: L;
  notes: L | null;
  status: "scheduled" | "completed" | "cancelled" | "missed";
  joinUrl: string;
  studentName?: string;
  tutorName?: string;
  studentId?: string;
  tutorId?: string;
  semester?: string;
  scheduleId?: string;
  makeup?: boolean;
  joins?: SessionJoin[];
};

export type SessionJoin = { by: "student" | "tutor"; atUtc: string };

export type Schedule = {
  id: string;
  semester: string;
  studentName: string;
  tutorName: string;
  studentId: string;
  tutorId: string;
  startDate: string;
  time: string;
  timezone: string;
  minutes: number;
  joinUrl: string;
  updatedUtc: string;
};

export type HomeworkFile = {
  id: string;
  name: string;
  kind: "pdf" | "doc" | "image" | "audio";
  sizeKb: number;
};

export type Rubric = {
  id: string;
  criterion: L;
  max: number;
  points: number | null;
};

export type Assignment = {
  id: string;
  sessionId: string;
  title: L;
  instructions: L;
  files: HomeworkFile[];
  assignedUtc: string;
  dueUtc: string;
  status: "not_started" | "submitted" | "late" | "graded";
  maxScore: number;
  score: number | null;
  feedback: string | null;
  studentName: string;
  studentId: string;
  seen: boolean;
  answer?: string | null;
  submittedUtc?: string | null;
  gradedUtc?: string | null;
  rubric: Rubric[];
};

export type LessonFlag = { noHomework: boolean; decidedUtc: string };
export type LessonFlags = Record<string, LessonFlag>;

export type CheckIn = {
  id: string;
  semester: string;
  week: number;
  by: "student" | "tutor";
  studentName: string;
  tutorName: string;
  studentId: string;
  tutorId: string;
  held: boolean;
  minutes: number | null;
  reason: string | null;
  note: string | null;
  submittedUtc?: string;
  editedUtc?: string;
  editedBy?: string;
};

export type AbsenceReason = {
  value: string;
  side: "student" | "tutor";
  label: L;
};

export type SemesterWeek = { week: number; start: string; end: string };

export type StoredSemester = {
  id: string;
  name: L;
  start: string;
  end: string;
  absenceReasons: AbsenceReason[];
};

export type Semester = StoredSemester & {
  currentWeek: number;
  weeks: SemesterWeek[];
};

export type Pair = {
  pairId: string;
  student: string;
  studentLevel: string;
  studentTz: string;
  tutor: string;
  tutorTz: string;
  status: "active" | "paused" | "rematching";
  attendanceRate: number;
  health: "good" | "watch" | "at_risk";
  ungraded: number;
  studentId: string;
  tutorId: string;
};

export type Incident = {
  id: string;
  reference: string;
  type: "safeguarding" | "plagiarism" | "conduct" | "technical";
  severity: "low" | "medium" | "high" | "critical";
  pair: string;
  status: "open" | "investigating" | "resolved";
  createdUtc: string;
  summary: L;
  reportedBy?: string;
};

export type TutorProfile = {
  id: string;
  name: string;
  initials: string;
  country: L;
  timezone: string;
  languages: string[];
  bio: L;
};

export type Enrollment = {
  programType: L;
  cohort: string;
  currentLevel: string;
  levels: {
    code: string;
    status: "completed" | "in_progress" | "locked";
    progress: number;
  }[];
  a2Units: { id: string; title: L; done: boolean }[];
  exams: {
    midterm: { status: string; scheduledAt: string; score: number | null };
    final: { status: string; scheduledAt: string; score: number | null };
  };
};

export type AttendanceSummary = {
  totalSessions: number;
  attended: number;
  missed: number;
  rate: number;
  streak: number;
  weeks: { week: string; status: "attended" | "missed" | "pending" }[];
};

export type Onboarding = {
  applicationStatus: string;
  steps: { key: string; label: L }[];
  conditional: {
    deadline: string;
    requirements: { id: string; label: L; done: boolean }[];
  };
  finalExam: { status: string; scheduledAt: string };
  waitingList: {
    onList: boolean;
    position: number;
    total: number;
    estimatedWaitWeeks: number;
    cohort: string;
  };
};

export type VocabWord = {
  id: string;
  term: string;
  translation: string;
  context: string;
  source: string;
  createdAt: string;
  box: number;
  lastReviewedAt: string | null;
};

export type Resource = {
  id: string;
  title: L;
  level: string;
  skill: string;
  minutes: number;
  downloads: number;
  bandwidth: string;
};

export type AnnouncementTemplate = { id: string; name: L; subject: L; body: L };

export type AnnouncementSent = {
  id: string;
  subject: L;
  body?: L;
  audience: string;
  sentUtc: string;
  sentBy?: string;
  recipientIds?: string[];
  recipients: number;
  openRate: number;
};

export type Announcement = { id: string; subject: L; body: L; sentUtc: string };

export type Analytics = {
  attendanceTrend: { week: string; rate: number }[];
  levelDistribution: { level: string; students: number }[];
};
