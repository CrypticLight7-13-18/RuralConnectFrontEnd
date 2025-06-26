import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/Chat';
import MyAppointments from './pages/MyAppointments';
import Navbar from './pages/Nav';
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import ChatPage from "./pages/Chat";
import Navbar from "./pages/Nav";

function App() {
  return (
    <>
    <Navbar/>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<h1>About Page</h1>} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/my-appointments" element={<MyAppointments/>}/>
      </Routes>
    </Router>
    </>
  )
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/about" element={<h1>About Page</h1>} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
