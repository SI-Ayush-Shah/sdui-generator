import React, { useState } from 'react';

const ComponentSelectionModal = ({ 
  title, 
  existingComponents, 
  onSelect, 
  onCreateNew, 
  onClose, 
  componentType,
  displayProperty = 'name' // what property to show (name, atom_type, etc)
}) => {
  const [mode, setMode] = useState('select'); // 'select' or 'create'

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setMode('select')}
              className={`px-3 py-1 text-sm rounded-md ${
                mode === 'select' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Select Existing
            </button>
            <button
              onClick={() => setMode('create')}
              className={`px-3 py-1 text-sm rounded-md ${
                mode === 'create' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Create New
            </button>
          </div>
        </div>

        {mode === 'select' ? (
          <div className="max-h-96 overflow-y-auto space-y-2">
            {existingComponents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No existing components</p>
            ) : (
              existingComponents.map(component => (
                <button
                  key={component.id}
                  type="button"
                  onClick={() => onSelect(component.id)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
                >
                  {component[displayProperty]}
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="border-t border-gray-200 pt-4">
            {onCreateNew}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-white text-gray-700 px-4 py-2 rounded-md border hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComponentSelectionModal; 