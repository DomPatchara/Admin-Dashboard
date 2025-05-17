import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prismadb";


export const POST = async(req: Request) => {
    try {
        const { userId } = await auth();  // userid generate from Clerk
        const body = await req.json()

        const { name } = body   // value ที่ใส่เข้าไปตอนตั้งชื่อ store

        if(!userId){
            return NextResponse.json({message: "Unauthorized"}, { status: 401 })
        }

        if(!name){
            return NextResponse.json({message: "Name is require"}, { status: 400 })
        }

        const store = await prisma.store.create({
            data: {
                name,
                userId
            }
        })

        return NextResponse.json(store);
        
    } catch (error) {
        console.log("Stores Post", error);
        return NextResponse.json({message: "Store Posr Error"}, {status: 500})
        
    }
}