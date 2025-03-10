import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addOrganism } from '../../store/slices/organismsSlice';
import { emptyOrganism } from '../../constants/emptyStructures';
import { generateUniqueId } from '../../utils/idGenerator';

/**
 * A simplified version of OrganismBuilder specifically for modal use
 */
const OrganismBuilderModal = ({ 
  onCancel, 
  onOrganismCreated,
  inline = true 
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [organismName, setOrganismName] = useState('');
  const [stackType, setStackType] = useState('h');

  // Handle form submission - create an organism and redirect to its edit page
  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    
    // Generate a unique ID for the new organism
    const organismId = generateUniqueId('organism');
    
    // Create organism with entered name and stack type
    const newOrganism = {
      ...emptyOrganism,
      id: organismId,
      name: organismName || `New Organism ${organismId.substring(0, 6)}`,
      properties: {
        ...emptyOrganism.properties,
        stack: stackType
      },
      composition: []
    };
    
    // Add to Redux store
    dispatch(addOrganism(newOrganism));
    
    // Close the modal
    if (onCancel) {
      onCancel();
    }
    
    // Redirect to the full organism editor page
    navigate(`/organisms/${organismId}`);
  };

  return (
    <div className="organism-builder-modal">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Organism Name */}
          <div>
            <label className="block text-sm font-medium text-text_main_high mb-2">
              Organism Name
            </label>
            <input
              type="text"
              value={organismName}
              onChange={(e) => setOrganismName(e.target.value)}
              placeholder="Enter a name for this organism"
              className="w-full px-3 py-2 border border-border_main_default rounded-md bg-background_main_surface text-text_main_high"
              required
            />
            <p className="mt-1 text-xs text-text_main_medium">
              A descriptive name to identify this organism
            </p>
          </div>
          
          {/* Stack Selection */}
          <div>
            <label className="block text-sm font-medium text-text_main_high mb-2">
              Stack
            </label>
            <select
              value={stackType}
              onChange={(e) => setStackType(e.target.value)}
              className="w-full px-3 py-2 border border-border_main_default rounded-md bg-background_main_surface text-text_main_high"
            >
              <option value="h">Horizontal</option>
              <option value="v">Vertical</option>
              <option value="z">Stacked (Z-index)</option>
            </select>
            <p className="mt-1 text-xs text-text_main_medium">
              How the components will be arranged in the organism
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
            className="px-4 py-2 text-sm font-medium text-button_filled_style_2_text_icon_default bg-button_filled_style_2_surface_default rounded-md hover:bg-button_filled_style_2_surface_hover"
          >
            Create & Edit Organism
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganismBuilderModal; 