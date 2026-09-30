"use client";

import type { ReactNode } from "react";

import { SuspendedScreen } from "@/components/portal/suspended";
import { PlaneMark } from "@/components/ui";
import { useApi } from "@/lib/api";
import { useRequireAuth } from "@/lib/auth";
import type { User } from "@/lib/types";

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { ready } = useRequireAuth();
  const { data: me } = useApi<{ user: User }>("/api/me");

  if (me?.user.status === "suspended") return <SuspendedScreen />;

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center">
        <PlaneMark className="h-10 w-10 animate-float" />
      </div>
    );
  }

  return <>{children}</>;
}
