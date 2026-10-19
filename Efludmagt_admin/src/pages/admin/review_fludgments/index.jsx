import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    MoreVertical, Calendar, Eye, EyeOff,
    ChevronLeft, ChevronRight, Edit2, Trash2, Search, X
} from 'lucide-react';
import { fetchFuldmagtForms, deleteFuldmagtForm, searchFuldmagtForms } from "@/redux/features/fludgmentsforms/formThunk";
import ConfirmationModal from "./components/confimationModal";
import Pagination from "./components/pagination"; // ✅ Imported Pagination
import { toast } from "react-hot-toast";

const ReviewFludgments = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const themeColor = "#3cb4e4";
    const dropdownRef = useRef(null);
    const itemsPerPage = 10;

    // Redux State
    const { forms, loading, totalForms } = useSelector((state) => state.reveiwForm);

    // Local UI State
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Pagination Calculation
    const totalPages = totalForms||1 ;

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                dispatch(searchFuldmagtForms(searchTerm));
            } else {
                dispatch(fetchFuldmagtForms({ page: currentPage, limit: itemsPerPage }));
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [dispatch, currentPage, searchTerm]);

    const getVisibilityLabel = (visibleTo) => {
        if (visibleTo === 'specificUsersAndCompanies') return 'Custom';
        if (visibleTo === 'everyone') return 'Public';
        if (visibleTo === 'allCompanies') return 'Companies Only';
        if (visibleTo === 'allUsers') return 'User Only';
        return 'Private';
    };

    const openDeleteModal = (id) => {
        setSelectedId(id);
        setIsDeleteModalOpen(true);
        setActiveDropdown(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedId) return;
        setIsDeleting(true);
        try {
            await dispatch(deleteFuldmagtForm(selectedId)).unwrap();
            toast.success("Fuldmagt deleted successfully");
            setIsDeleteModalOpen(false);
        } catch (err) {
            toast.error(err || "Failed to delete");
        } finally {
            setIsDeleting(false);
            setSelectedId(null);
        }
    };

    const handleEditNavigate = (item) => {
        setActiveDropdown(null);
        navigate(`/admin/editfludgment/${item._id}`, { state: { fuldmagtData: item } });
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        setActiveDropdown(null);
    };

    // ✅ Logic to find the selected item for the dynamic modal message
    const selectedItem = forms.find(f => f._id === selectedId);

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-full mx-auto">
                <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">

                    {/* Header Section */}
                    <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row items-center gap-6">
                        <div className="flex flex-col min-w-fit">
                            <h2 className="text-xl font-bold text-gray-800">Review Fludgments</h2>
                            <p className="text-xs text-gray-500">Manage and search your forms</p>
                        </div>
                        
                        {/* Left-Aligned Search Bar */}
                        <div className="relative w-full max-w-md mr-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input 
                                type="text"
                                placeholder="Search by title..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 focus:bg-white"
                                style={{ '--tw-ring-color': themeColor }}
                            />
                            {searchTerm && (
                                <button 
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <button
                            className="text-white px-6 py-2 rounded-lg font-semibold shadow-sm transition-all hover:brightness-105 active:scale-95 whitespace-nowrap ml-auto md:ml-0"
                            style={{ backgroundColor: themeColor }}
                            onClick={() => navigate('/admin/EfuldmagtForm/create-fuldmagt')}
                        >
                            + Create New
                        </button>
                    </div>

                    {/* Table Section */}
                    <div className="overflow-visible min-h-[400px] relative">
                        {loading && (
                            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${themeColor} transparent ${themeColor} ${themeColor}` }}></div>
                            </div>
                        )}
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 uppercase text-[11px] font-bold tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-4">Fuldmagt Name</th>
                                    <th className="px-6 py-4">Visibility</th>
                                    <th className="px-6 py-4">Used Count</th> {/* ✅ Added Column Header */}
                                    <th className="px-6 py-4">Created At</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {forms.length > 0 ? forms.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 border overflow-hidden">
                                                    <img src={item.icon} alt="" className="w-6 h-6 object-contain" />
                                                </div>
                                                <span className="font-semibold text-gray-700">{item.title}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold border uppercase"
                                                style={{
                                                    backgroundColor: 'rgba(60, 180, 228, 0.1)',
                                                    color: themeColor,
                                                    borderColor: 'rgba(60, 180, 228, 0.2)'
                                                }}
                                            >
                                                {item.visibleTo === 'everyone' ? <Eye size={12} /> : <EyeOff size={12} />}
                                                {getVisibilityLabel(item.visibleTo)}
                                            </span>
                                        </td>

                                        {/* ✅ Added Table Data Cell for usedCounts */}
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {item.usedCounts || 0}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>

                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === item._id ? null : item._id)}
                                                className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {activeDropdown === item._id && (
                                                <div ref={dropdownRef} className="absolute right-6 mt-2 w-36 bg-white border rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                    <button
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
                                                        onClick={() => handleEditNavigate(item)}
                                                    >
                                                        <Edit2 size={16} style={{ color: themeColor }} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 border-t border-gray-50 transition-colors"
                                                        onClick={() => openDeleteModal(item._id)}
                                                    >
                                                        <Trash2 size={16} />
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-400 font-medium">
                                            {loading ? "Searching..." : "No forms found matching your criteria."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ✅ Integrated Pagination Component */}
                    {!searchTerm && (
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                            <Pagination 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={paginate}
                                themeColor={themeColor}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                isLoading={isDeleting}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Fuldmagt?"
                // ✅ Dynamic warning message based on usedCounts
                message={selectedItem?.usedCounts > 0 
                    ? "Warning: This Fuldmagt has already been used by users. Deleting it may cause issues for users. Are you sure you want to proceed?" 
                    : "Are you sure you want to delete this form? This action cannot be undone."
                }
            />
        </div>
    );
};

export default ReviewFludgments;