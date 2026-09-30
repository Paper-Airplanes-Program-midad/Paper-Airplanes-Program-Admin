import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { portal } from "@/lib/portal";
import { authenticate, type Role } from "@/lib/users";

const COOKIE_PREFIX = `pa.${portal.role}`;
const secure = process.env.NODE_ENV === "production";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/" },
  cookies: {
    sessionToken: {
      name: `${COOKIE_PREFIX}.session-token`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure },
    },
    callbackUrl: {
      name: `${COOKIE_PREFIX}.callback-url`,
      options: { sameSite: "lax", path: "/", secure },
    },
    csrfToken: {
      name: `${COOKIE_PREFIX}.csrf-token`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure },
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = String(credentials?.email ?? "");
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await authenticate(email, password, portal.role as Role);
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          initials: user.initials,
          timezone: user.timezone,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.initials = user.initials;
        token.timezone = user.timezone;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? session.user.id;
      session.user.role = token.role as string;
      session.user.initials = token.initials as string;
      session.user.timezone = token.timezone as string;
      return session;
    },
  },
});
