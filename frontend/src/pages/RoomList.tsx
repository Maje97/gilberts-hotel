import { useNavigate } from "react-router";

export default function RoomList() {
    const navigate = useNavigate();

    return (
        <main>
            <h1>List of rooms</h1>
            <ol>
                <li onClick={() => navigate("/rooms/1")}>1</li>
                <li onClick={() => navigate("/rooms/2")}>2</li>
                <li onClick={() => navigate("/rooms/3")}>3</li>
            </ol>
        </main>
    );
}