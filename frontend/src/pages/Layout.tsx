import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import { useAuth } from "../hooks/useAuth";
import Footer from "../components/Footer";

export default function Layout() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen justify-between">
      {user && <NavBar />}
      <div className="flex flex-col my-4 items-center">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}