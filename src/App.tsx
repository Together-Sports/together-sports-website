import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { EditableContentProvider, useEditableContent } from "@/lib/editable-content";
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
import GetInvolvedPage from "./pages/GetInvolvedPage";
import ContactPage from "./pages/ContactPage";
import PartnersPage from "./pages/PartnersPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isLoadingContent } = useEditableContent();

  if (isLoadingContent) {
    return <SiteLoadingScreen />;
  }

  return (
    <TooltipProvider>
      <IntroVideo />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Seo />
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
            <Route path="/get-involved" element={<GetInvolvedPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/partners" element={<PartnersPage />} />
          </Route>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <EditableContentProvider>
      <AppRoutes />
    </EditableContentProvider>
  </QueryClientProvider>
);

export default App;
