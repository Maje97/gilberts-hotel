import { Outlet } from "react-router-dom";

import Header from "../components/Header.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";

export default function Layout() {
    return (
        <div className="flex h-screen flex-col justify-between">
            <div>
                <Header />
                <Navbar />
            </div>
            <Outlet />
            <Footer />
        </div>
    );
}