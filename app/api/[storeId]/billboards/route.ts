import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prismadb";


interface StoreIdProps { 
    params: { storeId : string }
}

export const POST = async(req: Request, { params } : StoreIdProps) => {
    try {
        
        const { storeId } = params
        const { userId } = await auth();  // userid generate from Clerk
        const body = await req.json()

        const { label, imageUrl } = body   // value ที่ใส่เข้าไปตอนตั้งชื่อ store

        if(!userId){
            return NextResponse.json({message: "Unauthenticated"}, { status: 401 })
        }

        if(!label){
            return NextResponse.json({message: "Label is require"}, { status: 400 })
        }

        if(!imageUrl){
            return NextResponse.json({message: "Image URL is require"}, { status: 400 })
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

        const billboard = await prisma.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: storeId
            }
        })

        return NextResponse.json(billboard);
        
    } catch (error) {
        console.log("Billboard Post", error);
        return NextResponse.json({message: "Billboard Post Error"}, {status: 500})
        
    }
}


// Get All Billboard
export const GET = async(req: Request, { params } : StoreIdProps) => {
    try {
        
        const { storeId } = params


        if(!storeId) {
            return NextResponse.json({message: "Store id is require"}, { status: 400 })
        }

        const billboard = await prisma.billboard.findMany({
            where: {
                storeId: storeId,   
            }
        })

        return NextResponse.json(billboard);
        
    } catch (error) {
        console.log("Billboard Get", error);
        return NextResponse.json({message: "Internal Error"}, {status: 500})
        
    }
}