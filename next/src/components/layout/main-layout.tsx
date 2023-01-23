import Footer from "./footer";
import TopNavbar from "./navbar";
import { AuthCtxProvider } from "../../context/auth/store";
import { HskCtxProvider } from "../../context/hsk/store";
import { AlertCtxProvider } from "../../context/alerts/store";

import AlertBox from "../alerts/alert-box";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthCtxProvider>
      <HskCtxProvider>
        <AlertCtxProvider>
          <main>
            <TopNavbar />
            <div className='container pt-3' style={{ minHeight: "84vh" }}>
              <AlertBox />
              {children}
            </div>
            <Footer />
          </main>
        </AlertCtxProvider>
      </HskCtxProvider>
    </AuthCtxProvider>
  );
}
