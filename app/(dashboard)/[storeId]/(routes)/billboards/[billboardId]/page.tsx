import { prisma } from '@/lib/prismadb'
import React from 'react'
import BillboardForm from './components/billboard-form'


interface BillboardProps {
    params : Promise<{ billboardId : string}>
}
const BillboardPage = async ( { params }: BillboardProps) => {

  const { billboardId } = await params

  const billboard = await prisma.billboard.findUnique({
    where: {
      id: billboardId
    }
  })
  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8'>
        <BillboardForm initialData={billboard}/>
      </div>
    </div>
  )
}

export default BillboardPage