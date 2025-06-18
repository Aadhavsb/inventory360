import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Wildlife SOS Inventory360",
  description: "Sign in to access the Wildlife SOS asset management system. Secure access for wildlife conservation professionals.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
