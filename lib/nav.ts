import {
  CalendarCheck,
  UserCheck,
  LayoutDashboard,
  Link2,
  Megaphone,
} from "lucide-react";

import type { NavItem } from "@/components/portal/app-shell";

export const adminNav: NavItem[] = [
  { href: "/overview", labelKey: "nav.overview", icon: LayoutDashboard },
  { href: "/accounts", labelKey: "nav.accounts", icon: UserCheck },
  { href: "/pairs", labelKey: "nav.pairs", icon: Link2 },
  { href: "/attendance", labelKey: "nav.attendance", icon: CalendarCheck },
  { href: "/announcements", labelKey: "nav.comms", icon: Megaphone },
];
