import { prisma } from "@/lib/prismadb";
import React from "react";
import CategoryForm from "./components/category-form";

interface BillboardProps {
  params: Promise<{ categoryId: string; storeId: string }>;
}
const CategoryPage = async ({ params }: BillboardProps) => {
  const { categoryId, storeId } = await params;

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: storeId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
