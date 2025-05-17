import { prisma } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface ParamsProps {
  params: { categoryId: string, storeId: string };
}

// GET ---- Unique Category
export const GET = async (req: Request, { params }: ParamsProps) => {
  try {
    const { categoryId } = params;


    if (!categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("Category GET Unique", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};


// PATCH --- update billboard
export const PATCH = async (req: Request, { params }: ParamsProps) => {
  try {
    const { storeId, categoryId } = params;
    const { userId } = await auth();
    const body = await req.json();

    const { name, billboardId  } = body;

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    if (!billboardId) {
      return NextResponse.json(
        { message: "Billboard ID is required" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
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

    const category = await prisma.category.updateMany({
      where: {
        id: categoryId,
      },
      data: {
        // update
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("Category Patch", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};

// DELETE ---- delete billboard
export const DELETE = async (req: Request, { params }: ParamsProps) => {
  try {
    const { storeId, categoryId } = params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
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

    const category = await prisma.category.deleteMany({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("Category Delete", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};
