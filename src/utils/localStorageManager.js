// Keys for different component types in localStorage
const STORAGE_KEYS = {
  ATOMS: 'temp_atoms',
  MOLECULES: 'temp_molecules',
  ORGANISMS: 'temp_organisms',
  TEMPLATES: 'temp_templates',
  PENDING_CHANGES: 'pending_changes'
};

// Get temporary components from localStorage
export const getTempComponents = (type) => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEYS[type.toUpperCase()]);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error(`Error getting temp ${type} from localStorage:`, error);
    return [];
  }
};

// Add a component to temporary storage
export const addTempComponent = (type, component) => {
  try {
    const existingComponents = getTempComponents(type);
    // Check if component with same ID already exists
    const componentExists = existingComponents.some(c => c.id === component.id);
    
    if (componentExists) {
      // Replace the existing component
      const updatedComponents = existingComponents.map(c => 
        c.id === component.id ? component : c
      );
      localStorage.setItem(STORAGE_KEYS[type.toUpperCase()], JSON.stringify(updatedComponents));
    } else {
      // Add new component
      const updatedComponents = [...existingComponents, component];
      localStorage.setItem(STORAGE_KEYS[type.toUpperCase()], JSON.stringify(updatedComponents));
    }
    
    // Track that we have pending changes
    setPendingChanges(true);
    
    return true;
  } catch (error) {
    console.error(`Error adding temp ${type} to localStorage:`, error);
    return false;
  }
};

// Update a component in temporary storage
export const updateTempComponent = (type, id, updatedComponent) => {
  try {
    const existingComponents = getTempComponents(type);
    const updatedComponents = existingComponents.map(component => 
      component.id === id ? updatedComponent : component
    );
    
    localStorage.setItem(STORAGE_KEYS[type.toUpperCase()], JSON.stringify(updatedComponents));
    
    // Track that we have pending changes
    setPendingChanges(true);
    
    return true;
  } catch (error) {
    console.error(`Error updating temp ${type} in localStorage:`, error);
    return false;
  }
};

// Delete a component from temporary storage
export const deleteTempComponent = (type, id) => {
  try {
    const existingComponents = getTempComponents(type);
    const updatedComponents = existingComponents.filter(component => component.id !== id);
    
    localStorage.setItem(STORAGE_KEYS[type.toUpperCase()], JSON.stringify(updatedComponents));
    
    // Track that we have pending changes
    setPendingChanges(true);
    
    return true;
  } catch (error) {
    console.error(`Error deleting temp ${type} from localStorage:`, error);
    return false;
  }
};

// Clear all temporary components of a specific type
export const clearTempComponents = (type) => {
  try {
    localStorage.removeItem(STORAGE_KEYS[type.toUpperCase()]);
    return true;
  } catch (error) {
    console.error(`Error clearing temp ${type} from localStorage:`, error);
    return false;
  }
};

// Check if there are pending changes
export const hasPendingChanges = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.PENDING_CHANGES) === 'true';
  } catch (error) {
    console.error('Error checking pending changes:', error);
    return false;
  }
};

// Set pending changes flag
export const setPendingChanges = (hasPending) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PENDING_CHANGES, hasPending ? 'true' : 'false');
  } catch (error) {
    console.error('Error setting pending changes flag:', error);
  }
};

// Clear all temporary data and reset pending changes flag
export const clearAllTempData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing all temp data from localStorage:', error);
    return false;
  }
}; 