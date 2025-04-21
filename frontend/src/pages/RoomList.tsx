import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { IRoom, IRoomList } from "../interfaces";
import CircularProgress from '@mui/material/CircularProgress';
import Button from "../components/Button";

export default function RoomList() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user } = useAuth();
    const [data, setData] = useState<IRoomList>();
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
                    const response = await fetch('https://gilberts-hotel-167477665950.europe-north2.run.app/room/', {
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
                    console.log(newData)
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
    }, [user, reFetch]);

    const handleCreateRoom = async () => {
        if (user?.token) {
            setIsUpdating(true);
            try {
                const response = await fetch(`https://gilberts-hotel-167477665950.europe-north2.run.app/room`, {
                    method: 'POST',
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
                    throw new Error(`HTTP error! status: ${response}`);
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
            {user?.role === "ADMIN" && (
                <div className="flex flex-col items-center">
                    <h2 className="text-lg">Create room</h2>
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
                    <Button variant="primary" disabled={isUpdating} onClick={() => handleCreateRoom()}>Create</Button>
                </div>
            )}
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