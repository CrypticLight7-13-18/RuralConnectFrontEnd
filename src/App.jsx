import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Auth from "./pages/Auth";
import ChatPage from "./pages/Chat";
import MyAppointments from "./pages/MyAppointments";
import DoctorAppointments from './pages/doctor/Appointments';
import Navbar from "./pages/Nav";
import StorePage from './pages/store/Store';
import { OrderHistoryPage } from './pages/store/OrderHistory';
import "./App.css";

function AppContent() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/" && <Navbar />}
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/about" element={<h1>About Page</h1>} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path = "/appointment" element={<DoctorAppointments/>}/>
        <Route path = "/store" element={<StorePage/>}/>
        <Route path = "/store/order-history" element={<OrderHistoryPage/>}/>
        <Route path="/my-appointments" element={<MyAppointments />} />
      </Routes>
    </>
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