import prisma from './prismaClient';

export async function isRoomAvailable(roomId: number, startTime: Date, endTime: Date, excludeBookingId?: number) {
    const overlappingBookings = await prisma.booking.findMany({
        where: {
            roomId,
            id: excludeBookingId ? { not: excludeBookingId } : undefined,
            NOT: [
                {
                    endTime: {
                        lte: startTime
                    }
                },
                {
                    startTime: {
                        gte: endTime
                    }
                }
            ]
        }
    });

    return overlappingBookings.length === 0;
}