import { useParams } from "react-router";
import { IRoom } from "../interfaces";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import CircularProgress from '@mui/material/CircularProgress';
import Button from "../components/Button";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";


export default function Room() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const [data, setData] = useState<{room: IRoom}>();
    const now = dayjs();
    const [start, setStart] = useState<Dayjs | null>(now);
    const [end, setEnd] = useState<Dayjs | null>(now.add(1, 'day'));

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            if (user?.token) {
                try {
                    const response = await fetch(`https://gilberts-hotel-673663b70f08.herokuapp.com/room/${id}`, {
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
                return ("Error");
            }
        }
        console.log("useEffect ran.");
        fetchData();
    }, [user, id]);

    const handleBooking = async () => {
        if (user?.token) {
            try {
                const response = await fetch(`https://gilberts-hotel-673663b70f08.herokuapp.com/booking`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': user.token,  
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify({ 
                        room: Number(id), 
                        user: user.id, 
                        startTime: start, 
                        endTime: end 
                    })
                })

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response}`);
                }
                const newRes = await response.json();
                console.log(newRes);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
    }

    return (
        <main className={`flex flex-col items-center space-y-4 ${isLoading && "cursor-progress"}`}>
            {isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <h1 className="text-2xl">{data?.room.name}</h1>
                        <img src={data?.room.image} alt={`Image of ${data?.room.name}`} className="h-[50vh]" />
                        <p>
                            Capacity: {data?.room.capacity} <br/>
                            Type: {data?.room.type}
                        </p>
                        <div className="flex flex-col items-center p-4 space-y-4 border-2 rounded-md">
                            <h2 className="text-xl">Book room</h2>
                            <div>
                                <DatePicker 
                                    label="Start date"
                                    value={start}
                                    onChange={(newStart) => setStart(newStart)}
                                />
                                <DatePicker 
                                    label="End date"
                                    value={end}
                                    onChange={(newEnd) => setEnd(newEnd)}
                                />
                            </div>
                            <Button variant="primary" onClick={() => handleBooking()}>Book</Button>
                        </div>
                    </>
                )
            }
        </main>
    );
}