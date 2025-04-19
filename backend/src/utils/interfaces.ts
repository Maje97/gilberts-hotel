import {Role, Type} from "@prisma/client";

// Base interfaces

export interface Booking {
    id: number
    roomId: number
    userId: number
    startTime: Date
    endTime: Date 
}

export interface BookingData {
    room: number
    user: number
    startTime: Date
    endTime: Date 
}

export interface User {
    id: number
    username: string
    password: string
    role: Role
    bookings: Booking[]
}

export interface UserCredentials {
    username: string
    password: string
}

export interface Room {
    id: number
    image: string
    name: string
    capacity: number
    type: Type
    bookings: Booking[]
}

export interface RoomData {
    image: string
    name: string
    capacity: number
    type?: Type
}

// Modified/custom interfaces

export interface UserWithoutPassword extends Omit<User, 'password'> {}

export interface CreateUser extends Omit<User, 'id'> {}

export interface CustomJwtPayload {
    id: number
    role: Role
}
