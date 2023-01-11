import Footer from "./footer";
import TopNavbar from "./navbar";
import { AuthCtxProvider } from "../../context/auth/store";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthCtxProvider>
      <main>
        <TopNavbar />
        <div className='container pt-3' style={{ minHeight: "84vh" }}>
          {children}
        </div>
        <Footer />
      </main>
    </AuthCtxProvider>
  );
}
