import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import PlatformOverview from "./pages/PlatformOverview";
import PlatformSubpage from "./pages/PlatformSubpage";
import SolutionsOverview from "./pages/SolutionsOverview";
import SolutionDetail from "./pages/SolutionDetail";
import Architecture from "./pages/Architecture";
import Services from "./pages/Services";
import Products from "./pages/Products";
import Resources from "./pages/Resources";
import InsightDetail from "./pages/InsightDetail";
import Partners from "./pages/Partners";
import Company from "./pages/Company";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminInsights from "./pages/admin/AdminInsights";
import AdminInsightEditor from "./pages/admin/AdminInsightEditor";
import AdminFAQs from "./pages/admin/AdminFAQs";
import AdminNewsletter from "./pages/admin/AdminNewsletter";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
};

const SiteLayout = ({ children }) => (
  <div className="App min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const Site = () => (
  <SiteLayout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/platform" element={<PlatformOverview />} />
      <Route path="/platform/:slug" element={<PlatformSubpage />} />
      <Route path="/solutions" element={<SolutionsOverview />} />
      <Route path="/solutions/:slug" element={<SolutionDetail />} />
      <Route path="/architecture" element={<Architecture />} />
      <Route path="/services" element={<Services />} />
      <Route path="/products" element={<Products />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/:slug" element={<InsightDetail />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/company" element={<Company />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </SiteLayout>
);

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin: standalone layout, no public Header/Footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="insights" element={<AdminInsights />} />
              <Route path="insights/new" element={<AdminInsightEditor />} />
              <Route path="insights/:id" element={<AdminInsightEditor />} />
              <Route path="faqs" element={<AdminFAQs />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
            </Route>

            {/* Public site */}
            <Route path="*" element={<Site />} />
          </Routes>
          <Toaster position="bottom-right" richColors />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
