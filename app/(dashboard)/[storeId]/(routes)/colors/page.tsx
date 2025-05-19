import React from 'react'
import ColorsClient from './components/client'
import { prisma } from '@/lib/prismadb'
import { ColorColumn } from './components/columns'
import { format } from 'date-fns'

interface Props {
  params: Promise<{ storeId: string }>
}

const ColorsPage = async({params}: Props) => {

  const { storeId } = await params

  const colors = await prisma.color.findMany({
    where: {
      storeId: storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name : item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorsClient data={formattedColors}/>
      </div>
    </div>
  )
}

export default ColorsPage