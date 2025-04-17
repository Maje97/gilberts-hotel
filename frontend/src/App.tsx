import { Route, Routes, Navigate } from 'react-router';
import Layout from './pages/Layout';
import Login from './pages/Login';
import About from './pages/About';
import { useAuth } from './hooks/useAuth';
import { ReactNode } from 'react';
import Dashboard from './pages/Dashboard';
//import socket from "./socket";

/*
socket.on("booking-created", (data) => {
  console.log("New booking:", data);
});

socket.on("booking-updated", (data) => {
  console.log("Booking updated:", data);
});
*/
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App
