import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import LoadingState from "./components/ui/LoadingState";
import { useAppStore } from "./store";

// Lazy-loaded pages (code splitting)
const Login = lazy(() => import("./pages/auth/Login"));
const Overview = lazy(() => import("./pages/overview/Overview"));
const Products = lazy(() => import("./pages/products/Products"));
const Categories = lazy(() => import("./pages/categories/Categories"));
const Orders = lazy(() => import("./pages/orders/Orders"));
const Blogs = lazy(() => import("./pages/blogs/Blogs"));
const Banners = lazy(() => import("./pages/banners/Banners"));
const System = lazy(() => import("./pages/system/System"));
const Coupons = lazy(() => import("./pages/coupons/Coupons"));
const Shipping = lazy(() => import("./pages/shipping/Shipping"));
const WhatsAppCustomers = lazy(
  () => import("./pages/whatsapp-customers/WhatsAppCustomers"),
);
const AbandonedCheckouts = lazy(
  () => import("./pages/abandoned-checkouts/AbandonedCheckouts"),
);
const Mails = lazy(() => import("./pages/mails/Mails"));
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const PAGE_TITLES = {
  "/": "Overview",
  "/products": "Product Catalog",
  "/categories": "Categories",
  "/orders": "Orders",
  "/blogs": "Blogs",
  "/banners": "Banners",
  "/system": "System & Admins",
  "/coupons": "Coupons",
  "/shipping": "Shipping",
  "/customers": "Customers",
  "/mails": "Mails (Contact Us)",
  "/abandoned-checkouts": "Abandoned Checkouts",
};

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "Dashboard";

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-off-white">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = useAppStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return (
    <DashboardLayout>
      <Suspense fallback={<LoadingState />}>{children}</Suspense>
    </DashboardLayout>
  );
};

const PublicRoute = ({ children }) => {
  const token = useAppStore((s) => s.token);
  if (token) return <Navigate to="/" replace />;
  return <Suspense fallback={<LoadingState />}>{children}</Suspense>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <WhatsAppCustomers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/abandoned-checkouts"
            element={
              <ProtectedRoute>
                <AbandonedCheckouts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs"
            element={
              <ProtectedRoute>
                <Blogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shipping"
            element={
              <ProtectedRoute>
                <Shipping />
              </ProtectedRoute>
            }
          />
          <Route
            path="/banners"
            element={
              <ProtectedRoute>
                <Banners />
              </ProtectedRoute>
            }
          />
          <Route
            path="/system"
            element={
              <ProtectedRoute>
                <System />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coupons"
            element={
              <ProtectedRoute>
                <Coupons />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mails"
            element={
              <ProtectedRoute>
                <Mails />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "#ffffff",
            color: "#2d2d2d",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: "12px",
            fontSize: "14px",
            fontFamily: "Poppins, sans-serif",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          },
          success: { iconTheme: { primary: "#68bc52", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
    </QueryClientProvider>
  );
};

export default App;
