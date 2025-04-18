import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Button from "./Button";

export default function NavBar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const LogoutAndNav = () => {
        logout();
        navigate("/");
    }

    return (
        <nav className="flex flex-row justify-between p-4 bg-linear-to-bl from-amber-400 to-white">
            <h3 className="text-lg font-semibold">Gilbert´s Hotel</h3>
            <ul className="flex flex-row list-none space-x-4 *:size-min *:p-2 *:rounded-md *:hover:cursor-pointer *:hover:text-amber-600 *:hover:underline *:hover:underline-offset-2 *:hover:bg-white">
                <li onClick={() => navigate("/home")}>Home</li>
                <li onClick={() => navigate("/rooms")}>Rooms</li>
                <li onClick={() => navigate("/bookings")}>Bookings</li>
                <li onClick={() => navigate("/about")}>About</li>
            </ul>
            <Button variant="secondary" onClick={() => LogoutAndNav()}>Log out</Button>
        </nav>
    );
}