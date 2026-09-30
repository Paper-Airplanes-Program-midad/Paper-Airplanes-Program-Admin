import type { Metadata } from "next";

import { SignInView } from "./sign-in-view";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to the Paper Airplanes admin portal to manage attendance and announcements.",
};

export default function SignInPage() {
  return <SignInView />;
}
