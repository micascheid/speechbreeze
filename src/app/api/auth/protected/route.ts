import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../[...nextauth]/route';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (session) {
        console.log("check protection true");
        return NextResponse.json({ protected: true });
    } else {
        console.log("check protection false");
        return NextResponse.json({ protected: false });
    }
}
