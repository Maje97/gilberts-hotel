import ChooseAuthMethod from "../components/auth/ChooseAuthMethod";
import Hero from "../components/Hero";
// import { registerSocket } from "./socket";

/* const handleLogin = async () => {
  const res = await fetch("/api/login", { ...  });
  const user = await res.json();

  registerSocket(user.id);
}; */

export default function Login() {
    return (
        <main>
            <Hero />
            <div className="w-full flex flex-col mt-4 items-center">
                <ChooseAuthMethod />
            </div>
        </main>
    );
}