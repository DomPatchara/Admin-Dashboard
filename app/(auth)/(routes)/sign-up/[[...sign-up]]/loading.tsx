import React from 'react'
import { Loader2 } from 'lucide-react' // หรือ icon อื่น ๆ

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full py-10">
      <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
      <span className="ml-2 text-sm text-gray-500">Loading...</span>
    </div>
  )
}

export default Loading