import ChooseAuthMethod from "../components/auth/ChooseAuthMethod";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

export default function Login() {
    return (
        <div className="flex flex-col min-h-screen justify-between">
            <Hero />
            <main>
                <div className="w-full flex flex-col mt-4 items-center">
                    <ChooseAuthMethod />
                </div>
            </main>
            <Footer />
        </div>
    );
}