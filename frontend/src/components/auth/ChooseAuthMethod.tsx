import Button from "../Button";

export default function ChooseAuthMethod() {
    return (
        <div className="flex flex-col w-64 p-4 space-y-2 items-center border-2 border-black">
            <h2 className="text-xl font-semibold mb-4">Login or register</h2>
            <Button variant="primary">Login</Button>
            <Button variant="primary">Register</Button>
        </div>
    );
}