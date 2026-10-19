// features/formCreation/formSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const submitForm = createAsyncThunk(
  "form/submit",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://backend.e-fuldmagt.com/admin/fuldmagt-forms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadImage = createAsyncThunk(
  "form/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      const allowedExtensions = ["jpg", "jpeg", "png", "svg"];
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error("Invalid file extension");
      }

      // Get presigned URL
      const apiResponse = await fetch(
        "https://backend.e-fuldmagt.com/general/get-presigned-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("authToken"),
          },
          body: JSON.stringify({
            fileName: file.name,
            fileExtension: fileExtension,
          }),
        }
      );

      const responseData = await apiResponse.json();
      if (!responseData?.success)
        throw new Error("Failed to get presigned URL");

      // Upload to S3
      const uploadResponse = await fetch(responseData.data.url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) throw new Error("S3 upload failed");

      return responseData.data.url.split("?")[0];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  step: 1,
  formData: {
    title: "",
    additionalFields: [],
    additionalFieldsType: [],
    additionalFieldsObject: [],
    isAgentSignRequired: false,
    purchaseType: "Tier 1",
    fuldmagtStatement: "jalkjdlkda",
    fuldmagt_image: "",
    icon: "",
  },
  visibility: {
    type: "everyone",
    privateUsers: [],
    companies: [],
    everyoneExceptPrivate: false,
    everyoneExceptCompanies: false,
  },
  uploadStatus: "",
  loading: false,
  error: null,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload;
    },
    updateFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    updateVisibility: (state, action) => {
      state.visibility = { ...state.visibility, ...action.payload };
    },
    addPrivateUser: (state, action) => {
      state.visibility.privateUsers.push(action.payload);
    },
    removePrivateUser: (state, action) => {
      state.visibility.privateUsers = state.visibility.privateUsers.filter(
        (_, i) => i !== action.payload
      );
    },
    addCompany: (state, action) => {
      state.visibility.companies.push(action.payload);
    },
    removeCompany: (state, action) => {
      state.visibility.companies = state.visibility.companies.filter(
        (_, i) => i !== action.payload
      );
    },
    resetForm: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitForm.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(uploadImage.pending, (state) => {
        state.uploadStatus = "Uploading...";
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.uploadStatus = "Upload successful!";
        state.formData.fuldmagt_image = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploadStatus = `Error: ${action.payload}`;
      });
  },
});

export const {
  setStep,
  updateFormData,
  updateVisibility,
  addPrivateUser,
  removePrivateUser,
  addCompany,
  removeCompany,
  resetForm,
} = formSlice.actions;

export default formSlice.reducer;
