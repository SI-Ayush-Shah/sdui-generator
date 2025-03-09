import { createSlice, nanoid } from '@reduxjs/toolkit';
import { generateUniqueId } from '../../utils/idGenerator';

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

export const atomsSlice = createSlice({
  name: 'atoms',
  initialState,
  reducers: {
    // Add a new atom
    addAtom: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(atom) {
        // Make sure atom has an ID, or generate one
        const id = atom.id || generateUniqueId('atom');
        return {
          payload: {
            ...atom,
            id
          }
        };
      }
    },
    // Update an existing atom
    updateAtom: (state, action) => {
      const { id, ...updates } = action.payload;
      const existingAtom = state.items.find(atom => atom.id === id);
      if (existingAtom) {
        Object.assign(existingAtom, updates);
      }
    },
    // Remove an atom
    removeAtom: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(atom => atom.id !== id);
    },
    // Set the entire atoms array
    setAtoms: (state, action) => {
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
export const { addAtom, updateAtom, removeAtom, setAtoms, setStatus, setError } = atomsSlice.actions;

// Export selectors
export const selectAllAtoms = state => state.atoms.items;
export const selectAtomById = (state, atomId) => state.atoms.items.find(atom => atom.id === atomId);
export const selectAtomsStatus = state => state.atoms.status;
export const selectAtomsError = state => state.atoms.error;

export default atomsSlice.reducer; 