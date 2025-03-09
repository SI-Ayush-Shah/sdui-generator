import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { processAtoms } from "../../utils/compile.js";
import OrganismRenderer from "../common/OrganismRenderer";
import OrganismForm from "../forms/OrganismForm";
import { createEmptyOrganism } from "../forms/OrganismForm";

// Import Redux actions and selectors
import { addOrganism, updateOrganism, selectAllOrganisms } from '../../store/slices/organismsSlice';
import { selectAllMolecules } from '../../store/slices/moleculesSlice';
import { selectAllAtoms } from '../../store/slices/atomsSlice';

// Fallback props in case Redux is not ready
const defaultProps = {
  existingOrganismsProp: [],
  existingMoleculesProp: [],
  existingAtomsProp: [],
};

const OrganismBuilder = ({ 
  onCancel, 
  inline = false,
  // Fallback props to use if Redux is not available
  existingOrganismsProp = [],
  existingMoleculesProp = [],
  existingAtomsProp = [],
  onAdd,
  onUpdate,
  handleAddComponent
}) => {
  // Use Redux state with fallbacks
  const existingOrganismsFromRedux = useSelector(selectAllOrganisms) || [];
  const existingMoleculesFromRedux = useSelector(selectAllMolecules) || [];
  const existingAtomsFromRedux = useSelector(selectAllAtoms) || [];
  
  // Use Redux data if available, otherwise fall back to props
  const existingOrganisms = existingOrganismsFromRedux.length > 0 
    ? existingOrganismsFromRedux 
    : existingOrganismsProp;
    
  const existingMolecules = existingMoleculesFromRedux.length > 0 
    ? existingMoleculesFromRedux 
    : existingMoleculesProp;
    
  const existingAtoms = existingAtomsFromRedux.length > 0 
    ? existingAtomsFromRedux 
    : existingAtomsProp;
  
  const dispatch = useDispatch();
  
  const [organismData, setOrganismData] = useState(createEmptyOrganism());
  const navigate = useNavigate();
  
  // Process atoms for molecule previews
  const processedAtoms = processAtoms(existingAtoms);

  const handleClearForm = () => {
    setOrganismData(createEmptyOrganism());
  };

  // Handle form submission using Redux
  const handleFormSubmit = (data) => {
    try {
      // Create a copy of the data to avoid mutating the original
      const organismData = { ...data };
      
      // Dispatch action to add/update organism in Redux store
      if (mode === 'create') {
        dispatch(addOrganism(organismData));
      } else {
        dispatch(updateOrganism(organismData));
      }
      
      // Only navigate if we're not in inline mode
      if (!inline) {
        setTimeout(() => {
          navigate("/organisms");
        }, 0);
      }
      
      // Reset form if it's a creation
      if (mode === 'create') {
        handleClearForm();
      }
    } catch (error) {
      console.error("Error in handleFormSubmit:", error);
    }
    
    // Return false to prevent any default behavior
    return false;
  };

  // Handler for form updates to keep organismData in sync for JSON preview
  const handleFormUpdate = (data) => {
    setOrganismData(data);
  };

  // Get mode from URL or props
  const mode = organismData.id && existingOrganisms.some(o => o.id === organismData.id) 
    ? 'edit' 
    : 'create';

  // Render organism preview
  const renderOrganismPreview = () => {
    // If the organism doesn't have a name or is very empty, show placeholder
    if (!organismData.name) {
      return (
        <div className="p-6 flex flex-col items-center justify-center text-text_main_medium">
          <svg
            className="w-12 h-12 mb-3 text-text_main_low"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm font-medium">Organism Preview</p>
          <p className="text-xs text-text_main_low mt-1 max-w-md text-center">
            Add components to this organism to see a live preview here
          </p>
        </div>
      );
    }

    // Use the OrganismRenderer component to render the preview
    return (
      <OrganismRenderer
        organism={organismData}
        processedAtoms={processedAtoms}
        className="w-full h-full min-h-[150px]"
        existingOrganismsProp={existingOrganisms}
        existingMoleculesProp={existingMolecules}
      />
    );
  };

  return (
    <div className="organism-builder bg-background_main_container rounded-lg p-6">
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text_main_high">
          Organism Builder
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleClearForm}
            className="px-3 py-2 text-sm text-text_main_medium hover:text-text_main_high border border-border_main_default rounded-md bg-background_main_surface hover:bg-background_main_card transition-colors"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* Preview Section at the top */}
      <div className="bg-background_main_surface rounded-lg shadow-sm border border-border_main_default overflow-hidden mb-8">
        <div className="p-4 border-b border-border_main_default bg-background_main_card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-text_main_high flex items-center">
              <svg
                className="w-4 h-4 mr-1.5 text-text_main_medium"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Live Preview
            </h3>
            {organismData.name && (
              <span className="text-xs font-medium px-2 py-1 bg-background_prim_surface bg-opacity-10 text-background_prim_surface rounded">
                {organismData.name}
              </span>
            )}
          </div>
          <div className="bg-background_main_surface border border-border_main_default rounded-md overflow-hidden min-h-[150px] relative">
            {renderOrganismPreview()}
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-background_main_surface rounded-lg shadow-sm border border-border_main_default overflow-hidden">
        <div className="border-b border-border_main_default bg-background_main_card px-6 py-3">
          <h3 className="text-sm font-medium text-text_main_high">
            Organism Details
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Form Column */}
            <div className="col-span-8">
              <OrganismForm
                onSubmit={handleFormSubmit}
                onCancel={onCancel}
                mode={mode}
                inline={true}
                initialData={organismData}
                onReset={handleClearForm}
                onChange={handleFormUpdate}
                existingMoleculesProp={existingMolecules}
                existingOrganismsProp={existingOrganisms}
              />
            </div>

            {/* JSON Preview Column */}
            <div className="col-span-4">
              <div className="sticky top-6">
                <div className="p-4 bg-background_main_card border border-border_main_default rounded-lg">
                  <h4 className="text-sm font-medium text-text_main_high mb-4 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1.5 text-text_main_medium"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Structure Preview
                  </h4>
                  <div className="bg-background_main_surface border border-border_main_default rounded-md p-4 overflow-auto max-h-[500px]">
                    <pre className="text-xs text-text_main_medium whitespace-pre-wrap">
                      {JSON.stringify(organismData, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganismBuilder;
