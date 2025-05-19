'use client'

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProductColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { Apilist } from '@/components/ui/api-list'

interface ProductClientProps {
    data: ProductColumn[]
}

const ProductClient = ({data}:ProductClientProps) => {

    const router = useRouter();
    const params = useParams();
  return (
    <>
        <div className='flex items-center justify-between'>
            <Heading
                title={`Products (${data.length})`}
                description='Manage products for your store'
            />
            <Button onClick={()=> router.push(`/${params.storeId}/products/new`)}>
                <Plus className='w-4 h-4 mr-1'/>
                Add New
            </Button>
        </div>
        <Separator/>
        <DataTable searchKey='name' columns={columns} data={data}/>
        <Heading title='API' description='API calls for Products' />
        <Apilist entityName='products' entityIdName='productId'/>

    </>
  )
}

export default ProductClient