import Head from "next/head";
import { useRouter } from "next/router";
import Footer from "./footer";
// import Navbar from "./navbar";

const Layout = ({ children }) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>With Cookies</title>
      </Head>

      {/* <Navbar /> */}
      <main>
        <section
          className={router.pathname === "/pinyin" ? "container-fluid" : "container"}
          id='mainSection'
        >
          {children}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Layout;
