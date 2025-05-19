import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prismadb";


interface StoreIdProps { 
    params: { storeId : string }
}

// POST new Color
export const POST = async(req: Request, { params } : StoreIdProps) => {
    try {
        
        const { storeId } = params
        const { userId } = await auth();  // userid generate from Clerk
        const body = await req.json()

        const { name, value } = body   // value ที่ใส่เข้าไปตอนตั้งชื่อ store

        if(!userId){
            return NextResponse.json({message: "Unauthenticated"}, { status: 401 })
        }

        if(!name){
            return NextResponse.json({message: "Name is require"}, { status: 400 })
        }

        if(!value){
            return NextResponse.json({message: "Value is require"}, { status: 400 })
        }

        if(!storeId) {
            return NextResponse.json({message: "Store id is require"}, { status: 400 })
        }

        const storeByUserId = await prisma.store.findFirst({
            where: {
                id: storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return NextResponse.json({message: "Unauthorized"}, { status: 403})
        }

        const color = await prisma.color.create({
            data: {
                name,
                value,
                storeId: storeId
            }
        })

        return NextResponse.json(color);
        
    } catch (error) {
        console.log("Color Post", error);
        return NextResponse.json({message: "Post Error"}, {status: 500})
        
    }
}


// Get All Colors
export const GET = async(req: Request, { params } : StoreIdProps) => {
    try {
        
        const { storeId } = params


        if(!storeId) {
            return NextResponse.json({message: "Store id is require"}, { status: 400 })
        }

        const colors = await prisma.color.findMany({
            where: {
                storeId: storeId,   
            }
        })

        return NextResponse.json(colors);
        
    } catch (error) {
        console.log("Colors Get", error);
        return NextResponse.json({message: "Internal Error"}, {status: 500})
        
    }
}