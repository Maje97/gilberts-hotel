import ChooseAuthMethod from "../components/auth/ChooseAuthMethod";

export default function Home() {
    return (
        <main>
            <h1>Hello</h1>
            <p className="text-3xl font-bold underline">Home</p>
            <ChooseAuthMethod />
        </main>
    );
}