import type { Metadata } from "next";

import { AttendanceView } from "./view";

export const metadata: Metadata = {
  title: "Attendance",
  description:
    "Set the semester dates and review, compare and correct the weekly check-ins sent by students and teachers.",
};

export default function AttendancePage() {
  return <AttendanceView />;
}
