import { prisma } from '@/lib/prismadb'
import React from 'react'
import ColorForm from './components/color-form'



interface SizeProps {
    params : Promise<{ colorId : string}>
}
const SizePage = async ( { params }: SizeProps) => {

  const { colorId } = await params

  const color = await prisma.color.findUnique({
    where: {
      id: colorId
    }
  })
  return (
    <div className='flex flex-col'>
      <div className='flex-1 space-y-4 p-8'>
        <ColorForm initialData={color}/>
      </div>
    </div>
  )
}

export default SizePage