import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { IRoom, IRoomList } from "../interfaces";
import CircularProgress from '@mui/material/CircularProgress';

export default function RoomList() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const [data, setData] = useState<IRoomList>();

    useEffect(() => {
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
                } catch (error) {
                    console.error('Fetch error:', error);
                } finally {
                    setIsLoading(false)
                }
            } else {
                return ("Error");
            }
        }
        console.log("useEffect ran.");
        fetchData();
    }, [user]);

    return (
        <main className={`flex flex-col items-center space-y-4 ${isLoading && "cursor-progress"}`}>
            <h1 className="text-2xl">List of rooms</h1>
            {isLoading && <CircularProgress />}
            <div className="flex flex-row flex-wrap w-full p-4 space-x-2 space-y-2">
                {!isLoading && data?.rooms.map((value: IRoom) => (
                    <div 
                        key={Math.random()} 
                        className="p-2 w-40 h-min flex flex-col justify-center text-center rounded-md shadow hover:bg-slate-300 hover:cursor-pointer" 
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