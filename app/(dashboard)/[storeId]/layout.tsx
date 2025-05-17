import { prisma } from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeId: string }>;
}) {
  const { userId } = await auth();
  const { storeId } = await params;

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prisma.store.findFirst({
    where: {
        id: storeId,
        userId
    }
  })

  if(!store) {
    redirect('/')
  }

  return (
    <>
        <Navbar/>
        {children}
    </>
  )
}
