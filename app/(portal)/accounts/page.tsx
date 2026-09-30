import type { Metadata } from "next";

import { AccountsView } from "./view";

export const metadata: Metadata = {
  title: "Accounts & applications",
  description:
    "Review new student and teacher applications, approve or reject them, and suspend accounts.",
};

export default function AccountsPage() {
  return <AccountsView />;
}
