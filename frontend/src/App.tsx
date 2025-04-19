import { Route, Routes, Navigate } from 'react-router';
import { useAuth } from './hooks/useAuth';
import { ReactNode } from 'react';
import Layout from './pages/Layout';
import Login from './pages/Login';
import About from './pages/About';
import Home from './pages/Home';
import RoomList from './pages/RoomList';
import Room from './pages/Room';
import BookingList from './pages/BookingList';
import Booking from './pages/Booking';

const RedirectRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RedirectRoute><Login /></RedirectRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/rooms" element={<ProtectedRoute><RoomList /></ProtectedRoute>} />
        <Route path="/rooms/:id" element={<ProtectedRoute><Room /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><BookingList /></ProtectedRoute>} />
        <Route path="/bookings/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

export default App
