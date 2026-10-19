import React, { useState } from "react";
import { Search, X, User, Building2 } from "lucide-react";

const SelectedEntitiesList = ({ 
  title, 
  type = "user", 
  selectedItems, 
  onRemove, 
  exceptChecked, 
  onExceptChange 
}) => {
  const [filterTerm, setFilterTerm] = useState("");

  const filteredDisplay = selectedItems.filter(item => {
    if (!item) return false;
    const term = filterTerm.toLowerCase();
    const name = (item.firstName || "").toLowerCase();
    const lastName = (item.lastName || "").toLowerCase();
    const email = (item.email || "").toLowerCase();
    return name.includes(term) || lastName.includes(term) || email.includes(term);
  });

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">
          {type === "user" ? <User size={18} className="text-gray-600" /> : <Building2 size={18} className="text-gray-600" />}
        </div>
        <h4 className="font-bold text-gray-800">{title}</h4>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          placeholder={`Filter ${selectedItems.length} selected...`}
          className="w-full pl-9 pr-4 py-2 text-xs border border-gray-100 rounded-lg focus:outline-none focus:border-[#3cb4e4] bg-white transition-all"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 mb-4 custom-scrollbar min-h-0">
        {filteredDisplay.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 bg-gray-50/30 rounded-xl border border-dashed border-gray-100">
            <p className="text-xs text-gray-400 italic">
              {selectedItems.length === 0 ? "No selections made" : "No results match your filter"}
            </p>
          </div>
        ) : (
          filteredDisplay.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 group hover:border-[#3cb4e4] transition-all"
            >
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-gray-700 truncate">
                  {item.firstName} {item.lastName || ""}
                </span>
                {type === "user" && (
                  <span className="text-[10px] text-gray-400 truncate">{item.email}</span>
                )}
              </div>
              <button 
                onClick={() => onRemove(item.id)} 
                className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-100 transition-colors shadow-sm"
              >
                <X size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center space-x-2 bg-white">
        <input 
          type="checkbox" 
          id={`except-${title}`} 
          className="w-4 h-4 rounded border-gray-300 text-[#3cb4e4] focus:ring-[#3cb4e4] cursor-pointer"
          checked={exceptChecked}
          onChange={(e) => onExceptChange(e.target.checked)}
        />
        <label htmlFor={`except-${title}`} className="text-xs font-semibold text-gray-500 cursor-pointer select-none">
          Everyone Except Selected
        </label>
      </div>
    </div>
  );
};

export default SelectedEntitiesList;