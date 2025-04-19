import { useAuth } from "../hooks/useAuth";
import socket from "../socket";

export default function Home() {
    const { user } = useAuth();

    socket.on("login", (data) => {
        console.log("Login:", data);
    });
      
    return (
        <main>
            <h1 className="text-2xl">Welcome {user?.username}!</h1>
        </main>
    );
}