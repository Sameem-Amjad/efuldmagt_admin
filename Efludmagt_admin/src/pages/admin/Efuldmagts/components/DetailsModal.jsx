export default function DetailsModal({ 
  selectedRecord, 
  onClose, 
  onDelete, 
  onEditVisibility 
}) {
  if (!selectedRecord) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold">
            {selectedRecord.title || "Post e-fuldmagt"}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
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
        </div>

        {/* Modal Content */}
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="flex-shrink-0 bg-gray-50 p-4 rounded-lg w-full md:w-1/3 flex flex-col items-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M12 8c-1.12 0-2.03.9-2.03 2.03h4.06C14.03 8.9 13.12 8 12 8z" />
                <path d="M6.13 16A10 10 0 018.43 9.5C9.5 8.4 10.7 7.63 12 7.26c1.3.37 2.5 1.14 3.57 2.24A10 10 0 0117.87 16M12 2a10 10 0 00-4 19.24M12 2a10 10 0 014 19.24" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {selectedRecord.fuldmagtGiverName ?? "N/A"}
              </div>
              <div className="text-gray-500 text-sm">
                {selectedRecord.agentName ?? "Agent Name"}
              </div>
              <div className="text-gray-700 text-sm mt-1">
                {selectedRecord.purchaseType ?? "Bank e-fuldmagte"}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1">
            {/* Date Fields */}
            <div className="flex gap-4 mb-4">
              <div className="flex flex-col text-sm">
                <label className="text-gray-700 font-medium mb-1">
                  From
                </label>
<input
  type="date"
  disabled
  defaultValue={
    selectedRecord.createdAt && !isNaN(new Date(selectedRecord.createdAt))
      ? new Date(selectedRecord.createdAt).toISOString().slice(0, 10)
      : ""
  }
  className="border border-gray-300 rounded px-3 py-2 text-sm"
/>
              </div>
              <div className="flex flex-col text-sm">
                <label className="text-gray-700 font-medium mb-1">
                  To
                </label>
<input
  type="date"
  disabled
  defaultValue={
    selectedRecord.expiry && !isNaN(new Date(selectedRecord.expiry))
      ? new Date(selectedRecord.expiry).toISOString().slice(0, 10)
      : ""
  }
  className="border border-gray-300 rounded px-3 py-2 text-sm"
/>
              </div>
            </div>

            {/* Table-like info */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <div className="font-medium mb-1">Signed</div>
                <div className="bg-gray-100 p-2 rounded">
                  {selectedRecord.fuldmagtGiverSignature
                    ? "Yes (Fuldmagt Giver Signature)"
                    : "No"}
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">
                  Sent (Waiting Signature)
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  {selectedRecord.agentName ? "Yes" : "No"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium mb-1">Valid</div>
                <div className="bg-gray-100 p-2 rounded">
                  {selectedRecord.validity === "Expired" ||
                  selectedRecord.validity === "Revoked"
                    ? "No"
                    : "Yes"}
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">Revoked</div>
                <div className="bg-gray-100 p-2 rounded">
                  {selectedRecord.revoked ? "Yes" : "No"}
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">Expired</div>
                <div className="bg-gray-100 p-2 rounded">
                  {selectedRecord.validity === "Expired" ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between mt-6 border-t pt-3">
          <button
            className="text-red-600 font-medium hover:text-red-800"
            onClick={onDelete}
          >
            Delete
          </button>
          <button
            className="bg-blue-500 text-white font-medium rounded px-4 py-2 hover:bg-blue-600"
            onClick={onEditVisibility}
          >
            Edit Visibility
          </button>
        </div>
      </div>
    </div>
  );
}