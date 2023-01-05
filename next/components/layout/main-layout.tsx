import Footer from "./footer";
import TopNavbar from "./navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <TopNavbar />
      <div className='container'>{children}</div>
      <Footer />
    </main>
  );
}
