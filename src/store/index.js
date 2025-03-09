import { configureStore } from '@reduxjs/toolkit';
import atomsReducer from './slices/atomsSlice';
import moleculesReducer from './slices/moleculesSlice';
import organismsReducer from './slices/organismsSlice';

export const store = configureStore({
  reducer: {
    atoms: atomsReducer,
    molecules: moleculesReducer,
    organisms: organismsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['atoms/updateAtom', 'molecules/updateMolecule', 'organisms/updateOrganism'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.component'],
        // Ignore these paths in the state
        ignoredPaths: [],
      },
    }),
});

export default store; 