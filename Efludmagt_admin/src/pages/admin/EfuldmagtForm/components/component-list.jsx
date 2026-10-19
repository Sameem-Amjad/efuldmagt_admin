import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { componentTypes } from './component-types'

function DraggableComponent({ id, icon: Icon, label }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
    >
      <Icon className="w-5 h-5 text-gray-500" />
      <span>{label}</span>
    </div>
  )
}

export default function ComponentList() {
  return (
    <div className="space-y-2">
      {componentTypes.map((component) => (
        <DraggableComponent
          key={component.id}
          id={component.id}
          icon={component.icon}
          label={component.label}
        />
      ))}
    </div>
  )
}

