import { prisma } from '@/lib/prismadb'
import React from 'react'

interface Props {
    params: Promise<{ storeId: string }>
}

const DashboardPage = async ({params}:Props) => {

    const { storeId } = await params

    const store = await prisma.store.findFirst({
        where: {
            id: storeId
        }
    })
  return (
    <div>
        Active Store: {store?.name}
    </div>
  )
}

export default DashboardPage