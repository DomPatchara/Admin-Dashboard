'use client'

import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CategoryColumn, columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { Apilist } from '@/components/ui/api-list'

interface CategoryClientProps {
    data: CategoryColumn[]
}

const CategoryClient = ({data}:CategoryClientProps) => {

    const router = useRouter();
    const params = useParams();
  return (
    <>
        <div className='flex items-center justify-between'>
            <Heading
                title={`Categories (${data.length})`}
                description='Manage categories for your store'
            />
            <Button onClick={()=> router.push(`/${params.storeId}/categories/new`)}>
                <Plus className='w-4 h-4 mr-1'/>
                Add New
            </Button>
        </div>
        <Separator/>
        <DataTable searchKey='name' columns={columns} data={data}/>
        <Heading title='API' description='API calls for Categories' />
        <Apilist entityName='categories' entityIdName='categoryId'/>

    </>
  )
}

export default CategoryClient