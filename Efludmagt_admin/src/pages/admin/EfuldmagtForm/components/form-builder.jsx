"use client";
import { useState, useRef } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Editor } from "@tinymce/tinymce-react";
import ComponentList from "./component-list";
import PhonePreview from "./phone-preview";
import { componentTypes } from "./component-types";
import VariableList from "./variable-list";
import { Eye } from "lucide-react";
import * as React from "react";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";

// Helper function to replace placeholders like {{FriendlyName}} with actual data
function replaceVariablesInContent(content, formValues, components) {
    let replaced = content;
    
    console.log("=== DEBUG replaceVariablesInContent ===");
    console.log("Original content:", content);
    console.log("Form values:", formValues);
    console.log("Components:", components);

    components.forEach(component => {
        const friendlyName = component.friendlyName;
        
        // Create the system variable format: $FirstName (no spaces)
        const systemVariable = '$' + friendlyName.replace(/\s+/g, '');
        
        // Get the current value using the friendly name WITH spaces
        const currentValue = formValues[friendlyName] || '';
        
        console.log(`Replacing ${systemVariable} with "${currentValue}"`);
        
        // Escape special regex characters in the system variable
        const escapedVariable = systemVariable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedVariable, "g");
        
        replaced = replaced.replace(regex, currentValue);
    });
    
    console.log("Final replaced content:", replaced);
    console.log("=== END DEBUG ===");

    return replaced;
}




export default function FormBuilder({
  components,
  setComponents,
  onFormComponentsChange,
  onEditorContentChange, // New prop
  initialEditorContent = "", // New prop
}) {

  const [editorContent, setEditorContent] = useState(initialEditorContent);
  const [previewHtml, setPreviewHtml] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [open, setOpen] = useState(false);
  const editorRef = useRef(null);
  
  // State to hold the actual values of form inputs
  const [formValues, setFormValues] = useState({});

  const handleEditorChange = (content) => {
    setEditorContent(content);
    onEditorContentChange(content);
  };

  // Initialize global counter to start from 3
  const globalCountRef = useRef(3);

  const getLabelForType = (type) => {
    switch (type) {
      case "headline":
        return "Headline";
      case "note":
        return "Note";
      case "textField":
        return "Text Field";
      case "textArea":
        return "Text Area";
      case "date":
        return "Date";
      case "radioButtons":
        return "Radio Buttons";
      case "checkBoxes":
        return "Check Boxes";
      default:
        return "Field";
    }
  };


useEffect(() => {
    // Initialize formValues for all existing components when component mounts
    const initialValues = {};
    
    components.forEach(component => {
        if (component.type === "checkBoxes") {
            initialValues[component.friendlyName] = [];
        } else if (component.type !== "headline" && component.type !== "note") {
            // Initialize all input fields with empty string
            initialValues[component.friendlyName] = "";
        }
    });
    
    console.log("Initializing formValues:", initialValues);
    setFormValues(initialValues);
}, [components.length]); 




useEffect(() => {
    onFormComponentsChange(components);
}, []);

const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log("🔵 Drag end:", { activeId: active?.id, overId: over?.id });
    
    if (!over) {
        console.log("❌ No drop target");
        return;
    }

    const component = componentTypes.find((c) => c.id === active.id);
    console.log("🔍 Component found:", component);
    
    if (component) {
        setComponents((prev) => {
            console.log("📋 Previous components:", prev.length);
            
            const label = getLabelForType(component.type);
            
            // Create unique name by counting existing components of the same type
            const sameTypeCount = prev.filter(c => c.type === component.type).length;
            const uniqueLabel = sameTypeCount > 0 ? `${label} ${sameTypeCount + 1}` : label;
            console.log("✨ Creating component with label:", uniqueLabel);

            const newComponent = {
                id: crypto.randomUUID(),
                type: component.type,
                friendlyName: uniqueLabel,
            };

            if (component.type === "radioButtons" || component.type === "checkBoxes") {
                newComponent.options = [
                    { id: crypto.randomUUID(), label: 'Option 1', value: 'option1' },
                    { id: crypto.randomUUID(), label: 'Option 2', value: 'option2' }
                ];
                console.log("✅ Added options to component");
            }

            const updatedComponents = [...prev, newComponent];
            console.log("📦 Updated components count:", updatedComponents.length);
            console.log("🚀 Calling onFormComponentsChange");
            
            onFormComponentsChange(updatedComponents);
            
            // Initialize checkbox value as empty array
            if (component.type === "checkBoxes") {
                console.log("🔲 Initializing checkbox formValues for:", uniqueLabel);
                setFormValues((prevFormValues) => ({
                    ...prevFormValues,
                    [uniqueLabel]: []
                }));
            }
            setEditorContent("");

            setPreviewHtml("");
            return updatedComponents;
        });
    } else {
        console.log("❌ Component not found in componentTypes");
    }
};

  // Handler to update formValues from PhonePreview
 const handleFormValueChange = (friendlyName, value) => {
    console.log("🔥 handleFormValueChange called:", friendlyName, value);
    setFormValues((prev) => ({
      ...prev,
      [friendlyName]: value,
    }));
    setEditorContent("");
    setPreviewHtml("");
};

  // Handler to delete a component by id
const handleDeleteComponent = (id) => {
    // --- FIX #2: Changed setFormComponents to the 'setComponents' prop ---
    setComponents((prev) => {
      const componentToDelete = prev.find((component) => component.id === id);
      if (componentToDelete && componentToDelete.isDefault) {
        alert("Default components cannot be deleted.");
        return prev;
      }

      const updatedComponents = prev.filter((component) => component.id !== id);
      onFormComponentsChange(updatedComponents);
      setPreviewHtml("");
      setEditorContent("");
      return updatedComponents;
    });
  };

   const handleUpdateComponent = (updatedComponent) => {
    setComponents((prevComponents) => {
        const updated = prevComponents.map((component) =>
          component.id === updatedComponent.id ? updatedComponent : component
        );
        onFormComponentsChange(updated); // This is still needed
        setEditorContent("");

        setPreviewHtml("");
        return updated;
      }
    );
  }

  // Insert a variable placeholder (like {{FriendlyName}}) into the TinyMCE content
const insertVariable = (variableName) => {
    if (editorRef.current) {
        const editor = editorRef.current;
        let contentToInsert = '';

        // Check if the variable name already starts with a '$'
        if (variableName.startsWith('$')) {
            // If it does, use it as is (e.g., "$fuldmagtGiverName")
            contentToInsert = variableName;
        } else {
            // If it's a friendly name (e.g., "First Name"), transform it
            // 1. Remove all spaces: "First Name" -> "FirstName"
            const nameWithoutSpaces = variableName.replace(/\s+/g, '');
            // 2. Add the '$' prefix: "FirstName" -> "$FirstName"
            contentToInsert = `$${nameWithoutSpaces}`;
        }

        // Insert the correctly formatted variable into the editor
        editor.insertContent(contentToInsert);
    }
};
  // Each component can show up in the Variables list as a placeholder
  const variables = components.map((component) => ({
    id: component.id,
    name: component.friendlyName,
  }));
  // Handler to open the preview dialog
// This is the corrected function
const handleOpenPreview = () => {
    console.log("Opening preview...");
    console.log("Editor content:", editorContent);
    
    // Just show the editor content as-is, no replacement
    setPreviewHtml(editorContent);
    setOpen(true);
};

  return (
    <div className="space-y-4 mb-8 bg-white p-8 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Form Builder</h1>
        <div className="flex gap-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex gap-2 bg-[#3CB4E4] rounded-lg shadow-sm"
          >
            {/* <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
            </TabsList> */}
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left side: Component List + Editor */}
        <div className="space-y-8">
          {/* Component List (Draggable) */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Components</h2>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop into the phone area and configure as needed.
            </p>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <ComponentList />
            </DndContext>
          </div>

          {/* E-fuldmagt Text Editor */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">E-fuldmagt Text</h2>
            <p className="text-sm text-gray-500 mb-4">
              The e-fuldmagt text combined with the data inputted by the user.
            </p>
            <VariableList
              variables={[
                ...variables,
                { id: "fuldmagtGiverName", name: "$fuldmagtGiverName" },
                { id: "agentName", name: "$agentName" },
                { id: "agentEmail", name: "$agentEmail" },
                { id: "agentPhone", name: "$agentPhone" },
                { id: "revokedDate", name: "$revokedDate" },
                // { id: "textFieldTest", name: "$textFieldTest" },
                // { id: "textAreaTest", name: "$textAreaTest" },
                // { id: "dateTest", name: "$dateTest" },
                // { id: "radioButtonsTest", name: "$radioButtonsTest" },
                // { id: "checkBoxesTest", name: "$checkBoxesTest" },
                // {
                //   id: "fuldmagtGiverSignature",
                //   name: "$fuldmagtGiverSignature",
                // },
              ]}
              onVariableClick={insertVariable}
            />
            <Editor
              onInit={(evt, editor) => {
                editorRef.current = editor;
              }}
              apiKey="2345uqd3cj4tsv39s9tijnvb3le640s95drcd5azq0anygqk" // Replace with your actual TinyMCE API key
              value={editorContent}
              onEditorChange={handleEditorChange}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help",
              }}
            />

            {/* Preview Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  className="px-2 mt-4"
                  variant="outline"
                  onClick={handleOpenPreview}
                >
                  <Eye size={16} className="mr-1" />
                  Preview e-Fuldmagt
                </Button>
              </DialogTrigger>
              <DialogContent className="p-0 overflow-hidden">
                <div className="relative bg-white">
                  <div className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          className="object-cover w-full h-full rounded-full"
                          src="https://plus.unsplash.com/premium_photo.jpg"
                          alt="User"
                        />
                        <AvatarFallback>AC</AvatarFallback>
                      </Avatar>
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                          Final e-Fuldmagt Text
                        </DialogTitle>
                      </DialogHeader>
                      <div className="mt-4 text-left w-full">
                        <div
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex justify-center">
                  <Button
                    variant="default"
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white"
                    onClick={() => setOpen(false)}
                  >
                    Close Preview
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex justify-center">
          <PhonePreview
            components={components}
            activeTab={activeTab}
            formValues={formValues}
            onFormValueChange={handleFormValueChange}
            onDelete={handleDeleteComponent}
            onUpdateComponent={handleUpdateComponent}
          />
        </div>
      </div>
    </div>
  );
}