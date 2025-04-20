import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import CircularProgress from '@mui/material/CircularProgress';
import { IBooking, IBookingList } from "../interfaces";

export default function BookingList() {
    const URL = "https://gilberts-hotel-167477665950.europe-north2.run.app";
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const [data, setData] = useState<IBookingList>();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            if (user?.token) {
                try {
                    const response = await fetch(URL + '/booking/', {
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
                    console.log(newData);
                    setData(newData);
                } catch (error) {
                    console.error('Fetch error:', error);
                } finally {
                    setIsLoading(false)
                }
            } else {
                return console.log("Error");
            }
        }
        console.log("useEffect ran.");
        fetchData();
    }, [user]);

    return (
        <main className={`flex flex-col items-center space-y-4 ${isLoading && "cursor-progress"}`}>
            <h1 className="text-2xl">List of bookings</h1>
            {isLoading && <CircularProgress />}
            <div className="flex flex-col w-svw p-4 space-y-2">
                {!isLoading && data?.bookings.map((value: IBooking) => (
                    <div 
                        key={Math.random()} 
                        className="p-2 h-min flex flex-row flex-grow justify-around text-center rounded-md shadow hover:bg-slate-300 hover:cursor-pointer" 
                        onClick={() => navigate(`/bookings/${value.id}`)}
                    >
                        <p>Booking# <br/> {value.id}</p>
                        <p>Room# <br/> {value.roomId}</p>
                        <p>User# <br/> {value.userId}</p>
                        <p>Start: <br/> {value.startTime.toString().split("T")[0]}</p>
                        <p>End: <br/> {value.endTime.toString().split("T")[0]}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}