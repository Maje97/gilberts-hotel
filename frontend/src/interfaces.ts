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