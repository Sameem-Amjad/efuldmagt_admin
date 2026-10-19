"use client";
import React from "react";
import { Trash2, ListChecks, Plus, AlertCircle, X, Settings2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

const FieldsManagementSection = ({ formData, setFormData, themeColor = "#3cb4e4" }) => {
  
  const fieldTypes = [
    { value: "textField", label: "Text Field" },
    { value: "textArea", label: "Text Area" },
    { value: "date", label: "Date Picker" },
    { value: "headline", label: "Headline" },
    { value: "note", label: "Note/Text Block" },
    { value: "radioButtons", label: "Radio Buttons" },
    { value: "checkBoxes", label: "Check Boxes" },
  ];

  const fieldList = formData.additionalFields || [];
  // ✅ Rule: At least one field is mandatory
  const isLastField = fieldList.length === 1;

  const updateFieldData = (index, updates) => {
    const newFields = [...formData.additionalFields];
    const newTypes = [...formData.additionalFieldsType];
    const newObjects = [...formData.additionalFieldsObject];

    if (updates.name !== undefined) {
        newFields[index] = updates.name.replace(/\s+/g, '');
        const type = newTypes[index];
        if (type === "headline" || type === "note") newObjects[index].text = updates.name;
        else if (type === "radioButtons" || type === "checkBoxes") newObjects[index].heading = updates.name;
        else newObjects[index].placeholder = updates.name;
    }

    if (updates.type !== undefined) {
        newTypes[index] = updates.type;
        const currentLabel = formData.additionalFields[index];
        if (updates.type === "radioButtons" || updates.type === "checkBoxes") {
            newObjects[index] = { heading: currentLabel, options: ["Option 1"] };
        } else if (updates.type === "headline" || updates.type === "note") {
            newObjects[index] = { text: currentLabel };
        } else {
            newObjects[index] = { placeholder: currentLabel };
        }
    }

    if (updates.options !== undefined) {
        newObjects[index].options = updates.options;
    }

    setFormData({ 
        ...formData, 
        additionalFields: newFields, 
        additionalFieldsType: newTypes, 
        additionalFieldsObject: newObjects 
    });
  };

  const addField = () => {
    setFormData({
      ...formData,
      additionalFields: [...(formData.additionalFields || []), "NewField"],
      additionalFieldsType: [...(formData.additionalFieldsType || []), "textField"],
      additionalFieldsObject: [...(formData.additionalFieldsObject || []), { placeholder: "New Field" }]
    });
  };

  const removeField = (index) => {
    // ✅ Check if this is the last remaining field
    if (isLastField) {
      toast.error("At least one field is mandatory for the form.");
      return;
    }

    const sync = (arr) => (arr || []).filter((_, i) => i !== index);
    setFormData({
      ...formData,
      additionalFields: sync(formData.additionalFields),
      additionalFieldsType: sync(formData.additionalFieldsType),
      additionalFieldsObject: sync(formData.additionalFieldsObject)
    });
  };

  return (
    <div className="space-y-6 p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <div className="space-y-1">
          <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <ListChecks size={18} style={{ color: themeColor }} /> 
            Form Field Configuration
          </Label>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">
            Manage labels, types, and options. {isLastField && "The final field cannot be removed."}
          </p>
        </div>
        
        <Button
          onClick={addField}
          size="sm"
          className="rounded-xl flex gap-2 font-bold text-white shadow-md active:scale-95 transition-all"
          style={{ backgroundColor: themeColor }}
        >
          <Plus size={16} /> Add New Field
        </Button>
      </div>

      <div className="space-y-4">
        {fieldList.length === 0 ? (
          <div className="py-10 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-white/50">
            <AlertCircle className="text-gray-300 mb-2" size={24} />
            <p className="text-xs text-gray-400 italic">No fields found. Click 'Add New Field' to start.</p>
          </div>
        ) : (
          fieldList.map((fieldName, index) => (
            <div 
              key={index}
              className={`p-5 bg-white rounded-2xl border shadow-sm transition-all group ${
                isLastField ? "border-amber-100 bg-amber-50/10" : "hover:border-[#3cb4e4] border-gray-200"
              }`}
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* 1. Field Label Input */}
                <div className="flex-1 space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase">
                    Field Label {isLastField && <span className="text-amber-600 ml-1">(Mandatory)</span>}
                  </Label>
                  <Input 
                    value={fieldName} 
                    onChange={(e) => updateFieldData(index, { name: e.target.value })}
                    className="h-10 rounded-xl border-gray-100 focus:ring-1 bg-gray-50/30 font-medium"
                  />
                </div>

                {/* 2. Field Type Dropdown */}
                <div className="w-full md:w-48 space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase">Input Type</Label>
                  <select 
                    value={formData.additionalFieldsType[index]} 
                    onChange={(e) => updateFieldData(index, { type: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-gray-100 text-sm font-medium focus:ring-1 outline-none cursor-pointer bg-gray-50/50"
                  >
                    {fieldTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                {/* 3. Delete Action / Mandatory Lock Icon */}
                <div className="flex items-end">
                  {isLastField ? (
                    <div 
                      className="p-2.5 rounded-xl text-amber-500 bg-amber-50 border border-amber-100 cursor-help" 
                      title="At least one field is required for the form"
                    >
                      <Lock size={18} />
                    </div>
                  ) : (
                    <button 
                      onClick={() => removeField(index)} 
                      className="p-2.5 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove Field"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* 4. Options Management (For Radio/Checkbox types) */}
              {(formData.additionalFieldsType[index] === "radioButtons" || formData.additionalFieldsType[index] === "checkBoxes") && (
                <div className="mt-5 pt-4 border-t border-dashed border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-bold text-[#3cb4e4] uppercase flex items-center gap-1">
                      <Settings2 className="w-3.5 h-3.5" /> Manage Selection Choices
                    </Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(formData.additionalFieldsObject[index]?.options || []).map((opt, optIdx) => (
                      <div key={optIdx} className="flex gap-2 items-center bg-gray-50/50 p-2 rounded-lg border border-gray-100 transition-colors hover:bg-gray-50">
                        <input 
                          value={opt} 
                          onChange={(e) => {
                            const newOpts = [...formData.additionalFieldsObject[index].options];
                            newOpts[optIdx] = e.target.value;
                            updateFieldData(index, { options: newOpts });
                          }}
                          className="flex-1 h-7 text-xs border-none bg-transparent focus:ring-0 font-medium text-gray-600 px-2"
                        />
                        <button 
                          onClick={() => {
                            const newOpts = formData.additionalFieldsObject[index].options.filter((_, i) => i !== optIdx);
                            updateFieldData(index, { options: newOpts });
                          }}
                          className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => {
                        const currentOpts = formData.additionalFieldsObject[index].options || [];
                        const newOpts = [...currentOpts, `New Option ${currentOpts.length + 1}`];
                        updateFieldData(index, { options: newOpts });
                      }}
                      className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 hover:text-[#3cb4e4] hover:bg-[#3cb4e408] transition-all p-2 rounded-lg border border-dashed border-gray-200 mt-1"
                    >
                      <Plus size={12} /> Add Choice
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FieldsManagementSection;