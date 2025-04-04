export const updateSduiSchema = async (newData, shouldRefresh = true) => {
  try {
    const dataWithFlag = {
      ...newData,
      shouldRefresh
    };
    
    const response = await fetch('/api/update-schema', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataWithFlag),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'Network response was not ok'
      }));
      throw new Error(errorData.details || errorData.error || 'Failed to update schema');
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating schema:', error);
    throw error;
  }
}; 