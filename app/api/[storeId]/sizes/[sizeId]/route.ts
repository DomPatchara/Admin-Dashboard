import { prisma } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface ParamsProps {
  params: Promise<{ sizeId: string, storeId: string }>;
}

// GET ---- Unique Category
export const GET = async (req: Request, { params }: ParamsProps) => {
  try {
    const { sizeId } = await params;


    if (!sizeId) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    const size = await prisma.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("Size GET Unique", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};


// PATCH --- update Size
export const PATCH = async (req: Request, { params }: ParamsProps) => {
  try {
    const { storeId, sizeId } = await params;
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

    if (!sizeId) {
      return NextResponse.json(
        { message: "Size ID is required" },
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

    const size = await prisma.size.updateMany({
      where: {
        id: sizeId,
      },
      data: {
        // update
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("Size Patch", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};

// DELETE ---- delete billboard
export const DELETE = async (req: Request, { params }: ParamsProps) => {
  try {
    const { storeId, sizeId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!sizeId) {
      return NextResponse.json(
        { message: "Size ID is required" },
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

    const size = await prisma.size.deleteMany({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("Size Delete", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};
