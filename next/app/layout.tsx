/* eslint-disable @next/next/no-head-element */
// import "bootstrap/dist/css/bootstrap.css";
import "./bootstrap.css";
import "./global.css";
import MainLayout from "../components/layout/main-layout";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head></head>
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
