import type { Metadata } from "next";

import { OverviewView } from "./view";

export const metadata: Metadata = {
  title: "Overview",
  description:
    "Monitor attendance trends and incidents.",
};

export default function OverviewPage() {
  return <OverviewView />;
}
