import { prisma } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }


  // หา userId ใน database ที่ store ที่เราสร้าง
  const store = await prisma.store.findFirst({
    where: {
      userId,
    },
  });

  if (store) {
    redirect(`/${store.id}`);    // ถ้ามี userId ---> ให้ลิ้งไปยัง (dashboard)/[StoreId] <------ ก็คือ store.id
  }

  return (
    <>
      <div className="w-screen h-screen bg-[#F2EFE7]">
        {children}
      </div>
    </>
  ) 
  
}
