import React from 'react'
import CategoryClient from './components/client'
import { prisma } from '@/lib/prismadb'
import { CategoryColumn } from './components/columns'
import { format } from 'date-fns'

interface Props {
  params: Promise<{ storeId: string }>
}

const CategoriesPage = async({params}: Props) => {

  const { storeId } = await params

  const categories = await prisma.category.findMany({
    where: {
      storeId: storeId
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryClient data={formattedCategories}/>
      </div>
    </div>
  )
}

export default CategoriesPage 