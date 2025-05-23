'use client'

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BillboardColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { Apilist } from '@/components/ui/api-list'

interface BillboardClientProps {
    data: BillboardColumn[]
}

const BillboardClient = ({data}:BillboardClientProps) => {

    const router = useRouter();
    const params = useParams();
  return (
    <>
        <div className='flex items-center justify-between'>
            <Heading
                title={`Billboards (${data.length})`}
                description='Manage billboards for your store'
            />
            <Button onClick={()=> router.push(`/${params.storeId}/billboards/new`)}>
                <Plus className='w-4 h-4 mr-1'/>
                Add New
            </Button>
        </div>
        <Separator/>
        <DataTable searchKey='label' columns={columns} data={data}/>
        <Heading title='API' description='API calls for Billboards' />
        <Apilist entityName='billboards' entityIdName='billboardId'/>

    </>
  )
}

export default BillboardClient