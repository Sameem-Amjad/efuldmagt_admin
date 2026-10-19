import { componentTypes } from './component-types'
import SortableComponent from './SortableComponent'

export default function ComponentList() {
  return (
    <div className="space-y-4">
      {componentTypes.map(component => (
        <SortableComponent
          key={component.id}
          id={component.id}
          containerId="component-list"
        >
          <div className="flex items-center justify-between p-2 rounded-md">
            <span className="font-medium">{component.name}</span>
          </div>
        </SortableComponent>
      ))}
    </div>
  )
}
