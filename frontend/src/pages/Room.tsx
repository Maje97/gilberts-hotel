import { useParams } from "react-router";

export default function Room() {
    const { id } = useParams();

    return (
        <main>
            <h1>Room {id}</h1>
        </main>
    );
}