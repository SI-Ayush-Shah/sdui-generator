/**
 * Generates a guaranteed unique ID by combining a UUID with a timestamp
 * @param {string} prefix - Optional prefix for the ID (e.g., 'atom', 'molecule')
 * @returns {string} A unique ID string
 */
export const generateUniqueId = (prefix = '') => {
  const uuid = crypto.randomUUID();
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000);
  
  return prefix 
    ? `${prefix}_${uuid}_${timestamp}_${randomSuffix}`
    : `${uuid}_${timestamp}_${randomSuffix}`;
};

/**
 * Checks if an ID already exists in a collection
 * @param {string} id - The ID to check
 * @param {Array} collection - Array of objects with 'id' property
 * @returns {boolean} True if the ID exists in the collection
 */
export const idExistsInCollection = (id, collection = []) => {
  return collection.some(item => item.id === id);
};

/**
 * Generates a unique ID that doesn't exist in the given collections
 * @param {string} prefix - Optional prefix for the ID
 * @param {Array} collections - Arrays of collections to check for ID existence
 * @returns {string} A unique ID that doesn't exist in any of the collections
 */
export const generateUniqueNonExistingId = (prefix = '', ...collections) => {
  let id;
  let exists = true;
  
  // Keep generating IDs until we find one that doesn't exist in any collection
  while (exists) {
    id = generateUniqueId(prefix);
    exists = collections.some(collection => 
      idExistsInCollection(id, collection)
    );
  }
  
  return id;
}; 