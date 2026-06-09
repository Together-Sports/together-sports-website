import { Link, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEditableContent } from "@/lib/editable-content";

const Layout = () => {
  const { isAuthenticated, authLoading, isLoadingContent } = useEditableContent();
  const isLocalViteDev =
    import.meta.env.DEV && typeof window !== "undefined" && window.location.port === "8081";
  const showEditModeButton = isLocalViteDev || (!authLoading && isAuthenticated);

  if (isLoadingContent) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>
      {showEditModeButton ? (
        <Link
          to="/admin"
          className="fixed bottom-5 right-5 z-50 px-4 py-3 bg-[#020367] text-white font-heading font-bold uppercase tracking-wider text-sm shadow-lg hover:scale-105 transition-transform"
        >
          Edit Mode
        </Link>
      ) : null}
      <Footer />
    </div>
  );
};

export default Layout;
