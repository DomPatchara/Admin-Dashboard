'use client'

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ColorColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { Apilist } from '@/components/ui/api-list'

interface ColorsClientProps {
    data: ColorColumn[]
}

const ColorsClient = ({data}:ColorsClientProps) => {

    const router = useRouter();
    const params = useParams();
  return (
    <>
        <div className='flex items-center justify-between'>
            <Heading
                title={`Colors (${data.length})`}
                description='Manage colors for your store'
            />
            <Button onClick={()=> router.push(`/${params.storeId}/colors/new`)}>
                <Plus className='w-4 h-4 mr-1'/>
                Add New
            </Button>
        </div>
        <Separator/>
        <DataTable searchKey='name' columns={columns} data={data}/>
        <Heading title='API' description='API calls for colors' />
        <Apilist entityName='colors' entityIdName='colorId'/>

    </>
  )
}

export default ColorsClient