import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import ChangePasswordPage from "./components/NewPswrd";
import WatchMoviePage from "./components/WatchMovie";
import WatchListPage from "./components/WatchList";
import WatchHistoryPage from "./components/WatchHistory";
import LandingPage from "./components/Intro";
import ProtectedRoute from "./components/ProtectedRoute"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/new_pswrd" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
        <Route path="/watch/:id" element={<ProtectedRoute><WatchMoviePage /></ProtectedRoute>} />
        <Route path="/watchlist" element={<ProtectedRoute><WatchListPage /></ProtectedRoute>} />
        <Route path="/watchhistory" element={<ProtectedRoute><WatchHistoryPage /></ProtectedRoute>} />
  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
