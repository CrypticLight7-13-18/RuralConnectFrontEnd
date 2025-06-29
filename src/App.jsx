import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Auth from "./pages/Auth";
import ChatPage from "./pages/Chat";
import MyAppointments from "./pages/MyAppointments";
import DoctorAppointments from "./pages/doctor/Appointments";
import Navbar from "./pages/Nav";
import StorePage from "./pages/store/Store";
import { OrderHistoryPage } from "./pages/store/OrderHistory";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
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
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
