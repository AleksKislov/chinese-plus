/* eslint-disable @next/next/no-head-element */

import Footer from "../components/layout/footer";
import "bootstrap/dist/css/bootstrap.css";
import "./global.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head></head>
      <body>
        <main>
          <nav>haha</nav>
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
