import type { Metadata } from "next";

import { AnnouncementsView } from "./view";

export const metadata: Metadata = {
  title: "Announcements",
  description:
    "Compose bilingual announcements from templates, target a segment of learners or teachers, and review send history.",
};

export default function AnnouncementsPage() {
  return <AnnouncementsView />;
}
