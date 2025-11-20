import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Event } from '@/database/event.model';

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const formData = await req.json();
        let event ;
        try {
            event = JSON.parse(JSON.stringify(formData));
        } catch {
            return NextResponse.json({message: 'Invalid form data'}, {status: 400});
        }

        const createEvent = await Event.create(event);
        return NextResponse.json({message: 'Event created successfully', event: createEvent}, {status: 201});
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json({message: 'Event creation failed', error: error instanceof Error ? error.message: 'Unknow'}, {status: 500});
    }
}