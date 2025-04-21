import { useParams } from "react-router";
import { IBooking, IRoom } from "../interfaces";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import CircularProgress from '@mui/material/CircularProgress';
import Button from "../components/Button";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";


export default function Room() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isBooking, setIsBooking] = useState<boolean>(false);
    const { user } = useAuth();
    console.log(user);
    const [data, setData] = useState<{room: IRoom}>();
    const now = dayjs();
    const [start, setStart] = useState<Dayjs | null>(now);
    const [end, setEnd] = useState<Dayjs | null>(now.add(1, 'day'));
    const [bookedRanges, setBookedRanges] = useState<
        { start: dayjs.Dayjs; end: dayjs.Dayjs }[]
    >([]);
    const singleIMG = "https://cdn.pixabay.com/photo/2016/04/15/11/43/hotel-1330834_1280.jpg";
    const doubleIMG = "https://cdn.pixabay.com/photo/2020/10/18/09/16/bedroom-5664221_1280.jpg";
    const familyIMG = "https://cdn.pixabay.com/photo/2021/12/18/06/00/room-6878004_1280.jpg";
    const [newUrl, setNewURL] = useState<string>(singleIMG);
    const [newName, setNewName] = useState<string>("");
    const [newCap, setNewCap] = useState<number>(1);
    const [newType, setNewType] = useState<string>("SINGLE");
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [reFetch, setReFetch] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            if (user?.token) {
                try {
                    const response = await fetch(`https://gilberts-hotel-167477665950.europe-north2.run.app/room/${id}`, {
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
                    setNewURL(newData.room.image);
                    setNewName(newData.room.name);
                    setNewCap(newData.room.capacity);
                    setNewType(newData.room.type);
                } catch (error) {
                    console.error('Fetch error:', error);
                } finally {
                    setIsLoading(false)
                }
            } else {
                return ("Error");
            }
        }

        const fetchAvailability = async (roomId: number) => {
            const res = await fetch(`https://gilberts-hotel-167477665950.europe-north2.run.app/room/availability/${roomId}`);
            const data = await res.json();
            setBookedRanges(data.bookings.map((b: IBooking) => ({
              start: new Date(b.startTime),
              end: new Date(b.endTime)
            })));
        };

        console.log("useEffect ran.");
        fetchData();
        fetchAvailability(Number(id));
    }, [user, id, reFetch]);

    const handleBooking = async () => {
        if (user?.token) {
            setIsBooking(true);
            try {
                const response = await fetch(`https://gilberts-hotel-167477665950.europe-north2.run.app/booking`, {
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
                    throw new Error(`HTTP error! status: ${response.toString()}`);
                }
                const newRes = await response.json();
                console.log(newRes);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setIsBooking(false);
            }
        }
    }

    const isDateInRange = (date: Dayjs, start: Dayjs, end: Dayjs) => {
        return date.isSame(start, 'day') || date.isSame(end, 'day') || (date.isAfter(start, 'day') && date.isBefore(end, 'day'));
    };

    const shouldDisableDate = (date: Dayjs) => {
        return bookedRanges.some(range =>
          isDateInRange(date, range.start, range.end)
        );
    };

    const handleEditRoom = async () => {
        if (user?.token) {
            setIsUpdating(true);
            try {
                const response = await fetch(`https://gilberts-hotel-167477665950.europe-north2.run.app/room/${id}`, {
                    method: 'PATCH',
                    headers: { 
                        'Authorization': user.token,  
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify({ 
                        image: newUrl, 
                        name: newName, 
                        capacity: newCap, 
                        type: newType 
                    })
                })
      
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.toString()}`);
                }
                const newRes = await response.json();
                console.log(newRes);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
              setIsUpdating(false);
              setReFetch(!reFetch);
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
                        {user?.role === "ADMIN" && (
                            <div className="flex flex-col items-center">
                                <h2 className="text-xl">Edit room</h2>
                                <div className="grid grid-cols-3 gap-1 mt-2">
                                    <img className="h-36" src={singleIMG} alt="Image of a hotel room with single bed" />
                                    <img className="h-36" src={doubleIMG} alt="Image of a hotel room with larger size bed" />
                                    <img className="h-36" src={familyIMG} alt="Image of a hotel room with space for a family" />
                                    <label htmlFor="single_img" >
                                        Single IMG: <input id="single_img" type="radio" value={singleIMG} onChange={e => {setNewURL(e.target.value)}} checked={newUrl === singleIMG} />
                                    </label>
                                    <label htmlFor="double_img" >
                                        Double IMG: <input id="double_img" type="radio" value={doubleIMG} onChange={e => {setNewURL(e.target.value)}} checked={newUrl === doubleIMG} />
                                    </label>
                                    <label htmlFor="family_img" >
                                        Family IMG: <input id="family_img" type="radio" value={familyIMG} onChange={e => {setNewURL(e.target.value)}} checked={newUrl === familyIMG}/>
                                    </label> 
                                </div>
                                <div className="grid grid-cols-3 gap-1 my-2">
                                    <label htmlFor="room_name">Room name:</label>
                                    <label htmlFor="capacity">Capacity:</label>
                                    <label htmlFor="room_type">Room type:</label>
                                    <input className="border-1" id="room_name" type="text" placeholder="Room name" value={newName} onChange={e => setNewName(e.target.value)} />
                                    <input className="border-1" id="capacity" type="number" value={newCap} onChange={e => setNewCap(Number(e.target.value))} />
                                    <select className="border-1" id="room_type" value={newType} onChange={e => setNewType(e.target.value)}>
                                        <option value="SINGLE">Single room</option>
                                        <option value="DOUBLE">Double room</option>
                                        <option value="FAMILY">Family room</option>
                                    </select>
                                </div>
                                {isUpdating && <CircularProgress />}
                                <Button variant="primary" disabled={isUpdating} onClick={() => handleEditRoom()}>Save changes</Button>
                            </div>
                        )}
                        <div className="flex flex-col items-center p-4 space-y-4 border-2 rounded-md">
                            <h2 className="text-xl">Book room</h2>
                            <div>
                                <DatePicker 
                                    label="Start date"
                                    disablePast
                                    shouldDisableDate={shouldDisableDate}
                                    value={start}
                                    onChange={(newStart) => setStart(newStart)}
                                />
                                <DatePicker 
                                    label="End date"
                                    disablePast
                                    shouldDisableDate={shouldDisableDate}
                                    value={end}
                                    onChange={(newEnd) => setEnd(newEnd)}
                                />
                            </div>
                            {isBooking ? (
                                <CircularProgress />
                            ) : (
                                <Button variant="primary" onClick={() => handleBooking()}>Book</Button>
                            )}
                        </div>
                    </>
                )
            }
        </main>
    );
}