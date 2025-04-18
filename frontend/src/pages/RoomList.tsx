import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

interface Room {
    id: number | string;
    image: string;
    name: string;
    capacity: number | string;
    type: string;
}

interface IRoomList {
    rooms: Room[];
}

export default function RoomList() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const [data, setData] = useState<IRoomList>();

    const fetchData = async () => {
        setIsLoading(true);
        if (user?.token) {
            try {
                const response = await fetch('https://gilberts-hotel-673663b70f08.herokuapp.com/room/', {
                    method: 'GET',
                    headers: { 
                        'Authorization': user.token,  
                        'Content-Type': 'application/json', 
                    },
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response}`);
                }

                const newData = await response.json();
                setData(newData);
                console.log(data);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setIsLoading(false)
            }
        } else {
            return ("Error");
        }
    }

    return (
        <main className={`flex flex-col items-center ${isLoading && "cursor-progress"}`}>
            <h1>List of rooms</h1>
            <ol>
                <li onClick={() => navigate("/rooms/1")}>1</li>
                <li onClick={() => navigate("/rooms/2")}>2</li>
                <li onClick={() => navigate("/rooms/3")}>3</li>
                <li onClick={() => fetchData()}>Klicka för att fetcha rum</li>
                <li onClick={() => console.log(data)}>Klicka för att se rum i konsollen</li>
            </ol>
            <div className="flex flex-row flex-wrap w-full p-4 space-x-2 space-y-2">
                {data?.rooms.map((value: Room) => (
                    <div 
                        key={Math.random()} 
                        className="p-2 w-40 flex flex-col justify-center text-center shadow hover:bg-slate-300 hover:cursor-pointer" 
                        onClick={() => navigate(`/rooms/${value.id}`)}
                    >
                        <img src={value.image} alt={`Image of ${value.name}`} className="object-contain size-36"/>
                        <p>{value.name}</p>
                        <p>Capacity: {value.capacity}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}