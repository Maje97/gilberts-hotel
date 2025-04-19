import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import { useAuth } from "../hooks/useAuth";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import socket from "../socket";

socket.on("booking-created", (data) => {
  console.log("New booking:", data);
});

socket.on("booking-updated", (data) => {
  console.log("Booking updated:", data);
});

socket.on("booking-deleted", (data) => {
  console.log("Booking deleted:", data);
});

export default function Layout() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen justify-between">
      {user && <NavBar /> || <Hero />}
      <div className="flex flex-col my-4 items-center">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}