import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DragHandle } from './DragHandle'

export default function SortableComponent({ id, containerId, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: {
      sortable: {
        containerId,
      },
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative">
      {/* Optional: Include DragHandle if you want a specific area to drag */}
      {/* <DragHandle /> */}
      {children}
    </div>
  )
}
