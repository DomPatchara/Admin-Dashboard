import { prisma } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface ParamsProps {
  params: { storeId: string; billboardId: string };
}

// GET ---- one billboard
export const GET = async (req: Request, { params }: ParamsProps) => {
  try {
    const { billboardId } = params;
    // const { userId } = await auth();

    // if (!userId) {
    //   return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    // }

    if (!billboardId) {
      return NextResponse.json(
        { message: "Billboard ID is required" },
        { status: 400 }
      );
    }

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("Billboard GET", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};


// PATCH --- update billboard
export const PATCH = async (req: Request, { params }: ParamsProps) => {
  try {
    const { storeId, billboardId } = params;
    const { userId } = await auth();
    const body = await req.json();

    const { label, imageUrl } = body;

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!label) {
      return NextResponse.json(
        { message: "Label is required" },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    if (!billboardId) {
      return NextResponse.json(
        { message: "Billboard ID is required" },
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

    const billboard = await prisma.billboard.updateMany({
      where: {
        id: billboardId,
      },
      data: {
        // update
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("Billboard Patch", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};

// DELETE ---- delete billboard
export const DELETE = async (req: Request, { params }: ParamsProps) => {
  try {
    const { storeId, billboardId } = params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!billboardId) {
      return NextResponse.json(
        { message: "Billboard ID is required" },
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

    const billboard = await prisma.billboard.deleteMany({
      where: {
        id: billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("Billboard Delete", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};
