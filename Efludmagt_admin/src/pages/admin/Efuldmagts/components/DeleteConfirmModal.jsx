export default function DeleteConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6 relative text-center">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="mb-4 mt-2 flex justify-center">
          <div className="bg-red-100 p-3 rounded-full">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M3 6h18M9 6v12m6-12v12M4 6a2 2 0 012-2h12a2 2 0 012 2h0a2 2 0 
               01-2 2H6a2 2 0 01-2-2h0" />
            </svg>
          </div>
        </div>
        <div className="text-lg font-semibold mb-2">
          Are you sure you want to{" "}
          <span className="text-red-600">delete</span> post e-fuldmagt
          completely?
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}