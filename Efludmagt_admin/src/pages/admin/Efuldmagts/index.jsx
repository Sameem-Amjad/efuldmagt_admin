import { AdminContentLayout } from "@/layouts/AdminContentLayout";
import { useState, useMemo, useEffect, useCallback } from "react";
import { ChevronDown, Search } from "lucide-react";
import Loader from "@/components/global/Loaders/Loader";
import { useDispatch, useSelector } from 'react-redux';
import { fetchFuldmagts, deleteFuldmagt } from '@/redux/features/fuldmagts/fuldmagtsThunk';
import VisibilityPage from "./components/VisibilityPage";
import DetailsModal from "./components/DetailsModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import toast from "react-hot-toast";



export default function Efuldmagts() {
  const [view, setView] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [validityFilter, setValidityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("Post");
  const [sortOrder, setSortOrder] = useState("Latest First");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const dispatch = useDispatch();
  const { data: rawData, loading, error } = useSelector((state) => state.fuldmagts);
  const itemsPerPage = 30;

  // Map raw data to UI format
const records = useMemo(() => {
    if (!Array.isArray(rawData)) {
      return [];
    }

    return rawData.map((item, i) => {
      // Determine validity status
      let validityStatus = "Active";
      let statusClass = "bg-green-100 text-green-600";
      
      if (item.validity === "expired") {
        validityStatus = "Expired";
        statusClass = "bg-red-100 text-red-600";
      } else if (item.validity === "request") {
        validityStatus = "Pending"; // CHANGED FROM "Revoked" TO "Pending"
        statusClass = "bg-blue-100 text-blue-600"; // Changed to blue for distinction
      }

      // We'll add a separate check for revoked if you need it
      if (item.revoked === true) {
        validityStatus = "Revoked";
        statusClass = "bg-yellow-100 text-yellow-600";
      }

      return {
        ...item,
        id: item._id || `server-id-${i}`,
        createdAt: new Date(item.createdAt).toLocaleString(),
        starts: new Date(item.createdAt).toLocaleString(),
        ends: item.expiry ? new Date(item.expiry).toLocaleString() : "N/A",
        type: item.accountType === "user" ? "Post" : "Another",
        validity: validityStatus,
        statusClass: statusClass,
      };
    });
  }, [rawData]);

  useEffect(() => {
    dispatch(fetchFuldmagts());
  }, [dispatch]);

  // Filter and search logic
   const filteredRecords = useMemo(() => {
    let filteredData = [...records];

    // 1. Filter by search term
    if (searchTerm) { // From: filters.searchTerm, To: searchTerm
      const term = searchTerm.toLowerCase(); // From: filters.searchTerm, To: searchTerm
      filteredData = filteredData.filter(item =>
        item.id.toLowerCase().includes(term) ||
        item.fuldmagtGiverName?.toLowerCase().includes(term) ||
        item.agentName?.toLowerCase().includes(term)
      );
    }

    // 2. Filter by validity
    if (validityFilter !== "All") { // From: filters.validityFilter, To: validityFilter
      filteredData = filteredData.filter(item => item.validity === validityFilter); // From: filters.validityFilter, To: validityFilter
    }

    // 3. Filter by type
    if (typeFilter !== "") { // From: filters.typeFilter, To: typeFilter
      filteredData = filteredData.filter(item => item.type === typeFilter); // From: filters.typeFilter, To: typeFilter
    }

    // 4. Apply sorting
    filteredData.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      // From: filters.sortOrder, To: sortOrder
      return sortOrder === "Latest First" ? dateB - dateA : dateA - dateB;
    });

    return filteredData;
  }, [records, searchTerm, validityFilter, typeFilter, sortOrder]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentItems = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Modal & Deletion Handlers
  const openModal = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecord(null);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };

const handleDelete = async () => {
  if (selectedRecord) {
    setIsDeleting(true);
    try {
      await dispatch(deleteFuldmagt(selectedRecord.id)).unwrap();

      toast.success('Fuldmagt deleted successfully!');

      setShowDeleteConfirm(false);
      setShowModal(false);
      setSelectedRecord(null);

    } catch (rejectedValue) {
      console.error('Failed to delete fuldmagt:', rejectedValue);
      toast.error(rejectedValue || 'Failed to delete record.');
      
    } finally {
      setIsDeleting(false); // Reset loading state
    }
  }
};

  const handleEditVisibility = () => {
    setShowModal(false);
    setView("visibility");
  };

  const handleBack = () => {
    setView("list");
  };

  // Main list page content
  const ListPage = useCallback(() => {
    if (loading) {
      return (
        <AdminContentLayout>
          <div className="p-6">
            <div className="flex items-center justify-center h-32">
              <Loader className="w-8 h-8 mr-2" />
            </div>
          </div>
        </AdminContentLayout>
      );
    }

    return (
      <AdminContentLayout>
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">All e-fuldmagts</h1>

          {/* Top Filters & Search */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center w-full md:w-1/3 bg-white border border-gray-300 rounded-full px-3 py-2 text-sm">
              <Search  className="w-4 h-4 text-[#FF5B19] mr-2" />
              <input
                type="text"
                className="w-full focus:outline-none"
                placeholder="Search by e-fuldmag ID, user's name"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-8 text-sm text-gray-700 focus:outline-none"
                  value={validityFilter}
                  onChange={(e) => {
                    setValidityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All</option>
                  <option value="Expired">Expired</option>
                  <option value="Revoked">Revoked</option>
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute top-2.5 right-3 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-7 text-sm text-gray-700 focus:outline-none"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="Post">Post</option>
                  <option value="Another">Another</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute top-2.5 right-3 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  className="appearance-none bg-white border border-gray-300 rounded-lg py-2 px-7 text-sm text-gray-700 focus:outline-none"
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="Latest First">Latest First</option>
                  <option value="Oldest First">Oldest First</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute top-2.5 right-3 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-auto bg-white border border-gray-300 rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-gray-700 text-sm font-semibold border-b border-gray-300">
                <tr>
                  <th className="py-3 px-4">e-fuldmag ID</th>
                  <th className="py-3 px-4">Created at</th>
                  <th className="py-3 px-4">Starts</th>
                  <th className="py-3 px-4">Ends</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Validity</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => openModal(item)}
                  >
                    <td className="py-3 px-4">{item.id}</td>
                    <td className="py-3 px-4">{item.createdAt}</td>
                    <td className="py-3 px-4">{item.starts}</td>
                    <td className="py-3 px-4">{item.ends}</td>
                    <td className="py-3 px-4">{item.type}</td>
                    <td className="py-3 px-4">
                      {item.validity === "Expired" ||
                      item.validity === "Revoked" ? (
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${item.statusClass}`}
                        >
                          {item.validity}
                        </span>
                      ) : (
                        <span className="text-gray-700">
                          {item.validity}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer with record count and pagination */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4">
            <div className="text-sm text-gray-600">
              Total Records: {filteredRecords.length}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                  <button
                    key={pageIndex}
                    onClick={() => setCurrentPage(pageIndex + 1)}
                    className={`px-3 py-1 border border-gray-300 text-sm rounded-full ${
                      currentPage === pageIndex + 1
                        ? "bg-[#3CB4E4] text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {pageIndex + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Use the separated modal components */}
        {showModal && selectedRecord && (
          <DetailsModal
            selectedRecord={selectedRecord}
            onClose={closeModal}
            onDelete={confirmDelete}
            onEditVisibility={handleEditVisibility}
          />
        )}

        {showDeleteConfirm && (
          <DeleteConfirmModal
            onClose={closeDeleteConfirm}
            onConfirm={handleDelete}
            isLoading={isDeleting}
          />
        )}
      </AdminContentLayout>
    );
  }, [loading,
    searchTerm,
    setSearchTerm, // <-- Add this
    validityFilter,
    setValidityFilter, // <-- Add this
    typeFilter,
    setTypeFilter, // <-- Add this
    sortOrder,
    setSortOrder, // <-- Add this
    currentPage,
    setCurrentPage, // <-- Add this
    currentItems,
    filteredRecords,
    totalPages,
    showModal,
    selectedRecord,
    openModal,
    closeModal,
    confirmDelete,
    closeDeleteConfirm,
    handleDelete,
    handleEditVisibility,
    showDeleteConfirm
  ]
  );
  return view === "list" ? ListPage()  : <VisibilityPage onBack={handleBack} fuldmagtId={selectedRecord?.fuldmagtFormId} />;
}