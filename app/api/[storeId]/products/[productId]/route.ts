import { prisma } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface ParamsProps {
  params: Promise<{ storeId: string; productId: string }>;
}

// GET ---- one product
export const GET = async (req: Request, { params }: ParamsProps) => {
  try {
    const { productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,

      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("Product GET", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};


// PATCH --- update product
export const PATCH = async (req: Request, { params }: ParamsProps) => {
  try {
    const { storeId, productId } = await params;
    const { userId } = await auth();
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

    if (!images || !images.length) {
      return NextResponse.json(
        { message: "Images are require" },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Store ID Authorization
    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return NextResponse.json({ message: "Unauthorize" }, { status: 400 });
    }

    // Update data by PATCH
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        // update
        name,
        price,
        categoryId,
        colorId,
        images: {
          deleteMany: {},
        },
        sizeId,
        isFeatured,
        isArchived,
        storeId: storeId
      },
    });

    const product = await prisma.product.update({
      where: {
        id: productId
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string })=> image)]
          }
        }
      }
    })

    return NextResponse.json(product);
  } catch (error) {
    console.log("Product Patch", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};

// DELETE ---- delete product
export const DELETE = async (req: Request, { params }: ParamsProps) => {
  try {
    const { storeId, productId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
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

    const product = await prisma.product.deleteMany({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("Product Delete", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
};
