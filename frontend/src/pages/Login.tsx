import ChooseAuthMethod from "../components/auth/ChooseAuthMethod";

export default function Login() {
    return (
        <main>
            <div className="w-full flex flex-col mt-4 items-center">
                <ChooseAuthMethod />
            </div>
        </main>
    );
}