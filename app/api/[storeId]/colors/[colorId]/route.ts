import { prisma } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface ParamsProps {
  params: Promise<{ colorId: string, storeId: string }>;
}

// GET ---- Unique Category
export const GET = async (req: Request, { params }: ParamsProps) => {
  try {
    const { colorId } = await params;


    if (!colorId) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    const color = await prisma.color.findUnique({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("Color GET Unique", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};


// PATCH --- update Color
export const PATCH = async (req: Request, { params }: ParamsProps) => {
  try {
    const { storeId, colorId } = await params;
    const { userId } = await auth();
    const body = await req.json();

    const { name, value  } = body;

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    if (!value) {
      return NextResponse.json(
        { message: "Value is required" },
        { status: 400 }
      );
    }

    if (!colorId) {
      return NextResponse.json(
        { message: "Color ID is required" },
        { status: 400 }
      );
    }

    // Check ว่ามี StoreId ไหม ?
    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json({ message: "Unauthorize" }, { status: 400 });
    }
    //--------------------------------------------------------------------------//

    const color = await prisma.color.updateMany({
      where: {
        id: colorId,
      },
      data: {
        // update
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("Color Patch", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};

// DELETE ---- delete billboard
export const DELETE = async (req: Request, { params }: ParamsProps) => {
  try {
    const { storeId, colorId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!colorId) {
      return NextResponse.json(
        { message: "Color ID is required" },
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
      return NextResponse.json({ message: "Unauthorize" }, { status: 400 });
    }

    const color = await prisma.color.deleteMany({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("Color Delete", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};
