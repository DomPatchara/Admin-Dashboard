import { prisma } from '@/lib/prismadb'
import React from 'react'
import ProductForm from './components/product-form'


interface ProductProps {
    params : Promise<{ productId : string, storeId: string}>
}
const ProductPage = async ( { params }: ProductProps) => {

  const { productId, storeId } = await params

  const product = await prisma.product.findUnique({
    where: {
      id: productId
    },
    include: {
      images: true
    }
  })

  const categories = await prisma.category.findMany({
    where : {
      storeId: storeId
    }
  })


  const sizes = await prisma.size.findMany({
    where : {
      storeId: storeId
    }
  })

  const colors = await prisma.color.findMany({
    where : {
      storeId: storeId
    }
  })

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8'>
        <ProductForm 
          initialData={product}
          categories= {categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  )
}

export default ProductPage