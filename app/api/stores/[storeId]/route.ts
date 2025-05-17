import { prisma } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


interface ParamsProps {
    params: { storeId : string}
}


// PATCH --- update store
export const PATCH = async(req: Request, {params}: ParamsProps) => {
    try {
        const { storeId } = params
        const { userId } = await auth();
        const body = await req.json();

        const { name } = body;

        if(!userId) {
            return NextResponse.json({message: "Unauthenticated"}, {status:401});
        }

        if(!name) {
            return NextResponse.json({message: "Name is required"}, {status:400});
        }

        const store = await prisma.store.updateMany({
            where: {
                id: storeId,
                userId
            },
            data: {    // update name
                name
            }
        })

        return NextResponse.json(store);

    } catch (error) {
        console.log('Store Patch', error);
        return NextResponse.json({message: "Internal Error"}, {status: 500})
    }
}

// DELETE ---- delete store
export const DELETE = async(req:Request, {params}: ParamsProps) => {
    try {
        const { storeId } = params
        const { userId } = await auth();

        if(!userId) {
            return NextResponse.json({message: "Unauthenticated"}, {status:401});
        }

        const store = await prisma.store.deleteMany({
            where: {
                id: storeId
            },
        })

        return NextResponse.json(store);

    } catch (error) {
        console.log('Store Delete', error);
        return NextResponse.json({message: "Internal Error"}, {status: 500})
    }
}
