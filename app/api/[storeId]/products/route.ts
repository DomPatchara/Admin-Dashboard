import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prismadb";

interface StoreIdProps {
  params: Promise<{ storeId: string }>;
}

export const POST = async (req: Request, { params }: StoreIdProps) => {
  try {
    const { storeId } =await params;
    const { userId } = await auth(); // userid generate from Clerk
    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      images,
      sizeId,
      isFeatured,
      isArchived,
    } = body; // value ที่ใส่เข้าไปตอนตั้งชื่อ store

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!name) {
      return NextResponse.json({ message: "Name is require" }, { status: 400 });
    }

    if (!price) {
      return NextResponse.json(
        { message: "Price is require" },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { message: "Category ID is require" },
        { status: 400 }
      );
    }

    if (!colorId) {
      return NextResponse.json(
        { message: "Color ID is require" },
        { status: 400 }
      );
    }

    if (!sizeId) {
      return NextResponse.json(
        { message: "Size ID is require" },
        { status: 400 }
      );
    }

    // if (!images || !images.lenght) {
    //   return NextResponse.json(
    //     { message: "Images are require" },
    //     { status: 400 }
    //   );
    // }

    // Authorization part
    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Create new Prodcut on Database
    const product = await prisma.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
        sizeId,
        isFeatured,
        isArchived,
        storeId: storeId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("Product Post", error);
    return NextResponse.json(
      { message: "Prodcut Post Error" },
      { status: 500 }
    );
  }
};

// Get All Products
export const GET = async (req: Request, { params }: StoreIdProps) => {
  try {
    const { storeId } = await params;

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined
    const colorId = searchParams.get("colorId") || undefined
    const sizeId = searchParams.get("sizeId") || undefined
    const isFeatured = searchParams.get("isFeatured") || undefined

    if (!storeId) {
      return NextResponse.json(
        { message: "Store id is require" },
        { status: 400 }
      );
    }

    const products = await prisma.product.findMany({
      where: {
        storeId: storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ?  true : undefined,
        isArchived: false
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("Products Get", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};
