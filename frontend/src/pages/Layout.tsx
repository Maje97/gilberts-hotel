import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import { useAuth } from "../hooks/useAuth";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

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