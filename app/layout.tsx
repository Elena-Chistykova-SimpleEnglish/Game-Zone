import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Play Zone — три игры, один клик",
  description: "Яркая аркадная витрина с тремя мини-играми.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
