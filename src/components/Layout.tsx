import { Link, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEditableContent } from "@/lib/editable-content";
import { Skeleton } from "./ui/skeleton";

const Layout = () => {
  const { isAuthenticated, authLoading, isLoadingContent } = useEditableContent();
  const isLocalViteDev =
    import.meta.env.DEV && typeof window !== "undefined" && window.location.port === "8081";
  const showEditModeButton = isLocalViteDev || (!authLoading && isAuthenticated);

  if (isLoadingContent) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Skeleton Navbar */}
        <div className="h-16 md:h-20 bg-primary w-full" />
        
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {/* Skeleton Hero Section */}
          <div className="max-w-7xl mx-auto pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Skeleton className="h-20 w-3/4" />
                <Skeleton className="h-20 w-1/2" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <div className="flex gap-4 pt-4">
                  <Skeleton className="h-14 w-40" />
                  <Skeleton className="h-14 w-40" />
                </div>
              </div>
              <Skeleton className="h-[400px] w-full rounded-none" />
            </div>
          </div>

          {/* Skeleton Content Block */}
          <div className="max-w-7xl mx-auto py-12 space-y-8">
            <Skeleton className="h-12 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
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
