import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import ChatPage from "./pages/Chat";
import Navbar from "./pages/Nav";

function App() {
  return (
    <>
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
