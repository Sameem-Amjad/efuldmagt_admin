"use client";
import React from "react";
import { FileText, Info, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

const StatementEditor = ({ statement, setStatement, availableFields, themeColor = "#3cb4e4" }) => {

  // ✅ Logic to insert placeholder INSIDE the last <p> tag
  const insertPlaceholder = (field) => {
    const placeholder = ` {{${field}}}`;
    
    // Check if the statement ends with a closing </p> tag
    if (statement.trim().endsWith("</p>")) {
      // Use regex to find the last </p> and insert before it
      const updatedValue = statement.replace(/<\/p>\s*$/, `${placeholder}</p>`);
      setStatement(updatedValue);
    } else if (statement.includes("<p>")) {
      // If no trailing </p> but <p> exists, find the last one and append
      const lastParagraphIndex = statement.lastIndexOf("</p>");
      if (lastParagraphIndex !== -1) {
          const updatedValue = 
            statement.substring(0, lastParagraphIndex) + 
            placeholder + 
            statement.substring(lastParagraphIndex);
          setStatement(updatedValue);
      } else {
          setStatement(statement + placeholder);
      }
    } else {
      // Fallback for plain text: wrap everything in <p> if not already there
      setStatement(`<p>${statement}${placeholder}</p>`);
    }
  };

  return (
    <div className="space-y-4 p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div className="space-y-1">
          <Label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <FileText size={18} style={{ color: themeColor }} /> 
            Fuldmagt Statement
          </Label>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">
            This text will appear on the final signed document.
          </p>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          className="w-full h-64 p-5 rounded-2xl border border-gray-200 focus:ring-2 outline-none font-medium text-gray-700 leading-relaxed bg-white shadow-sm transition-all text-sm"
          style={{ '--tw-ring-color': themeColor }}
          placeholder="Enter the legal statement here..."
        />
        
        {/* Placeholder Helper Toolbar */}
        <div className="mt-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} className="text-blue-500" />
            <span className="text-[10px] font-bold text-blue-600 uppercase">Available Placeholders</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableFields.length === 0 ? (
              <span className="text-[10px] text-gray-400 italic">No fields defined yet.</span>
            ) : (
              availableFields.map((field, idx) => (
                <button
                  key={idx}
                  onClick={() => insertPlaceholder(field)} // ✅ Updated to use new logic
                  className="px-2 py-1 bg-white border border-blue-200 rounded text-[10px] font-mono font-bold text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                  title="Click to insert"
                >
                  {`{{${field}}}`}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 px-1">
        <AlertCircle size={12} className="text-amber-500 mt-0.5" />
        <p className="text-[9px] text-gray-400 leading-tight">
          Ensure placeholders exactly match your field labels (e.g., {"{{FirstName}}"}). System variables will be synchronized upon saving.
        </p>
      </div>
    </div>
  );
};

export default StatementEditor;