import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatPage from './pages/Chat';
import DoctorAppointments from './pages/doctor/Appointments';
import StorePage from './pages/store/Store';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<h1>About Page</h1>} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path = "/appointment" element={<DoctorAppointments/>}/>
        <Route path = "/store" element={<StorePage/>}/>

      </Routes>
    </Router>
  )
}

export default App
