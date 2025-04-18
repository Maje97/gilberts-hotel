import { useNavigate } from "react-router";

export default function BookingList() {
    const navigate = useNavigate();

    return (
        <main>
            <h1>List of bookings</h1>
            <ol>
                <li onClick={() => navigate("/bookings/1")}>1</li>
                <li onClick={() => navigate("/bookings/2")}>2</li>
                <li onClick={() => navigate("/bookings/3")}>3</li>
            </ol>
        </main>
    );
}