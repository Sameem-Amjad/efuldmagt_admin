// features/entity/entityThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';

// Utility functions to map API responses
// In usersThunk.js

const mapUser = (user) => {
  let firstName = "";
  let lastName = "";

  // Check if user.name exists and handle both string and object formats
  if (user.name) {
    if (typeof user.name === 'object' && user.name !== null) {
      // Handles format: { firstName: 'Zain', lastName: 'ahmed' }
      firstName = user.name.firstName || "";
      lastName = user.name.lastName || "";
    } else if (typeof user.name === 'string') {
      // Handles format: "Zain ahmed"
      const [fName = "", ...rest] = user.name.split(" ");
      firstName = fName;
      lastName = rest.join(" ");
    }
  }

  const phoneString = user.phone ? `${user.phone.countryCode} ${user.phone.number}` : "";
  const { address, addressLine, postalCode, city, country } = user.address || {};

  return {
    id: user._id,
    firstName, // Now correctly assigned regardless of format
    lastName,  // Now correctly assigned regardless of format
    email: user.email,
    phone: phoneString,
    address: [address, addressLine, postalCode, city, country].filter(Boolean).join(", "),
    joinDate: user.createdAt,
    since: new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    type: "User",
    activity: user.locked ? "Suspended" : "Active",
    validity: user.locked ? "Expired" : "Valid",
    locked: user.locked,
    activities: []
  };
};
const mapCompany = (company) => {
  const phoneString = company.phone ? `${company.phone.countryCode} ${company.phone.number}` : "";
  const { address, addressLine, postalCode, city, country } = company.address || {};

  return {
    id: company._id,
    firstName: company.companyName,
    lastName: company.cvr ? String(company.cvr) : "",
    email: company.email,
    phone: phoneString,
    address: [address, addressLine, postalCode, city, country].filter(Boolean).join(", "),
    joinDate: company.createdAt,
    since: new Date(company.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    type: "Company",
    activity: company.locked ? "Suspended" : "Active",
    validity: company.locked ? "Expired" : "Valid",
    locked: company.locked,
    activities: []
  };
};

export const fetchEntities = createAsyncThunk(
  'entities/fetchEntities',
  async (type, { rejectWithValue }) => {
    try {
      const endpoint = `${import.meta.env.VITE_API_KEY}/admin/${type}`;
      const res = await fetch(endpoint, { headers
        : {
            'Authorization': 'Bearer ' + localStorage.getItem('authToken')
            }
        });
      if (!res.ok) throw new Error(`Failed to fetch ${type}`);
      const data = await res.json();
      console.log(data.data[type].filter(entity => !entity.deleted).map(type === 'users' ? mapUser : mapCompany));
      return data.data[type].filter(entity => !entity.deleted).map(type === 'users' ? mapUser : mapCompany);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk to delete an entity (user or company)
export const deleteEntity = createAsyncThunk(
  'entities/deleteEntity',
  async ({ id, type }, { rejectWithValue }) => {
    try {
      const endpoint = `${import.meta.env.VITE_API_KEY}/admin/${type}/${id}`;
    const res = await fetch(endpoint, { 
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
    });
      // keep the server's reason (e.g. the demo admin's "can't delete" message)
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Delete failed');
      return { id, type: type.slice(0, -1) }; // Return the ID and type (user or company)
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk to suspend an entity (user or company)
export const suspendEntity = createAsyncThunk(
  'entities/suspendEntity',
  async ({ id, type }, { rejectWithValue }) => {
    try {
      const endpoint = `${import.meta.env.VITE_API_KEY}/admin/${type}/${id}`;
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({ locked: true })
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Suspend failed');
      return { id, type: type.slice(0, -1) }; // Return the ID and type (user or company)
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchApprovalRequests = createAsyncThunk("users/fetchApprovalRequests", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/approval-requests")
    if (!response.ok) throw new Error("Failed to fetch approval requests")
    return await response.json()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const handleApprovalAction = createAsyncThunk(
  "users/handleApprovalAction",
  async ({ requestId, action }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/approval-requests/${requestId}/${action}`, {
        method: "POST",
      })
      if (!response.ok) throw new Error(`Failed to ${action} request`)
      return { requestId, action }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)



// Thunk to reactivate an entity (user or company)
export const reactivateEntity = createAsyncThunk(
  'entities/reactivateEntity',
  async ({ id, type }, { rejectWithValue }) => {
    let data; // Define data outside the try block

    // 1. TRY BLOCK FOR NETWORK ONLY
    try {
      const endpoint = `${import.meta.env.VITE_API_KEY}/admin/${type}/${id}/reactivate`;
      
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('authToken') }
      });

      data = await res.json(); // Assign response to the outer data variable

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Reactivation failed');
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }

    try {
      const entityKey = type === 'users' ? 'user' : 'company';
      const mapper = type === 'users' ? mapUser : mapCompany;
      const updatedEntity = mapper(data.data[entityKey]);
      return updatedEntity;
    } catch (mappingError) {
      console.error("Failed to map the entity after successful API call:", mappingError);
      return rejectWithValue("Data processing error after reactivation.");
    }
  }
);