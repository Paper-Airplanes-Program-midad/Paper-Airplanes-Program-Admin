import type { Metadata } from "next";

import { PairsView } from "./view";

export const metadata: Metadata = {
  title: "Pairing",
  description: "Link each student with their teacher, change a student's teacher or remove the link.",
};

export default function PairsPage() {
  return <PairsView />;
}
