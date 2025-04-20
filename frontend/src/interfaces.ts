export interface IRoom {
    id: number | string;
    image: string;
    name: string;
    capacity: number | string;
    type: string;
}

export interface IRoomList {
    rooms: IRoom[];
}

export interface IBooking {
    id: number | string;
    roomId: number | string;
    userId: number | string;
    startTime: Date;
    endTime: Date;
}

export interface IBookingList {
    bookings: IBooking[];
}
