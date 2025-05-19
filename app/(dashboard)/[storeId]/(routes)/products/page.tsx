import React from 'react'
import ProductClient from './components/client'
import { prisma } from '@/lib/prismadb'
import { ProductColumn } from './components/columns'
import { format } from 'date-fns'
import { formatter } from '@/lib/utils'

interface Props {
  params: Promise<{ storeId: string }>
}

const ProductsPage = async({params}: Props) => {

  const { storeId } = await params

  const products = await prisma.product.findMany({
    where: {
      storeId: storeId
    },
    include: {    // --------> ดึง object data ส่วนนี้มาด้วย
      category: true,
      size: true,
      color: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name : item.name,
    isFeatured : item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductClient data={formattedProducts}/>
      </div>
    </div>
  )
}

export default ProductsPage