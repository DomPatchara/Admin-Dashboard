import { prisma } from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import SettingForm from './components/setting-form';
import React from 'react'


interface SettingProps {
    params: Promise<{ storeId: string}>
}
const SettingPage = async ({params} : SettingProps) => {

    const { userId } = await auth();
    const { storeId } = await params
    if (!userId) {
        redirect('/sign-in')
    }

    const store = await prisma.store.findFirst({
        where: {
            id: storeId,
            userId
        }
    })

    if (!store) {
        redirect("/")
    }


  return (
    <div className='flex flex-col'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
            <SettingForm initialData={store}/>
        </div>
    </div>
  )
}

export default SettingPage