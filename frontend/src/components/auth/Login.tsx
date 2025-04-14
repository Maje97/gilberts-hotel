import Button from "../Button";

export default function Login() {
    return (
        <div className="flex flex-col w-64 p-4 space-y-2 items-center border-2 border-black">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <Button variant="primary">Login</Button>
        </div>
    );
}