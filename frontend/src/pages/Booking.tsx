import { useParams } from "react-router";
import Button from "../components/Button";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import dayjs, { Dayjs } from "dayjs";
import { IBooking } from "../interfaces";
import CircularProgress from "@mui/material/CircularProgress";

export default function Booking() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const [data, setData] = useState<{booking: IBooking}>();
  const now = dayjs();
  const [start, setStart] = useState<Dayjs | null>(now);
  const [end, setEnd] = useState<Dayjs | null>(now.add(1, 'day'));

  useEffect(() => {
      const fetchData = async () => {
          setIsLoading(true);
          if (user?.token) {
              try {
                  const response = await fetch(`https://gilberts-hotel-167477665950.europe-north2.run.app/booking/${id}`, {
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
                  setStart(newData.booking.startTime);
                  setEnd(newData.booking.endTime);
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

  const updateBooking = async () => {
    if (user?.token) {
      try {
          const response = await fetch(`https://gilberts-hotel-167477665950.europe-north2.run.app/booking/${Number(id)}`, {
              method: 'PATCH',
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

  const deleteBooking = async () => {
    if (user?.token) {
      try {
          const response = await fetch(`https://gilberts-hotel-167477665950.europe-north2.run.app/booking/${Number(id)}`, {
              method: 'PATCH',
              headers: { 
                  'Authorization': user.token,  
                  'Content-Type': 'application/json', 
              },
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
      <main>
          <h1>Edit booking</h1>
          {isLoading ? (
              <CircularProgress />
            ) : (
              <>
                <h2>Booking# {data?.booking.id}</h2>
                <div>
                  <DatePicker 
                      label="Start date"
                      disablePast
                      value={start}
                      onChange={(newStart) => setStart(newStart)}
                  />
                  <DatePicker 
                      label="End date"
                      disablePast
                      value={end}
                      onChange={(newEnd) => setEnd(newEnd)}
                  />
                </div>
                <Button variant="primary" onClick={() => updateBooking()}>Update</Button>
                <Button variant="secondary" onClick={() => deleteBooking()}>Delete booking</Button>
              </>
            )
          }
      </main>
  );
}
