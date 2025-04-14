import Button from "../Button";

export default function Register() {
    return (
        <div className="flex flex-col w-64 p-4 space-y-2 items-center border-2 border-black">
            <h2 className="text-xl font-semibold mb-4">Register</h2>
            <Button variant="primary">Register</Button>
        </div>
    );
}