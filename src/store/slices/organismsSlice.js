import { createSlice } from '@reduxjs/toolkit';
import { generateUniqueId } from '../../utils/idGenerator';

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

export const organismsSlice = createSlice({
  name: 'organisms',
  initialState,
  reducers: {
    // Add a new organism
    addOrganism: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(organism) {
        // Make sure organism has an ID, or generate one
        const id = organism.id || generateUniqueId('organism');
        return {
          payload: {
            ...organism,
            id
          }
        };
      }
    },
    // Update an existing organism
    updateOrganism: (state, action) => {
      const { id, ...updates } = action.payload;
      const existingOrganism = state.items.find(organism => organism.id === id);
      if (existingOrganism) {
        Object.assign(existingOrganism, updates);
      }
    },
    // Remove an organism
    removeOrganism: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(organism => organism.id !== id);
    },
    // Add a component to an organism
    addComponentToOrganism: (state, action) => {
      const { organismId, component } = action.payload;
      const organism = state.items.find(o => o.id === organismId);
      if (organism) {
        if (!organism.composition) {
          organism.composition = [];
        }
        organism.composition.push(component);
      }
    },
    // Update a component in an organism
    updateComponentInOrganism: (state, action) => {
      const { organismId, componentIndex, updates } = action.payload;
      const organism = state.items.find(o => o.id === organismId);
      if (organism && organism.composition && organism.composition[componentIndex]) {
        organism.composition[componentIndex] = { 
          ...organism.composition[componentIndex],
          ...updates 
        };
      }
    },
    // Remove a component from an organism
    removeComponentFromOrganism: (state, action) => {
      const { organismId, componentId } = action.payload;
      const organism = state.items.find(o => o.id === organismId);
      if (organism && organism.composition) {
        organism.composition = organism.composition.filter(
          comp => comp.id !== componentId
        );
      }
    },
    // Set the entire organisms array
    setOrganisms: (state, action) => {
      state.items = action.payload;
    },
    // Update status
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    }
  }
});

// Export actions
export const { 
  addOrganism, 
  updateOrganism, 
  removeOrganism, 
  addComponentToOrganism,
  updateComponentInOrganism,
  removeComponentFromOrganism,
  setOrganisms, 
  setStatus, 
  setError 
} = organismsSlice.actions;

// Export selectors
export const selectAllOrganisms = state => state.organisms.items;
export const selectOrganismById = (state, organismId) => 
  state.organisms.items.find(organism => organism.id === organismId);
export const selectOrganismsStatus = state => state.organisms.status;
export const selectOrganismsError = state => state.organisms.error;

export default organismsSlice.reducer; 