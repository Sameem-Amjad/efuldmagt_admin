import { GripVertical } from 'lucide-react'

export function DragHandle() {
  return (
    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full px-2 cursor-grab">
      <GripVertical className="w-4 h-4 text-gray-500" />
    </div>
  )
}
