import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EditableContentProvider, useEditableContent } from "@/lib/editable-content";
import type { EditableContentState } from "@/lib/editable-content-format";
import ScrollToTop from "./components/ScrollToTop";
import Seo from "./components/Seo";
import IntroVideo from "./components/IntroVideo";
import Layout from "./components/Layout";
import SiteLoadingScreen from "./components/SiteLoadingScreen";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import SportsPage from "./pages/SportsPage";
import SportDetailPage from "./pages/SportDetailPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ExperiencesPage from "./pages/ExperiencesPage";
import MomentsPage from "./pages/MomentsPage";
import PressPage from "./pages/PressPage";
import GetInvolvedPage from "./pages/GetInvolvedPage";
import ContactPage from "./pages/ContactPage";
import PartnersPage from "./pages/PartnersPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// The route table on its own (no router) so the build-time prerender can
// render it inside a StaticRouter while the app keeps using BrowserRouter.
export const SiteRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Index />} />
      <Route path="/team" element={<AboutPage />} />
      <Route path="/about" element={<Navigate to="/team" replace />} />
      <Route path="/sports" element={<SportsPage />} />
      <Route path="/sports/:sport" element={<SportDetailPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/experiences" element={<ExperiencesPage />} />
      <Route path="/moments" element={<MomentsPage />} />
      <Route path="/press" element={<PressPage />} />
      <Route path="/get-involved" element={<GetInvolvedPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/partners" element={<PartnersPage />} />
    </Route>
    <Route path="/admin" element={<AdminPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const AppRoutes = () => {
  const { isLoadingContent } = useEditableContent();

  // IntroVideo sits outside the loading gate so its overlay can cover the
  // screen from the very first paint, and so it isn't remounted (restarting
  // the video) when loading finishes.
  if (isLoadingContent) {
    return (
      <>
        <IntroVideo />
        <SiteLoadingScreen />
      </>
    );
  }

  return (
    <>
      <IntroVideo />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Seo />
          <SiteRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </>
  );
};

const App = ({ initialContent }: { initialContent?: EditableContentState }) => (
  <QueryClientProvider client={queryClient}>
    <EditableContentProvider initialContent={initialContent}>
      <AppRoutes />
    </EditableContentProvider>
  </QueryClientProvider>
);

export default App;
