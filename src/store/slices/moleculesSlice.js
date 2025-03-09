import { createSlice } from '@reduxjs/toolkit';
import { generateUniqueId } from '../../utils/idGenerator';

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

export const moleculesSlice = createSlice({
  name: 'molecules',
  initialState,
  reducers: {
    // Add a new molecule
    addMolecule: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(molecule) {
        // Make sure molecule has an ID, or generate one
        const id = molecule.id || generateUniqueId('molecule');
        return {
          payload: {
            ...molecule,
            id
          }
        };
      }
    },
    // Update an existing molecule
    updateMolecule: (state, action) => {
      const { id, ...updates } = action.payload;
      const existingMolecule = state.items.find(molecule => molecule.id === id);
      if (existingMolecule) {
        Object.assign(existingMolecule, updates);
      }
    },
    // Remove a molecule
    removeMolecule: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(molecule => molecule.id !== id);
    },
    // Add an atom to a molecule
    addAtomToMolecule: (state, action) => {
      const { moleculeId, atom } = action.payload;
      const molecule = state.items.find(m => m.id === moleculeId);
      if (molecule) {
        if (!molecule.atoms) {
          molecule.atoms = [];
        }
        molecule.atoms.push(atom);
      }
    },
    // Update atom in a molecule
    updateAtomInMolecule: (state, action) => {
      const { moleculeId, atomIndex, updates } = action.payload;
      const molecule = state.items.find(m => m.id === moleculeId);
      if (molecule && molecule.atoms && molecule.atoms[atomIndex]) {
        molecule.atoms[atomIndex] = { ...molecule.atoms[atomIndex], ...updates };
      }
    },
    // Remove atom from a molecule
    removeAtomFromMolecule: (state, action) => {
      const { moleculeId, atomId } = action.payload;
      const molecule = state.items.find(m => m.id === moleculeId);
      if (molecule && molecule.atoms) {
        molecule.atoms = molecule.atoms.filter(atom => 
          (typeof atom === 'string' ? atom !== atomId : atom.id !== atomId)
        );
      }
    },
    // Set the entire molecules array
    setMolecules: (state, action) => {
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
  addMolecule, 
  updateMolecule, 
  removeMolecule, 
  addAtomToMolecule,
  updateAtomInMolecule,
  removeAtomFromMolecule,
  setMolecules, 
  setStatus, 
  setError 
} = moleculesSlice.actions;

// Export selectors
export const selectAllMolecules = state => state.molecules.items;
export const selectMoleculeById = (state, moleculeId) => 
  state.molecules.items.find(molecule => molecule.id === moleculeId);
export const selectMoleculesStatus = state => state.molecules.status;
export const selectMoleculesError = state => state.molecules.error;

export default moleculesSlice.reducer; 