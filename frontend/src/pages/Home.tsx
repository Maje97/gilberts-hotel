import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import socket from "../socket";

export default function Home() {
    const { user } = useAuth();
    const [message, setMessage] = useState<string>("");

    socket.on("login", (data) => {
        console.log("Login:", data);
        setMessage(data);
      });
      
    
    return (
        <main>
            <h1 className="text-2xl">Welcome {user?.username}!</h1>
            <p>{message}</p>
        </main>
    );
}