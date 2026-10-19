import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  ArrowLeft, Save, ChevronDown, 
  Search, Eye, EyeOff, Loader2 
} from "lucide-react";

import { fetchEntities } from "@/redux/features/users/usersThunk";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import SelectedEntitiesList from "./components/SelectedEntitiesList";
import MediaUploadSection from "./components/MediaUploadSection";
import UpdateTitleSection from "./components/UpdateTitleSection";
import FieldsManagementSection from "./components/FieldsManagementSection";
import StatementEditor from "./components/StatementEditor";
import { transformStatementForAPI } from "@/utils/functions/formHelpers";
import { updateFuldmagtForm } from "@/redux/features/fludgmentsforms/formThunk";

const EditFuldgment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const themeColor = "#3cb4e4";
  
  const initialData = location.state?.fuldmagtData;

  const { users } = useSelector((state) => state.users);
  const { loading } = useSelector((state) => state.reveiwForm); 
  const [companies, setCompanies] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [isUserSearchActive, setIsUserSearchActive] = useState(false);
  const [isCompanySearchActive, setIsCompanySearchActive] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.title || "",
    visibility: initialData?.visibleTo || "everyone",
    iconUrl: initialData?.icon || "", 
    imageUrl: initialData?.fuldmagt_image || "",
    fuldmagtStatement: initialData?.fuldmagtStatement || "",
    selectedUsers: initialData?.selectedUsers || [],
    selectedCompanies: initialData?.selectedCompanies || [],
    exceptUsers: initialData?.exceptUsers ?? false,
    exceptCompanies: initialData?.exceptCompanies ?? false,
    additionalFields: initialData?.additionalFields || [],
    additionalFieldsType: initialData?.additionalFieldsType || [],
    additionalFieldsObject: initialData?.additionalFieldsObject || [],
  });

  // ✅ Final Save Logic with UI feedback and button disabling
  const handleFinalSave = async () => {
    // 1. Transform placeholders using helper
    const apiStatement = transformStatementForAPI(
      formData.fuldmagtStatement, 
      formData.additionalFields
    );

    // 2. Build the exact body required by the backend
    const finalPayload = {
      title: formData.name, 
      visibleTo: formData.visibility, 
      icon: formData.iconUrl,
      fuldmagt_image: formData.imageUrl,
      fuldmagtStatement: apiStatement,
      selectedUsers: formData.selectedUsers,
      selectedCompanies: formData.selectedCompanies,
      exceptUsers: formData.exceptUsers,
      exceptCompanies: formData.exceptCompanies,
      additionalFields: formData.additionalFields,
      additionalFieldsType: formData.additionalFieldsType,
      additionalFieldsObject: formData.additionalFieldsObject,
      isAgentSignRequired: initialData?.isAgentSignRequired ?? true,
      purchaseType: initialData?.purchaseType || "Tier 1",
    };

    try {
      // 3. Dispatch and wait for result
      await dispatch(updateFuldmagtForm({ id, formData: finalPayload })).unwrap();
      toast.success("E-Fuldmagt updated successfully!");
      navigate("/admin/reviewFludgments"); 
    } catch (error) {
      toast.error(error || "Update failed. Please check your data.");
    }
  };

  useEffect(() => {
    if (formData.visibility === "specificUsersAndCompanies") {
      dispatch(fetchEntities("users"));
      dispatch(fetchEntities("companies")).then((res) => {
        if (res.payload) setCompanies(res.payload);
      });
    }
  }, [formData.visibility, dispatch]);

  const getVisibilityLabel = (visibleTo) => {
    if (visibleTo === 'specificUsersAndCompanies') return 'Custom';
    if (visibleTo === 'everyone') return 'Public';
    if (visibleTo === 'allCompanies') return 'Companies Only';
    if (visibleTo === 'allUsers') return 'User Only';
    return 'Private';
  };

  const toggleUser = (userId) => {
    setFormData(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter(id => id !== userId) : [...prev.selectedUsers, userId]
    }));
    setUserSearchTerm("");
  };

  const toggleCompany = (companyId) => {
    setFormData(prev => ({
      ...prev,
      selectedCompanies: prev.selectedCompanies.includes(companyId)
        ? prev.selectedCompanies.filter(id => id !== companyId) : [...prev.selectedCompanies, companyId]
    }));
    setCompanySearchTerm("");
  };

  const filteredSystemUsers = users.filter(u => 
    !formData.selectedUsers.includes(u.id) && 
    (`${u.firstName} ${u.lastName}`.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
     u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()))
  ).slice(0, 10);

  const filteredSystemCompanies = (companies || []).filter(c => 
    !formData.selectedCompanies.includes(c.id) && 
    c.firstName.toLowerCase().includes(companySearchTerm.toLowerCase())
  ).slice(0, 10);

  const selectedUserObjects = formData.selectedUsers.map(uid => users.find(u => u.id === uid)).filter(Boolean);
  const selectedCompanyObjects = formData.selectedCompanies.map(cid => (companies || []).find(c => c.id === cid)).filter(Boolean);

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="w-full mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 mb-6 group hover:text-gray-800 transition-colors">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Review</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden w-full">
          {/* Header Action - ✅ Added Disabled State & Spinner */}
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <h1 className="text-2xl font-bold text-gray-800">Edit Fuldgment</h1>
          
          </div>

          <div className="p-8 space-y-8">
            {/* 1. Visibility Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-800">Visibility Status:</h3>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border uppercase shadow-sm bg-white" style={{ color: themeColor, borderColor: `${themeColor}44` }}>
                        {formData.visibility === 'everyone' ? <Eye size={12} /> : <EyeOff size={12} />}
                        {getVisibilityLabel(formData.visibility)}
                    </span>
                </div>
                <p className="text-xs text-gray-500">Determine access permissions for this form.</p>
              </div>
              <div className="relative">
                <select
                  value={formData.visibility}
                  onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                  className="w-full appearance-none bg-white border border-gray-200 py-3.5 px-5 pr-12 rounded-xl font-bold text-gray-700 focus:ring-2 outline-none cursor-pointer shadow-sm"
                  style={{ '--tw-ring-color': themeColor }}
                >
                  <option value="everyone">Everyone (Public)</option>
                  <option value="allUsers">Private Users Only</option>
                  <option value="allCompanies">Companies Only</option>
                  <option value="specificUsersAndCompanies">Custom Visibility Selection</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            {/* Custom Selection Area */}
            {formData.visibility === "specificUsersAndCompanies" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl border border-gray-200 bg-white shadow-lg h-[600px] mb-4">
                <div className="p-8 md:border-r border-gray-100 flex flex-col min-h-0">
                  <div className="relative mb-8">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Add New Users</Label>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                            placeholder="Search system..." 
                            className="pl-11 h-12 rounded-xl bg-gray-50 border-none"
                            value={userSearchTerm}
                            onFocus={() => setIsUserSearchActive(true)}
                            onBlur={() => setTimeout(() => setIsUserSearchActive(false), 200)}
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                        />
                    </div>
                    {isUserSearchActive && filteredSystemUsers.length > 0 && (
                      <div className="absolute z-50 w-full mt-2 bg-white border rounded-2xl shadow-2xl max-h-48 overflow-y-auto p-2">
                        {filteredSystemUsers.map(u => (
                          <div key={u.id} onMouseDown={() => toggleUser(u.id)} className="p-3 hover:bg-[#3cb4e4]/10 cursor-pointer rounded-xl text-sm flex flex-col group">
                            <span className="font-bold text-gray-700 group-hover:text-[#3cb4e4]">{u.firstName} {u.lastName}</span>
                            <span className="text-[10px] text-gray-400">{u.email}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <SelectedEntitiesList 
                    title="Private Users" type="user" selectedItems={selectedUserObjects} onRemove={toggleUser}
                    exceptChecked={formData.exceptUsers} onExceptChange={(val) => setFormData({...formData, exceptUsers: val})}
                  />
                </div>

                <div className="p-8 flex flex-col min-h-0">
                   <div className="relative mb-8">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Add New Companies</Label>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input 
                            placeholder="Search system..." 
                            className="pl-11 h-12 rounded-xl bg-gray-50 border-none"
                            value={companySearchTerm}
                            onFocus={() => setIsCompanySearchActive(true)}
                            onBlur={() => setTimeout(() => setIsCompanySearchActive(false), 200)}
                            onChange={(e) => setCompanySearchTerm(e.target.value)}
                        />
                    </div>
                    {isCompanySearchActive && filteredSystemCompanies.length > 0 && (
                      <div className="absolute z-50 w-full mt-2 bg-white border rounded-2xl shadow-2xl max-h-48 overflow-y-auto p-2">
                        {filteredSystemCompanies.map(c => (
                          <div key={c.id} onMouseDown={() => toggleCompany(c.id)} className="p-4 hover:bg-[#3cb4e4]/10 cursor-pointer rounded-xl text-sm font-bold text-gray-700">
                            <span>{c.firstName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                   <SelectedEntitiesList 
                    title="Companies" type="company" selectedItems={selectedCompanyObjects} onRemove={toggleCompany}
                    exceptChecked={formData.exceptCompanies} onExceptChange={(val) => setFormData({...formData, exceptCompanies: val})}
                  />
                </div>
              </div>
            )}

            <MediaUploadSection formData={formData} setFormData={setFormData} themeColor={themeColor} />
            
            <UpdateTitleSection title={formData.name} setTitle={(newName) => setFormData({ ...formData, name: newName })} themeColor={themeColor} />

            <StatementEditor 
              statement={formData.fuldmagtStatement}
              setStatement={(val) => setFormData({ ...formData, fuldmagtStatement: val })}
              availableFields={formData.additionalFields}
              themeColor={themeColor}
            />

            <FieldsManagementSection 
              formData={formData}
              setFormData={setFormData}
              themeColor={themeColor}
            />

            {/* Footer Action - ✅ Added Disabled State & Spinner */}
            <div className="flex justify-end pt-8">
                <button 
                  onClick={handleFinalSave}
                  disabled={loading}
                  className="flex items-center gap-3 text-white px-10 py-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed" 
                  style={{ backgroundColor: themeColor }}
                >
                  {loading ? (
                    <><Loader2 className="animate-spin w-5 h-5" /> Updating System...</>
                  ) : (
                    <><Save size={22} /> Update e-Fuldmagt</>
                  )}
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFuldgment;