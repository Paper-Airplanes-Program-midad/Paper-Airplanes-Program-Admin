import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    initials: string;
    timezone: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      initials: string;
      timezone: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    initials: string;
    timezone: string;
  }
}
