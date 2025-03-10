import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addMolecule } from '../../store/slices/moleculesSlice';
import { emptyMolecule } from '../../constants/emptyStructures';
import { generateUniqueId } from '../../utils/idGenerator';
import { componentMap } from '../../molecules-mapper/molecules-map.jsx';

/**
 * A simplified version of MoleculeBuilder specifically for modal use
 */
const MoleculeBuilderModal = ({ 
  onCancel, 
  onMoleculeCreated,
  inline = true 
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [selectedMoleculeType, setSelectedMoleculeType] = useState('');
  const [moleculeName, setMoleculeName] = useState('');

  // Handle form submission - create a molecule and redirect to its edit page
  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    
    // Generate a unique ID for the new molecule
    const moleculeId = generateUniqueId('molecule');
    
    // Create molecule with selected type and entered name
    const newMolecule = {
      ...emptyMolecule,
      id: moleculeId,
      name: selectedMoleculeType,
      displayName: moleculeName || `New ${selectedMoleculeType}`
    };
    
    // Add to Redux store
    dispatch(addMolecule(newMolecule));
    
    // Close the modal
    if (onCancel) {
      onCancel();
    }
    
    // Redirect to the full molecule editor page
    navigate(`/molecules/${moleculeId}`);
  };

  return (
    <div className="molecule-builder-modal">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Molecule Type Selection */}
          <div>
            <label className="block text-sm font-medium text-text_main_high mb-2">
              Molecule Type
            </label>
            <select
              value={selectedMoleculeType}
              onChange={(e) => setSelectedMoleculeType(e.target.value)}
              className="w-full px-3 py-2 border border-border_main_default rounded-md bg-background_main_surface text-text_main_high"
              required
            >
              <option value="">Select a molecule type</option>
              {Object.keys(componentMap).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-text_main_medium">
              This determines how the molecule will function
            </p>
          </div>
          
          {/* Molecule Name */}
          <div>
            <label className="block text-sm font-medium text-text_main_high mb-2">
              Display Name (Optional)
            </label>
            <input
              type="text"
              value={moleculeName}
              onChange={(e) => setMoleculeName(e.target.value)}
              placeholder={selectedMoleculeType ? `New ${selectedMoleculeType}` : "Enter a name"}
              className="w-full px-3 py-2 border border-border_main_default rounded-md bg-background_main_surface text-text_main_high"
            />
            <p className="mt-1 text-xs text-text_main_medium">
              A friendly name to identify this molecule
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-text_main_medium bg-background_main_surface border border-border_main_default rounded-md hover:bg-background_main_card transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedMoleculeType}
            className={`px-4 py-2 text-sm font-medium text-button_filled_style_2_text_icon_default rounded-md ${
              selectedMoleculeType
                ? 'bg-button_filled_style_2_surface_default hover:bg-button_filled_style_2_surface_hover'
                : 'bg-button_filled_style_2_surface_default opacity-50 cursor-not-allowed'
            }`}
          >
            Create & Edit Molecule
          </button>
        </div>
      </form>
    </div>
  );
};

export default MoleculeBuilderModal; 