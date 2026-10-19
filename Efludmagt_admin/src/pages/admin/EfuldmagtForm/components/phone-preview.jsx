import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, XCircle, Edit2, Trash2, Plus, Save } from 'lucide-react';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


const DraggableComponent = ({ component, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ 
    id: component.id 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

// EditableField component with improved functionality
const EditableField = ({ value, onChange, className = "" }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleEdit = () => {
    setIsEditing(true);
    setTempValue(value);
  };

  const handleSave = () => {
    if (tempValue.trim() !== "") {
      onChange(tempValue);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTempValue(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="py-1 text-sm"
            autoFocus
          />
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={handleSave}
            className="p-1 h-8 w-8"
          >
            <Save size={16} />
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between group mr-8">
          <span className="flex-1">{value}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="opacity-0 group-hover:opacity-100 p-1 h-8 w-8 bg-transparent"
          >
            <Edit2 size={12} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default function PhonePreview({
  components,
  activeTab,
  formValues,
  onFormValueChange,
  onDelete,
  onUpdateComponent,
}) {
  const [editingStates, setEditingStates] = useState({});

  const toggleEditing = (componentId) => {
    setEditingStates(prev => ({
      ...prev,
      [componentId]: !prev[componentId]
    }));
  };

  const updateComponentName = useCallback((componentId, newName) => {
    const component = components.find(c => c.id === componentId);
    if (component) {
      const oldName = component.friendlyName;
      // Update the component
      onUpdateComponent({
        ...component,
        friendlyName: newName
      });
      // Update form values
      const newFormValues = { ...formValues };
      newFormValues[newName] = newFormValues[oldName];
      delete newFormValues[oldName];
      onFormValueChange(newName, newFormValues[newName]);
    }
  }, [components, formValues, onUpdateComponent, onFormValueChange]);

  const updateComponentOptions = useCallback((componentId, newOptions) => {
    const component = components.find(c => c.id === componentId);
    if (component) {
      onUpdateComponent({
        ...component,
        options: newOptions
      });
    }
  }, [components, onUpdateComponent]);

  const addOption = useCallback((componentId) => {
    const component = components.find(c => c.id === componentId);
    if (component) {
      const currentOptions = component.options || [];
      const newOption = {
        id: `option-${Date.now()}`,
        label: `Option ${currentOptions.length + 1}`,
        value: `option${currentOptions.length + 1}`
      };
      updateComponentOptions(componentId, [...currentOptions, newOption]);
    }
  }, [components, updateComponentOptions]);

  const deleteOption = useCallback((componentId, optionId) => {
    const component = components.find(c => c.id === componentId);
    if (component) {
      const newOptions = (component.options || []).filter(opt => opt.id !== optionId);
      updateComponentOptions(componentId, newOptions);
    }
  }, [components, updateComponentOptions]);

  const updateOptionLabel = useCallback((componentId, optionId, newLabel) => {
    const component = components.find(c => c.id === componentId);
    if (component) {
      const newOptions = (component.options || []).map(opt =>
        opt.id === optionId ? { ...opt, label: newLabel } : opt
      );
      updateComponentOptions(componentId, newOptions);
    }
  }, [components, updateComponentOptions]);

  const renderEditableOptions = (component) => {
    const options = component.options || [
      { id: 'option-1', label: 'Option 1', value: 'option1' },
      { id: 'option-2', label: 'Option 2', value: 'option2' }
    ];

    return (
      <div className="space-y-2 mt-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center gap-2">
            <EditableField
              value={option.label}
              onChange={(newLabel) => updateOptionLabel(component.id, option.id, newLabel)}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteOption(component.id, option.id)}
              className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => addOption(component.id)}
          className="w-full mt-2"
        >
          <Plus size={16} className="mr-2" />
          Add Option
        </Button>
      </div>
    );
  };

  const renderComponent = (component) => {
    const isEditing = editingStates[component.id];
    const componentOptions = component.options || [
      { id: 'option-1', label: 'Option 1', value: 'option1' },
      { id: 'option-2', label: 'Option 2', value: 'option2' }
    ];

    const componentContent = (() => {
      switch (component.type) {
        case "headline":
        case "textField":
        case "textArea":
        case "date":
        case "note":
          return (
            <div className="space-y-2">
              <EditableField
                value={component.friendlyName}
                onChange={(newName) => updateComponentName(component.id, newName)}
              />
              <Input
                type={component.type === "date" ? "datetime-local" : "text"}
                placeholder={`Enter ${component.type === "note" ? "note" : "text"}`}
                value={formValues[component.friendlyName] || ""}
                onChange={(e) => onFormValueChange(component.friendlyName, e.target.value)}
                className={component.type === "note" ? "bg-gray-100" : ""}
              />
            </div>
          );

        case "radioButtons":
          return (
            <div className="space-y-2">
              <EditableField
                value={component.friendlyName}
                onChange={(newName) => updateComponentName(component.id, newName)}
              />
              {isEditing ? (
                renderEditableOptions(component)
              ) : (
                <RadioGroup
                  value={formValues[component.friendlyName]}
                  onValueChange={(val) => onFormValueChange(component.friendlyName, val)}
                >
                  {componentOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${option.id}_${component.id}`} />
                      <Label htmlFor={`${option.id}_${component.id}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleEditing(component.id)}
                className="mt-2"
              >
                {isEditing ? "Done" : "Edit Options"}
              </Button>
            </div>
          );

case "checkBoxes":
  return (
    <div className="space-y-2">
      <EditableField
        value={component.friendlyName}
        onChange={(newName) => updateComponentName(component.id, newName)}
      />
      {isEditing ? (
        renderEditableOptions(component)
      ) : (
        <div className="space-y-2">
          {componentOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={`${option.id}_${component.id}`}
                checked={Array.isArray(formValues[component.friendlyName]) && 
                  formValues[component.friendlyName].includes(option.value)}
                onCheckedChange={(checked) => {
                  const currentValues = Array.isArray(formValues[component.friendlyName]) 
                    ? [...formValues[component.friendlyName]] 
                    : [];
                  if (checked) {
                    currentValues.push(option.value);
                  } else {
                    const index = currentValues.indexOf(option.value);
                    if (index > -1) currentValues.splice(index, 1);
                  }
                  onFormValueChange(component.friendlyName, currentValues);
                }}
              />
              <Label htmlFor={`${option.id}_${component.id}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => toggleEditing(component.id)}
        className="mt-2"
      >
        {isEditing ? "Done" : "Edit Options"}
      </Button>
    </div>
  );

        default:
          return null
      }
    })();

    return (
      <DraggableComponent key={component.id} component={component}>
        <div className="mb-4 text-sm relative p-4 border rounded-lg bg-gray-50">
          {!component.isDefault && (
            <button
              onClick={() => onDelete(component.id)}
              className="absolute top-2 right-4 text-gray-400 hover:text-red-500"
              aria-label={`Delete ${component.friendlyName}`}
              title={`Delete ${component.friendlyName}`}
            >
              <XCircle size={18} />
            </button>
          )}
          {componentContent}
        </div>
      </DraggableComponent>
    );
  };

  return (
    <div className="relative w-full max-w-[375px] mx-auto">
      <div className="absolute inset-0 bg-contain bg-no-repeat pointer-events-none" />
      <div className="relative w-full bg-white rounded-[3rem] overflow-y-auto shadow-xl border border-gray-200 min-h-[812px] pb-6">
        <div className="flex items-center justify-center h-16 bg-gray-50 rounded-t-[3rem]">
          <span className="text-lg font-semibold">Form Preview</span>
        </div>
        <div className="px-6 flex flex-col gap-2">
          {components.length > 0 ? (
            components.map((component) => renderComponent(component))
          ) : (
            <div className="flex w-full h-full text-gray-400 justify-center mt-2">
              <div className="flex items-center gap-2 flex-col">
                <PlusCircle size={32} />
                <span className="ml-2">Drag and drop components here</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}