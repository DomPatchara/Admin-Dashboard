import React from 'react'
import OrderClient from './components/client'
import { prisma } from '@/lib/prismadb'
import { OrderColumn } from './components/columns'
import { format } from 'date-fns'
import { formatter } from '@/lib/utils'


interface Props {
  params: Promise<{ storeId: string }>
}

const OrdersPage = async({params}: Props) => {

  const { storeId } = await params

  const order = await prisma.order.findMany({
    where: {
      storeId: storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedOrders: OrderColumn[] = order.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
    totalPrice: formatter.format(item.orderItems.reduce((total, item) => (total + Number(item.product.price)), 0 )),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrderClient data={formattedOrders}/>
      </div>
    </div>
  )
}

export default OrdersPage