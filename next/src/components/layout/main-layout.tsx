import Footer from "./footer";
// import TopNavbar from "./navbar";
// import { AuthCtxProvider } from "../../context/auth/store";
// import { HskCtxProvider } from "../../context/hsk/store";
// import { AlertCtxProvider } from "../../context/alerts/store";
import AlertBox from "../alerts/alert-box";
import { cookies as nextCookies } from "next/headers";
import { loadUser } from "../../context/auth/actions";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const cookies = nextCookies();
  const userFromBE = await loadUser(cookies?.get("token")?.value);

  return (
    // <AuthCtxProvider>
    //   <HskCtxProvider>
    //     <AlertCtxProvider>
    <main>
      {/* <TopNavbar userFromBE={userFromBE} /> */}
      <div className='container pt-3' style={{ minHeight: "84vh" }}>
        <AlertBox />
        {children}
      </div>
      <Footer />
    </main>
    //     </AlertCtxProvider>
    //   </HskCtxProvider>
    // </AuthCtxProvider>
  );
}
