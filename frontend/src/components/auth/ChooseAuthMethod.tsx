import { useState } from "react";
import Button from "../Button";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";

export default function ChooseAuthMethod() {
    const [method, setMethod] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const fetchData = async (URL: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Login successful:', data);
            if (data.id && data.username && data.role && data.token) {
                login(data);
                navigate('/home');
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false)
        }
    }

    if (method === "login") {
        return (
            <div className={`flex flex-col w-64 p-4 space-y-2 items-center border-2 border-black ${isLoading && "cursor-progress"}`}>
                <h2 className="text-xl font-semibold mb-4">Login</h2>
                <input type="text" id="lusername" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                <input type="text" id="lpassword" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                <Button variant="primary" isLoading={isLoading} onClick={() => fetchData('https://gilberts-hotel-167477665950.europe-north2.run.app/user/login')}>Login</Button>
                <Button variant="tertiary" onClick={() => setMethod("")}>Back</Button>
            </div>
        );
    } else if (method === "register") {
        return (
            <div className="flex flex-col w-64 p-4 space-y-2 items-center border-2 border-black">
                <h2 className="text-xl font-semibold mb-4">Register</h2>
                <input type="text" id="rusername" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                <input type="text" id="rpassword" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                <Button variant="primary" isLoading={isLoading} onClick={() => fetchData('https://gilberts-hotel-167477665950.europe-north2.run.app/user')}>Register</Button>
                <Button variant="tertiary" onClick={() => setMethod("")}>Back</Button>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col w-64 p-4 space-y-2 items-center border-2 border-black">
                <h2 className="text-xl font-semibold mb-4">Login or register</h2>
                <Button variant="primary" onClick={() => setMethod("login")}>Login</Button>
                <Button variant="primary" onClick={() => setMethod("register")}>Register</Button>
            </div>
        );
    }
    
}