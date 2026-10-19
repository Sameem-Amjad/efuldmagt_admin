import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange, themeColor = "#3cb4e4" }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Showing page <span className="font-semibold text-gray-700">{currentPage}</span> of {totalPages}
      </div>
      
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1.5">
          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            const isActive = currentPage === pageNum;
            
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
                  isActive ? 'text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
                }`}
                style={isActive ? { backgroundColor: themeColor } : {}}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;