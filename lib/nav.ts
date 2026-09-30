import {
  CalendarCheck,
  UserCheck,
  LayoutDashboard,
  Megaphone,
} from "lucide-react";

import type { NavItem } from "@/components/portal/app-shell";

export const adminNav: NavItem[] = [
  { href: "/overview", labelKey: "nav.overview", icon: LayoutDashboard },
  { href: "/accounts", labelKey: "nav.accounts", icon: UserCheck },
  { href: "/attendance", labelKey: "nav.attendance", icon: CalendarCheck },
  { href: "/announcements", labelKey: "nav.comms", icon: Megaphone },
];
