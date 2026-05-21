import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useAppStore } from "./store";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import LoadingState from "./components/ui/LoadingState";

// Lazy-loaded pages (code splitting)
const Login = lazy(() => import("./pages/auth/Login"));
const Overview = lazy(() => import("./pages/Overview"));
const Products = lazy(() => import("./pages/Products"));
const Categories = lazy(() => import("./pages/categories/Categories"));
const Orders = lazy(() => import("./pages/orders/Orders"));
const Blogs = lazy(() => import("./pages/blogs/Blogs"));
const Banners = lazy(() => import("./pages/banners/Banners"));
const System = lazy(() => import("./pages/System"));

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
};

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "Dashboard";

  return (
    <div className="flex min-h-screen w-full bg-off-white">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col pl-64">
        <Header title={title} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
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
      <BrowserRouter basename="/admin">
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
            path="/blogs"
            element={
              <ProtectedRoute>
                <Blogs />
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
