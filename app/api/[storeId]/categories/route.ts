import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prismadb";
import { redis } from "@/lib/redis";

interface StoreIdProps {
  params: Promise<{ storeId: string }>;
}

export const POST = async (req: Request, { params }: StoreIdProps) => {
  try {
    const { storeId } = await params;
    const { userId } = await auth(); // userid generate from Clerk
    const body = await req.json();

    const { name, billboardId } = body; // value ที่ใส่เข้าไปตอนตั้งชื่อ store

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json({ message: "Name is require" }, { status: 400 });
    }

    if (!billboardId) {
      return NextResponse.json(
        { message: "BillboardId is require" },
        { status: 400 }
      );
    }

    if (!storeId) {
      return NextResponse.json(
        { message: "Store id is require" },
        { status: 400 }
      );
    }

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        billboardId,
        storeId: storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("Category Post", error);
    return NextResponse.json(
      { message: "Billboard Post Error" },
      { status: 500 }
    );
  }
};

// Get All Billboard
export const GET = async (req: Request, { params }: StoreIdProps) => {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return NextResponse.json(
        { message: "Store id is require" },
        { status: 400 }
      );
    }

    try {
      const cached = await redis.get("categories");
      if (cached) {
        console.log("Redis: Cache Hit !");
        return NextResponse.json(cached);
      }
      console.log("Redis: Cache Miss !");
    } catch (redisError) {
      console.log("Redis error, falling back to DB:", redisError);
    }

    const category = await prisma.category.findMany({
      where: {
        storeId: storeId,
      },
    });

    try {
      await redis.set("categories", JSON.stringify(category), { ex: 300 });
      console.log("Redis: Cache set done !");
    } catch (redisError) {
      console.log("Redis set error:", redisError);
    }

    return NextResponse.json(category);
  } catch (error) {
    console.log("Category Get", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};
