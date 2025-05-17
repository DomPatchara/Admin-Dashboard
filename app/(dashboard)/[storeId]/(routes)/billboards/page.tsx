import React from 'react'
import BillboardClient from './components/client'
import { prisma } from '@/lib/prismadb'
import { BillboardColumn } from './components/columns'
import { format } from 'date-fns'

interface Props {
  params: Promise<{ storeId: string }>
}

const BillboardsPage = async({params}: Props) => {

  const { storeId } = await params

  const billboard = await prisma.billboard.findMany({
    where: {
      storeId: storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedBillboards: BillboardColumn[] = billboard.map((item) => ({
    id: item.id,
    label : item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardClient data={formattedBillboards}/>
      </div>
    </div>
  )
}

export default BillboardsPage