/* eslint-disable @next/next/no-head-element */
import "./bootstrap.css";
import "./global.css";
import "./tippy.css";
import MainLayout from "../src/components/layout/main-layout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head></head>
      <body>
        {/* @ts-expect-error Server Component */}
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
