import Loader from "@/components/global/Loaders/Loader";
import { AdminContentLayout } from "@/layouts/AdminContentLayout";
import { Clock, Home, Phone, Search, Trash2 } from 'lucide-react';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchEntities, deleteEntity, suspendEntity, fetchApprovalRequests, handleApprovalAction ,reactivateEntity} from '@/redux/features/users/usersThunk';
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

// Utility function to truncate text
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
};

// TruncatedText Component with Tooltip
const TruncatedText = ({ text, maxLength }) => {
  const isTruncated = text.length > maxLength;
  const displayText = truncateText(text, maxLength);

  return (
    <span
      className="truncate block"
      title={isTruncated ? text : ""}
      aria-label={isTruncated ? text : undefined}
    >
      {displayText}
    </span>
  );
};


const Users = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Confirmation modals
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isSuspendConfirmOpen, setIsSuspendConfirmOpen] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterValidity, setFilterValidity] = useState("All");
  const [sortOrder, setSortOrder] = useState("Latest First");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState("");


  const dispatch = useDispatch();
  const { users, companies, approvalRequests, loading, error } = useSelector((state) => state.users);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    if (activeTab === 'approvalRequests') {
      dispatch(fetchApprovalRequests());
    } else {
      dispatch(fetchEntities(activeTab));
    }
  }, [activeTab, dispatch]);

  const handleDeleteConfirm = async () => {
    setIsProcessing(true); // <-- ADD THIS
    setProcessError("");
    try {
      await dispatch(deleteEntity({ 
        id: selectedUser.id, 
        type: activeTab
      })).unwrap();
      closeAllModals();
      toast.success(`${selectedUser.type} deleted successfully!`);
    } catch (err) {
      toast.error(typeof err === "string" && err ? err : "Failed to delete the user. Please try again.");
      setProcessError(err);
    }
    finally{
      setIsProcessing(false)
    }
  };

  const handleSuspendConfirm = async () => {
    setIsProcessing(true); // <-- ADD THIS
    setProcessError("");
    try {
      await dispatch(suspendEntity({ 
        id: selectedUser.id, 
        type: activeTab
      })).unwrap();
      closeAllModals();
      toast.success(`${selectedUser.type} suspended successfully!`);
    } catch (err) {
      toast.error(typeof err === "string" && err ? err : "Failed to suspend the user. Please try again.");
      setProcessError(err);
    }finally{
      setIsProcessing(false);
    }
  }

  const handleApproval = async (requestId, action) => {
    try {
      await dispatch(handleApprovalAction({ requestId, action })).unwrap();
      toast.success(`Request ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    } catch (err) {
      toast.error(`Failed to ${action} the request. Please try again.`);
    }
  };
  const handleReactivate = async () => {
    // Manages the loading state for the button
    setIsProcessing(true); 
    setProcessError("");

    try {
      await dispatch(reactivateEntity({
        id: selectedUser.id,
        type: activeTab
      })).unwrap();
      
      closeModal(); // Closes the main profile modal on success
      toast.success(`${selectedUser.type} reactivated successfully!`);

    } catch (err) {
      toast.error(typeof err === "string" && err ? err : "Failed to reactivate. Please try again.");
      // Shows error inside the modal
      setProcessError(err.message || "An unknown error occurred."); 
    } finally {
      // Resets the loading state
      setIsProcessing(false); 
    }
  };
 
  /**
   * Whenever the data, search, or filters change, re-filter the rows.
   */
  useEffect(() => {
    filterAndSortRows();
    setCurrentPage(1); // reset to first page
  }, [activeTab]); // Removed unnecessary dependencies

  const filterAndSortRows = () => {
    if (activeTab === 'approvalRequests') {
      let tempRows = [...approvalRequests];
      
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        tempRows = tempRows.filter(
          (row) =>
            row.requestedBy.toLowerCase().includes(query) ||
            row.companyName.toLowerCase().includes(query) ||
            row.cvrNumber.includes(query)
        );
      }

      if (sortOrder === "Latest First") {
        tempRows.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
      } else if (sortOrder === "Oldest First") {
        tempRows.sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate));
      }

      return tempRows;
    }

    // Get the correct data based on activeTab
    const currentData = activeTab === "users" ? users : companies;
    
    let tempRows = [...currentData];
  
    // Apply your filters
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      tempRows = tempRows.filter(
        (row) =>
          row.firstName.toLowerCase().includes(query) ||
          row.lastName.toLowerCase().includes(query) ||
          row.email.toLowerCase().includes(query) ||
          row.address.toLowerCase().includes(query) ||
          row.phone.includes(query)
      );
    }
  
    // Validity filter
    if (filterValidity !== "All") {
      tempRows = tempRows.filter((row) => row.validity === filterValidity);
    }
  
    // Sorting
    if (sortOrder === "Latest First") {
      tempRows.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
    } else if (sortOrder === "Oldest First") {
      tempRows.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate));
    }
  
    return tempRows;
  };

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setProcessError(""); // Reset any previous errors
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setProcessError(""); // Reset any previous errors
  };

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDeleteConfirmOpen(false);
    setIsSuspendConfirmOpen(false);
    setProcessError(""); // Reset any previous errors
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleSuspendClick = () => {
    setIsSuspendConfirmOpen(true);
  };

  const handleEditClick = () => {
    // Handle edit logic here
    setIsModalOpen(false);
    navigate(
      `/admin/${activeTab}/edit-${activeTab.slice(0, -1)}/${selectedUser.id}`
    );
    // Example: `/admin/users/edit-user/{id}` or `/admin/companies/edit-company/{id}`
  };

 


  // Pagination calculations
  const filteredRows = filterAndSortRows();
  const totalRecords = filteredRows.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const entityType = activeTab === "users" ? "user" : "company";

  return (
    <AdminContentLayout>
      <div className="bg-gray-50 p-6">
        <h1 className="text-lg font-semibold text-black mb-4">
          {activeTab === "approvalRequests" ? "Approval Requests" : 
           activeTab === "users" ? "All Users" : "All Companies"}
        </h1>

        {/* Search and Filter Bar */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search by ${
                activeTab === "users"
                  ? "first name, last name, VAT number, or e-mail"
                  : activeTab === "companies"
                  ? "company name, VAT number, or e-mail"
                  : "requested by, company name, or CVR number"
              }`}
              className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2 text-gray-400">
              <Search className="w-5 h-5 text-[#FF5B19]" />
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Validity:</span>
              <select
                value={filterValidity}
                onChange={(e) => setFilterValidity(e.target.value)}
                className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none"
                disabled={activeTab === 'approvalRequests'}
              >
                <option>All</option>
                <option>Valid</option>
                <option>Expired</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Sort by:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none"
              >
                <option>Latest First</option>
                <option>Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col gap-6 p-6 items-center justify-center">
          <div className="bg-gray-100 flex rounded-full overflow-hidden">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 text-sm rounded-full font-medium ${
                activeTab === "users"
                  ? "bg-[#3CB4E4] text-white"
                  : "text-gray-700"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("companies")}
              className={`px-4 py-2 text-sm rounded-full font-medium ${
                activeTab === "companies"
                  ? "bg-[#3CB4E4] text-white"
                  : "text-gray-700"
              }`}
            >
              Companies
            </button>
            <button
              onClick={() => setActiveTab("approvalRequests")}
              className={`px-4 py-2 text-sm rounded-full font-medium ${
                activeTab === "approvalRequests"
                  ? "bg-[#3CB4E4] text-white"
                  : "text-gray-700"
              }`}
            >
              Approval Requests
            </button>
          </div>
        </div>

        {/* Display Processing Error (if any) */}
        {processError && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {processError}
          </div>
        )}

        {/* Table or Loading State */}
        {loading ? (
          <div className="text-center py-6">
            <Loader />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-md overflow-x-auto">
            {activeTab === "approvalRequests" ? (
              // Approval Requests Table
              <table className="min-w-full table-fixed text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4 w-1/6">Requested by</th>
                    <th className="py-3 px-4 w-1/6">CVR number</th>
                    <th className="py-3 px-4 w-1/6">Company Name</th>
                    <th className="py-3 px-4 w-1/6">Phone Number</th>
                    <th className="py-3 px-4 w-1/6">Address</th>
                    <th className="py-3 px-4 w-1/6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedRows.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={request.avatar || "/placeholder.svg"}
                            alt=""
                            className="w-8 h-8 rounded-full"
                          />
                          <TruncatedText text={request.requestedBy} maxLength={20} />
                        </div>
                      </td>
                      <td className="py-3 px-4">{request.cvrNumber}</td>
                      <td className="py-3 px-4">
                        <TruncatedText text={request.companyName} maxLength={20} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={request.countryFlag || "/placeholder.svg"}
                            alt=""
                            className="w-4 h-4"
                          />
                          {request.phoneNumber}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <TruncatedText text={request.address} maxLength={30} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApproval(request.id, 'reject')}
                            className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-full hover:bg-red-600"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproval(request.id, 'approve')}
                            className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-full hover:bg-green-600"
                          >
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // Existing Users/Companies Table
              <table className="min-w-full table-fixed text-sm text-left text-gray-700">
                <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                  <tr>
                    <th className="py-3 px-4 w-1/5">First Name</th>
                    <th className="py-3 px-4 w-1/5">Last Name</th>
                    <th className="py-3 px-4">E-mail</th>
                    <th className="py-3 px-4">User Since</th>
                    <th className="py-3 px-4">Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedRows.length > 0 ? (
                    paginatedRows.map((row) => (
                      <tr
                        key={row.id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleRowClick(row)}
                      >
                        {/* First Name with Tooltip */}
                        <td className="py-3 px-4">
                          <TruncatedText text={row.firstName} maxLength={20} />
                        </td>

                        {/* Last Name with Tooltip */}
                        <td className="py-3 px-4">
                          <TruncatedText text={row.lastName} maxLength={20} />
                        </td>

                        {/* E-mail with Tooltip */}
                        <td className="py-3 px-4">
                          <TruncatedText text={row.email} maxLength={30} />
                        </td>

                        <td className="py-3 px-4">{row.since}</td>
                        <td className="py-3 px-4">
                          {row.activity === "Active" && (
                            <span className="inline-block bg-[#3CB4E414] text-[#3CB4E4] text-xs font-medium px-2 py-1 rounded-full">
                              Active
                            </span>
                          )}
                          {row.activity === "Suspended" && (
                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                              Suspended
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-4 px-4 text-center" colSpan="5">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 text-sm text-gray-600">
              <div>Total Records: {totalRecords}</div>
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                    disabled={totalPages === 0 || currentPage === 1}

                  className={`px-2 py-1 rounded-full ${
                    currentPage === 1 ||totalPages===0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        page === currentPage
                          ? "bg-[#3CB4E4] text-white"
                          : "bg-white text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* Next Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, totalPages)
                    )
                  }
                  disabled={totalPages === 0||currentPage === totalPages }
                  className={`px-2 py-1 rounded-full ${
  totalPages === 0 || currentPage === totalPages // Matches the disabled logic
    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
    : "bg-white text-gray-700 hover:bg-gray-200"
}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User/Company Profile Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-3xl rounded-lg p-6 relative overflow-y-auto max-h-screen">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Close</span>
              &times;
            </button>

            {/* Modal Content */}
            <h2 className="text-xl font-semibold mb-4">
              {selectedUser.type === "User"
                ? "User Profile"
                : "Company Profile"}
            </h2>
            <div className="flex flex-col md:flex-row md:gap-8">
              {/* Left Column - User/Company Info */}
              <div className="bg-[#F6FBFF] p-4 rounded-md mb-4 md:mb-0 w-full md:w-1/3 text-gray-700 whitespace-pre-line">
                <h3 className="text-2xl font-semibold mb-4">
                  <TruncatedText
                    text={`${selectedUser.firstName} ${selectedUser.lastName}`}
                    maxLength={25}
                  />
                </h3>
                <div className="flex items-start gap-2 mb-2 text-sm">
                  <div className="text-[#3CB4E4]">@</div>
                  <div>
                    <TruncatedText
                      text={selectedUser.email}
                      maxLength={30}
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2 mb-2 text-sm">
                  <div className="text-[#3CB4E4]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <TruncatedText
                      text={selectedUser.phone}
                      maxLength={20}
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2 mb-2 text-sm">
                  <div className="text-[#3CB4E4]">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <TruncatedText
                      text={selectedUser.address}
                      maxLength={30}
                    />
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <div className="text-[#3CB4E4]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    Joined on{" "}
                    {new Date(selectedUser.joinDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Latest Activity */}
              <div className="w-full md:w-2/3">
                <h4 className="text-lg font-medium mb-2">Latest Activity</h4>
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                      <tr>
                        <th className="py-2 px-4 font-light">Date</th>
                        <th className="py-2 px-4 font-light">IP Address</th>
                        <th className="py-2 px-4 font-light">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm font-light">
                      {selectedUser.activities &&
                      selectedUser.activities.length > 0 ? (
                        selectedUser.activities.map((act, i) => (
                          <tr key={i}>
                            <td className="py-2 px-4">{act.date}</td>
                            <td className="py-2 px-4">{act.ip}</td>
                            <td className="py-2 px-4">{act.action}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-4 px-4 text-center">
                            No recent activities.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
{/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 mt-6">
            <button
              onClick={handleDeleteClick}
              className="text-red-600 font-medium hover:underline"
            >
              Delete
            </button>
            
            {/* --- START OF CONDITIONAL BUTTON --- */}
            {selectedUser.locked ? (
              // If user is locked, show "Reactivate"
              <button
                onClick={handleReactivate}
                disabled={isProcessing} // Disable button while processing
                className="bg-green-50 border border-green-200 text-green-600 font-medium px-4 py-2 rounded-md hover:bg-green-100 disabled:bg-green-100 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Reactivating..." : "Reactivate"}
              </button>
            ) : (
              // If user is not locked, show "Suspend"
              <button
                onClick={handleSuspendClick}
                className="bg-orange-50 border border-orange-200 text-orange-600 font-medium px-4 py-2 rounded-md hover:bg-orange-100"
              >
                Suspend
              </button>
            )}
            {/* --- END OF CONDITIONAL BUTTON --- */}
            
            <button
              onClick={handleEditClick}
              className="bg-blue-50 border border-blue-200 text-blue-600 font-medium px-4 py-2 rounded-md hover:bg-blue-100"
            >
              Edit
            </button>
          </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-sm rounded-lg p-6 relative flex flex-col items-center">
            <button
              onClick={() => setIsDeleteConfirmOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Close</span>
              &times;
            </button>

            {/* Delete Icon */}
            <div className="mb-4">
              <Trash2 size={35} color="#EF4444" />
            </div>

            <p className="text-center mb-6 text-sm font-medium text-gray-700">
              Are you sure you want to{" "}
              <span className="text-red-600">delete</span> this {entityType}{" "}
              completely?
            </p>

            {/* Display processing error if any */}
            {processError && (
              <p className="text-red-500 text-sm mb-4">{processError}</p>
            )}

            <div className="flex items-center w-full gap-4 justify-center">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="border border-gray-200 bg-gray-50 text-gray-700 font-medium px-12 py-2 rounded-md hover:bg-gray-100"
              >
                No
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isProcessing}
                className={`font-medium px-12 py-2 rounded-md ${
                  isProcessing
                    ? "bg-red-300 text-white cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {isProcessing ? "Deleting..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {isSuspendConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-sm rounded-lg p-6 relative flex flex-col items-center">
            <button
              onClick={() => setIsSuspendConfirmOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Close</span>
              &times;
            </button>

            {/* Suspend Icon */}
            <div className="mb-4">
              <Clock size={35} color="#F59E0B" />
            </div>

            <p className="text-center mb-6 text-sm font-medium text-gray-700">
              Are you sure you want to{" "}
              <span className="text-orange-600">suspend</span> this {entityType}?
            </p>

            {/* Display processing error if any */}
            {processError && (
              <p className="text-red-500 text-sm mb-4">{processError}</p>
            )}

            <div className="flex items-center w-full gap-4 justify-center">
              <button
                onClick={() => setIsSuspendConfirmOpen(false)}
                className="border border-gray-200 bg-gray-50 text-gray-700 font-medium px-12 py-2 rounded-md hover:bg-gray-100"
              >
                No
              </button>
              <button
                onClick={handleSuspendConfirm}
                disabled={isProcessing || selectedUser.locked} // Additional check to prevent suspension if already locked
                className={`font-medium px-12 py-2 rounded-md ${
                  isProcessing || selectedUser.locked
                    ? "bg-orange-300 text-white cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {isProcessing ? "Suspending..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminContentLayout>
  );
};

export default Users;
