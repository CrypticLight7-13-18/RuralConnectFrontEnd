import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// ---------- Lazy-loaded pages ----------
const Auth = lazy(() => import("./pages/Auth"));
const ChatPage = lazy(() => import("./pages/Chat"));
const MyAppointments = lazy(() => import("./pages/MyAppointments"));
const DoctorAppointments = lazy(() => import("./pages/doctor/Appointments"));
const Navbar = lazy(() => import("./pages/Nav"));
const StorePage = lazy(() => import("./pages/store/Store"));
const OrderHistoryPage = lazy(() =>
  import("./pages/store/OrderHistory").then((m) => ({
    default: m.OrderHistoryPage,
  }))
);
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));
import AuthProvider from "./contexts/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/RouteGuards";
import "./App.css";

function AppContent() {
  const location = useLocation();
  const isAuth = location.pathname === "/";
  return (
    <div className={`h-screen ${isAuth ? "" : "flex flex-col"}`}>
      {!isAuth && <Navbar />}
      <div className={isAuth ? "" : "flex-1 flex"}>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            }
          />
          <Route path="/about" element={<h1>About Page</h1>} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointment"
            element={
              <ProtectedRoute>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/store"
            element={
              <ProtectedRoute>
                <StorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/store/order-history"
            element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute>
                <MyAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cancel"
            element={
              <ProtectedRoute>
                <PaymentCancel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen w-full text-darkBlue">
              Loading...
            </div>
          }
        >
          <AppContent />
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
