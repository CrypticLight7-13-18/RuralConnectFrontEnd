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
import "./App.css";

function AppContent() {
  const location = useLocation();
  const isAuth = location.pathname === "/";
  return (
    <div className={`h-screen ${isAuth ? "" : "flex flex-col"}`}>
      {!isAuth && <Navbar />}
      <div className={isAuth ? "" : "flex-1 flex"}>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/about" element={<h1>About Page</h1>} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/appointment" element={<DoctorAppointments />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/store/order-history" element={<OrderHistoryPage />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/cancel" element={<PaymentCancel />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
