import ChooseAuthMethod from "../components/auth/ChooseAuthMethod";
import Hero from "../components/Hero";

export default function Home() {
    return (
        <main>
            <Hero />
            <div className="w-full flex flex-col mt-4 items-center">
                <ChooseAuthMethod />
            </div>
        </main>
    );
}