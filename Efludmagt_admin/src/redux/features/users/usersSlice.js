// features/entity/entitySlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchEntities, deleteEntity, suspendEntity, fetchApprovalRequests, handleApprovalAction,reactivateEntity } from './usersThunk';

const initialState = {
  users: [],
  companies: [],
  approvalRequests: [], // Add this new state
  loading: false,
  error: null,
  loading: false,
};

const entitySlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntities.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg === 'users') {
          state.users = action.payload;
        } else {
          state.companies = action.payload;
        }
      })
      .addCase(fetchEntities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteEntity.fulfilled, (state, action) => {
        const { id, type } = action.payload;
        if (type === 'user') {
          state.users = state.users.filter(user => user.id !== id);
        } else {
          state.companies = state.companies.filter(company => company.id !== id);
        }
      })

      .addCase(suspendEntity.fulfilled, (state, action) => {
        const { id, type } = action.payload;
        const targetArray = type === 'user' ? state.users : state.companies;
        const entity = targetArray.find(e => e.id === id);
        if (entity) {
          entity.locked = true;
          entity.activity = 'Suspended';
          entity.validity = 'Expired';
        }
      })
      // Add these new cases
    .addCase(fetchApprovalRequests.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchApprovalRequests.fulfilled, (state, action) => {
      state.loading = false
      state.approvalRequests = action.payload
    })
    .addCase(fetchApprovalRequests.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    .addCase(handleApprovalAction.fulfilled, (state, action) => {
      state.approvalRequests = state.approvalRequests.filter((request) => request.id !== action.payload.requestId)
    })
    .addCase(reactivateEntity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reactivateEntity.fulfilled, (state, action) => {
        state.loading = false;
        const updatedEntity = action.payload; 
        const targetArray = updatedEntity.type === 'User' ? state.users : state.companies;
        const index = targetArray.findIndex(e => e.id === updatedEntity.id);
        if (index !== -1) {
          targetArray[index] = updatedEntity;
        }
      })
      .addCase(reactivateEntity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Stores the error message from rejectWithValue
      })

      
  }
});

export default entitySlice.reducer;