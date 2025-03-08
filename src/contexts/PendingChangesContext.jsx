import React, { createContext, useState, useContext, useCallback } from 'react';
import { hasPendingChanges, setPendingChanges as setStoragePendingChanges } from '../utils/localStorageManager';

// Create the context
export const PendingChangesContext = createContext({
  pendingChanges: false,
  setPendingChanges: () => {},
  applyChanges: () => {},
  discardChanges: () => {},
});

// Custom hook to use the context
export const usePendingChanges = () => useContext(PendingChangesContext);

// Provider component
export const PendingChangesProvider = ({ children, applyChangesHandler, discardChangesHandler }) => {
  // State to track if there are pending changes
  const [pendingChanges, setPendingChangesState] = useState(hasPendingChanges());
  
  // Set pending changes in both state and localStorage
  const setPendingChanges = useCallback((hasPending) => {
    setPendingChangesState(hasPending);
    setStoragePendingChanges(hasPending);
  }, []);
  
  // Apply all pending changes
  const applyChanges = useCallback(() => {
    if (applyChangesHandler) {
      applyChangesHandler();
    }
  }, [applyChangesHandler]);
  
  // Discard all pending changes
  const discardChanges = useCallback(() => {
    if (discardChangesHandler) {
      discardChangesHandler();
    }
  }, [discardChangesHandler]);
  
  // Context value
  const contextValue = {
    pendingChanges,
    setPendingChanges,
    applyChanges,
    discardChanges,
  };
  
  return (
    <PendingChangesContext.Provider value={contextValue}>
      {children}
    </PendingChangesContext.Provider>
  );
};

export default PendingChangesProvider; 