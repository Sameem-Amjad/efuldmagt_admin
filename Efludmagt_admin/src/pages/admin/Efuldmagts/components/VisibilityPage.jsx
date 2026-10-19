import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdminContentLayout } from "@/layouts/AdminContentLayout";
import { fetchEntities } from "@/redux/features/users/usersThunk";
import { updateFuldmagtVisibility } from '@/redux/features/fuldmagts/fuldmagtsThunk';
import { resetVisibilityStatus } from '@/redux/features/fuldmagts/fuldmagtsSlice';
import { Loader2, Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';

const VisibilityPage = ({ onBack, fuldmagtId }) => {
    const dispatch = useDispatch();
    
    // Get loading status for entities
    const { loading: usersLoading, error: usersError } = useSelector((state) => state.users);
    // Get status for the visibility update API call
    const { visibilityUpdateStatus, error: updateError } = useSelector((state) => state.fuldmagts);

    const [visibility, setVisibility] = useState('custom');
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    
    // Derived loading state for the publish button
    const isPublishing = visibilityUpdateStatus === 'loading';

    useEffect(() => {
        // Log the received fuldmagtId to ensure it's passed correctly
        console.log("Editing visibility for Fuldmagt ID:", fuldmagtId);

        dispatch(fetchEntities("users")).then(result => {
            if (result.payload && Array.isArray(result.payload)) {
                setUsers(result.payload);
            }
        });
        dispatch(fetchEntities("companies")).then(result => {
            if (result.payload && Array.isArray(result.payload)) {
                setCompanies(result.payload);
            }
        });
    }, [dispatch, fuldmagtId]); // Added fuldmagtId to dependency array

    // useEffect to show toast feedback based on API call status
    useEffect(() => {
        if (visibilityUpdateStatus === 'succeeded') {
            toast.success("Visibility updated successfully!");
            onBack(); // Go back to the previous page on success
        }
        if (visibilityUpdateStatus === 'failed') {
            toast.error(updateError || "Failed to update visibility.");
        }
        
        // Clean up the status when the component unmounts
        return () => {
            dispatch(resetVisibilityStatus());
        };
    }, [visibilityUpdateStatus, updateError, onBack, dispatch]);

    const toggleUser = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const toggleCompany = (companyId) => {
        setSelectedCompanies(prev =>
            prev.includes(companyId)
                ? prev.filter(id => id !== companyId)
                : [...prev, companyId]
        );
    };

    const handleSelectAllUsers = () => {
        const allUserIds = users.map(u => u.id);
        if (selectedUsers.length === allUserIds.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(allUserIds);
        }
    };

    const handleSelectAllCompanies = () => {
        const allCompanyIds = companies.map(c => c.id);
        if (selectedCompanies.length === allCompanyIds.length) {
            setSelectedCompanies([]);
        } else {
            setSelectedCompanies(allCompanyIds);
        }
    };

    useEffect(() => {
        if (visibility !== 'custom') {
            setSelectedUsers([]);
            setSelectedCompanies([]);
        }
    }, [visibility]);

    const getDescriptionText = () => {
        switch (visibility) {
            case 'private': return "The Post e-fuldmagt will be visible for all private users only.";
            case 'companies': return "The Post e-fuldmagt will be visible for all companies only.";
            case 'custom': return "The Post e-fuldmagt will be visible only for the selected users and companies.";
            default: return "The Post e-fuldmagt is now visible for everyone. All private users and all companies can see and use it.";
        }
    };
    
    const handlePublish = () => {
        if (!fuldmagtId) {
            toast.error("Fuldmagt ID is missing. Cannot publish changes.");
            return;
        }
        if (visibility === 'custom') {
            const hasNoUsers = selectedUsers.length === 0;
            const hasNoCompanies = selectedCompanies.length === 0;

            if (hasNoUsers && hasNoCompanies) {
                toast.error("Please select at least one user or company for custom visibility.");
                return; // Stop the function here
            }
        }
        // Map the component's state to the API's expected values
        let visibileToValue = visibility;
        if (visibility === 'private') visibileToValue = 'privateusersonly';
        if (visibility === 'companies') visibileToValue = 'privatecompaniesonly';

        const payload = {
            fuldmagtId,
            body: {
                visibileTo: visibileToValue,
                userIds: selectedUsers,
                companyIds: selectedCompanies,
            }
        };

        console.log("Publishing with data:", payload);
        dispatch(updateFuldmagtVisibility(payload));
    };

    const radioOptions = [
        { value: 'everyone', label: 'Everyone' },
        { value: 'private', label: 'Private users only' },
        { value: 'companies', label: 'Companies only' },
        { value: 'custom', label: 'Custom' },
    ];

    return (
        <AdminContentLayout>
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <button onClick={onBack} className="mr-2 text-gray-700 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-semibold">Post e-fuldmagt form - Visibility</h1>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">Visibility</h2>
                    <div className="flex flex-col md:flex-row">
                        <div className="flex flex-col space-y-4 mr-8 w-full md:w-1/4 mb-6 md:mb-0">
                            {radioOptions.map(option => (
                                <label key={option.value} className="flex items-center text-sm cursor-pointer">
                                    <input
                                        type="radio" name="visibility" value={option.value}
                                        checked={visibility === option.value}
                                        onChange={() => setVisibility(option.value)}
                                        className="mr-2"
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </div>
                        <div className="flex-1">
                            <textarea
                                rows={6} readOnly value={getDescriptionText()}
                                className="w-full border border-gray-300 rounded p-3 text-sm bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                {visibility === 'custom' && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-lg border border-gray-200 bg-white">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">Private Users</h3>
                                {users.length > 0 && (
                                    <Button variant="link" className="p-0 h-auto text-sm" onClick={handleSelectAllUsers}>
                                        {selectedUsers.length === users.length ? 'Deselect All' : 'Select All'}
                                    </Button>
                                )}
                            </div>
                            {usersLoading ? (
                                <div className="flex justify-center items-center h-32"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
                            ) : usersError ? (
                                <div className="text-red-500">Error: {usersError}</div>
                            ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {users.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-2 rounded bg-gray-50">
                                            <span>{`${user.firstName} ${user.lastName}`}</span>
                                            <Button variant="ghost" size="sm" onClick={() => toggleUser(user.id)}>
                                                {selectedUsers.includes(user.id) ? <Check className="w-4 h-4 text-green-600" /> : <Circle className="w-4 h-4 text-gray-400" />}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <h3 className="font-semibold">Companies</h3>
                                {companies.length > 0 && (
                                     <Button variant="link" className="p-0 h-auto text-sm" onClick={handleSelectAllCompanies}>
                                        {selectedCompanies.length === companies.length ? 'Deselect All' : 'Select All'}
                                    </Button>
                                )}
                            </div>
                            {usersLoading ? ( // Assuming same loading state for both for simplicity
                                <div className="flex justify-center items-center h-32"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
                            ) : usersError ? ( // Assuming same error state
                                <div className="text-red-500">Error: {usersError}</div>
                            ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {companies.map((company) => (
                                        <div key={company.id} className="flex items-center justify-between p-2 rounded bg-gray-50">
                                            <span>{company.firstName}</span>
                                            <Button variant="ghost" size="sm" onClick={() => toggleCompany(company.id)}>
                                                {selectedCompanies.includes(company.id) ? <Check className="w-4 h-4 text-green-600" /> : <Circle className="w-4 h-4 text-gray-400" />}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="mt-6 flex justify-end">
                    <button 
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPublishing ? 'Publishing...' : 'Publish Visibility'}
                    </button>
                </div>
            </div>
        </AdminContentLayout>
    );
};

export default VisibilityPage;
