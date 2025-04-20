import { useAuth } from "../hooks/useAuth";

export default function Home() {
    const { user } = useAuth();
      
    return (
        <main>
            <h1 className="text-2xl">Welcome {user?.username}!</h1>
        </main>
    );
}