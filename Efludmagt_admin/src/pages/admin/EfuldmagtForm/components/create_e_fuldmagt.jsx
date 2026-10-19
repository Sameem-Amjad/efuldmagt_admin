"use client";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormBuilder from "./form-builder";
import PricingTiers from "./tiers";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { createFuldmagt } from "@/redux/features/fuldmagts/fuldmagtsThunk";
import { resetCreateStatus } from "@/redux/features/fuldmagts/fuldmagtsSlice";
import { fetchEntities } from "@/redux/features/users/usersThunk";

import Step1Title from "@/components/createform/Step1Title";
import Step2Uploads from "@/components/createform/Step2Uploads";
import Step3Visibility from "@/components/createform/Step3Visibility";

const initialFormData = {
  title: "",
  additionalFields: [],
  additionalFieldsType: [],
  additionalFieldsObject: [],
  isAgentSignRequired: false,
  purchaseType: "Tier 1",
  fuldmagtStatement: "",
  fuldmagt_image: "",
  icon: "",
  selectedUsers: [],
  selectedCompanies: [],
  exceptUsers: false,
  exceptCompanies: false,
};

function transformContentForSubmission(htmlContent, components) {
  if (!htmlContent) return "";

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  let plainText = tempDiv.textContent || tempDiv.innerText || "";

  if (components && Array.isArray(components)) {
    components.forEach((component) => {
      const placeholder = `{{${component.friendlyName}}}`;
      const systemVariable = `$${component.friendlyName.replace(/\s+/g, "")}`;
      
      // 3. Replace all occurrences in the plain text
      plainText = plainText.replace(new RegExp(placeholder, "g"), systemVariable);
    });
  }

  return plainText;
}



const initialFormBuilderComponents = [
  { id: "firstName", type: "textField", friendlyName: "First Name", isDefault: true },
  { id: "lastName", type: "textField", friendlyName: "Last Name", isDefault: true },
];
export default function CreateForm() {
  const [visibility, setVisibility] = useState("everyone");
  const [companies, setCompanies] = useState([]);

  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem('formStep');
    // localStorage stores strings, so we convert it back to a number
    return savedStep ? Number(savedStep) : 1; 
  });

  const [title, setTitle] = useState(() => {
    const savedTitle = localStorage.getItem('formTitle');
    return savedTitle || ""; // If nothing is saved, default to an empty string
  });

  const [formData, setFormData] = useState(() => {
    const savedDraft = localStorage.getItem('formDraft');
    return savedDraft ? JSON.parse(savedDraft) : initialFormData;
  });


  const [formBuilderComponents, setFormBuilderComponents] = useState(() => {
 const savedComponents = localStorage.getItem('formBuilderComponents');
  
  if (savedComponents) {
    const parsedSaved = JSON.parse(savedComponents);
    
    // Only use the saved state if it contains any components.
    // Otherwise, it was saved as an empty list (meaning all optional components were deleted),
    // and we should restore the mandatory defaults.
    if (Array.isArray(parsedSaved) && parsedSaved.length > 0) {
      return parsedSaved;
    }
  }

  // If there's no saved data, or the saved data is an empty list, 
  // return the mandatory defaults.
  return initialFormBuilderComponents;
});



  useEffect(() => {
    localStorage.setItem('formStep', step);
  }, [step]);

  useEffect(() => {
    localStorage.setItem('formTitle', title);
  }, [title]);

    useEffect(() => {
    localStorage.setItem('formDraft', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('formBuilderComponents', JSON.stringify(formBuilderComponents));
  }, [formBuilderComponents]);
 



  const { createStatus, error: createError } = useSelector((state) => state.fuldmagts);
  const { loading: usersLoading, error: usersError, users } = useSelector((state) => state.users);

  // Effect for fetching initial data (users and companies)
useEffect(() => {
    dispatch(fetchEntities("users"));
    dispatch(fetchEntities("companies")).then((result) => {

      if (result.payload) {
        setCompanies(result.payload);
      }
    });
  }, [dispatch]);

  // Effect for handling the result of the form submission
  useEffect(() => {
    if (createStatus === 'succeeded') {
      toast({
        title: "Form Submitted",
        variant: "success",
        description: "Your e-fuldmagt form has been created successfully!",
      });
      // Reset the entire form to its initial state
      setTitle("");
      setFormBuilderComponents(initialFormBuilderComponents);
      setFormData(initialFormData);
      setVisibility("everyone");
      dispatch(resetCreateStatus());
      localStorage.removeItem('formStep');
      localStorage.removeItem('formTitle');
      localStorage.removeItem('formBuilderComponents');
      localStorage.removeItem('formDraft');
      navigate("/admin/reviewFludgments");
    }

    if (createStatus === 'failed') {
      toast({
        title: "Error Creating Form",
        variant: "destructive",
        description: createError || "An unknown error occurred.",
      });
      dispatch(resetCreateStatus());
    }
  }, [createStatus, createError, dispatch, toast]);

  // Effect to manage form data when visibility changes
  useEffect(() => {
    if (visibility === "everyone") {
      setFormData((prev) => ({
        ...prev,
        exceptUsers: true, exceptCompanies: true,
        selectedUsers: [], selectedCompanies: [],
      }));
    } else {
      setFormData((prev) => ({ ...prev, exceptUsers: false, exceptCompanies: false }));
    }
  }, [visibility, setFormData]);


  // --- Helper Functions ---

  const toggleUser = (userId) => {
    setFormData((prev) => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter((id) => id !== userId)
        : [...prev.selectedUsers, userId],
    }));
  };

  const toggleCompany = (companyId) => {
    setFormData((prev) => ({
      ...prev,
      selectedCompanies: prev.selectedCompanies.includes(companyId)
        ? prev.selectedCompanies.filter((id) => id !== companyId)
        : [...prev.selectedCompanies, companyId],
    }));
  };

  const handleFormComponentsChange = (components) => {
    console.log("label",components)
    setFormData({
      ...formData,
      additionalFields: components.map((c) => c.friendlyName?.replace(/\s/g, '')),
      additionalFieldsType: components.map((c) => c.type),
      additionalFieldsObject: components.map((c) => {
        if (c.type === "note" || c.type === "headline") return { text: c.friendlyName };
        if (c.type === "textField" || c.type === "textArea") return { placeholder: c.friendlyName };
        if (c.type === "date") return { placeholder: c.friendlyName };
        if (c.type === "radioButtons" || c.type === "checkBoxes") {
          return { heading: c.friendlyName, options: c.options ? c.options.map((opt) => opt.label) : ["opt1", "opt2"] };
        }
        return {};
      }),
    });
  };

  const goBack = () => {
    if (step === 1) {
      navigate("/admin/EfuldmagtForm");
    } else {
      setStep(step - 1);
    }
  };

const handleSubmit = () => {
    
    const submissionData = { ...formData };

    const plainTextStatement = transformContentForSubmission(
        submissionData.fuldmagtStatement, 
        submissionData.components // Assuming 'components' array is saved in your draft
    );

    submissionData.fuldmagtStatement = plainTextStatement;

    dispatch(createFuldmagt(submissionData));
};

  // This function controls navigation between steps
  const handleContinue = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (step === 1) {
      setFormData({ ...formData, title });
      setStep(step + 1);
    } else if (step === 4) {
      if (formData.fuldmagtStatement === "") {
        toast({ title: "Error", variant: "destructive", description: "Please fill in the e-fuldmagt statement." });
        return;
      }
      setStep(step + 1);
    } else if (step < 5) {
      setStep(step + 1);
    } else {
      handleSubmit(); // On the final step, call the submit handler
    }
  };


  // --- Render JSX ---
  return (
    <div className="flex flex-col rounded-lg h-[calc(100vh-4rem)] p-8 bg-white">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={goBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Create e-fuldmagt Form</h1>
      </div>

      {step === 1 && ( <Step1Title title={title} setTitle={setTitle} onContinue={handleContinue} /> )}
      {step === 2 && ( <Step2Uploads formData={formData} setFormData={setFormData} onContinue={handleContinue} /> )}
      {step === 3 && ( <Step3Visibility visibility={visibility} setVisibility={setVisibility} formData={formData} setFormData={setFormData} users={users} companies={companies} loading={usersLoading} error={usersError} toggleUser={toggleUser} toggleCompany={toggleCompany} onContinue={handleContinue} /> )}
{step === 4 && ( 
  <div className="space-y-6"> 
    <FormBuilder 
      components={formBuilderComponents} 
      setComponents={setFormBuilderComponents} 
      onFormComponentsChange={handleFormComponentsChange} 
      onEditorContentChange={(content) => setFormData((prev) => ({ ...prev, fuldmagtStatement: content }))} 
      initialEditorContent={formData.fuldmagtStatement} 
    /> 
    <div className="flex justify-end"> 
      <Button 
        onClick={handleContinue} 
        className="bg-[#47B5FF] hover:bg-[#1DA1F2] text-white px-8 mb-4"
      > 
        Continue 
      </Button> 
    </div> 
  </div> 
)}      
      {step === 5 && (
        <div className="space-y-8">
          <PricingTiers selectedTier={formData.purchaseType} onTierSelect={(tier) => setFormData((prev) => ({ ...prev, purchaseType: tier }))} />
          <div className="flex justify-end space-x-4">
            <Button size="lg" className="bg-[#47B5FF] hover:bg-[#1DA1F2] text-white px-8" onClick={handleContinue} disabled={createStatus === 'loading'} >
              {createStatus === 'loading' ? 'Creating...' : 'Finish Creating'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}