import React, { useState, useEffect, useMemo } from 'react';
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
      
      // In update mode, check if anything has actually changed before dispatching
      if (mode === 'update') {
        const existingOrganism = existingOrganisms.find(org => org.id === organismData.id);
        // Only update if something has changed - this prevents unnecessary re-renders
        if (existingOrganism && JSON.stringify(existingOrganism) === JSON.stringify(organismData)) {
          // No changes, just return without dispatching
          return false;
        }
        dispatch(updateOrganism(organismData));
      } else {
        dispatch(addOrganism(organismData));
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
    // Only update if the data has actually changed
    if (JSON.stringify(organismData) !== JSON.stringify(data)) {
      setOrganismData(data);
    }
  };

  // Get mode from URL or props
  const mode = organismData.id && existingOrganisms.some(o => o.id === organismData.id) 
    ? 'edit' 
    : 'create';

  // Render organism preview
  const renderOrganismPreview = () => {
    // If the organism doesn't have a name or is very empty, show placeholder
    if (!organismData.name || !organismData.composition || organismData.composition.length === 0) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-text_main_medium">
          <svg
            className="w-16 h-16 mb-4 text-text_main_low"
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
          <p className="text-base font-medium">Organism Preview</p>
          <p className="text-sm text-text_main_low mt-2 max-w-md text-center">
            {organismData.name ? 
              "Add components to this organism to see a live preview here" : 
              "Start by giving your organism a name in the form below"}
          </p>
          {organismData.name && (
            <div className="mt-4 px-3 py-1.5 bg-background_prim_surface bg-opacity-10 text-background_prim_surface rounded text-sm">
              {organismData.name}
            </div>
          )}
        </div>
      );
    }

    // Use the OrganismRenderer component to render the preview
    return (
      <OrganismRenderer
        organism={organismData}
        processedAtoms={processedAtoms}
        className="w-full h-full min-h-[200px]"
        existingOrganismsProp={existingOrganisms}
        existingMoleculesProp={existingMolecules}
      />
    );
  };

  // Create a stable reference for dependencies that should trigger preview updates
  const previewDependencies = useMemo(() => ({
    organismData: JSON.stringify(organismData),
    processedAtomsLength: Object.keys(processedAtoms).length,
    existingOrganismsLength: existingOrganisms.length,
    existingMoleculesLength: existingMolecules.length
  }), [organismData, processedAtoms, existingOrganisms, existingMolecules]);

  // Memoize the organism preview to prevent unnecessary re-renders
  const organismPreview = useMemo(() => {
    return renderOrganismPreview();
  }, [previewDependencies]);

  // Navigate to molecule builder in a new tab
  const handleOpenMoleculeBuilder = () => {
    // Save current state if needed
    window.open('/molecules/create', '_blank');
  };

  // Navigate to organism builder in a new tab
  const handleOpenOrganismBuilder = () => {
    // Save current state if needed
    window.open('/organisms/create', '_blank');
  };

  return (
    <div className="organism-builder bg-background_main_container rounded-lg p-6">
      {/* Quick Actions Bar */}
      <div className="quick-actions-bar mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-text_main_high">
          {mode === 'create' ? 'Create Organism' : 'Edit Organism'}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-text_main_medium bg-background_main_surface border border-border_main_default rounded-md hover:bg-background_main_card transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-background_main_surface rounded-lg shadow-sm border border-border_main_default overflow-hidden">
        <div className="border-b border-border_main_default bg-background_main_card px-6 py-3">
          <h3 className="text-sm font-medium text-text_main_high">
            Live Preview
          </h3>
        </div>
        <div className="p-6">
          <div className="preview-container border border-border_main_default rounded-lg p-6 overflow-hidden min-h-[250px] ">
            {organismPreview}
          </div>
        </div>
      </div>

      <div className="bg-background_main_surface rounded-lg shadow-sm border border-border_main_default overflow-hidden mt-6">
        <div className="border-b border-border_main_default bg-background_main_card px-6 py-3">
          <h3 className="text-sm font-medium text-text_main_high">
            Organism Details
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Form Column - Now full width */}
            <div className="col-span-8">
              <OrganismForm
                onSubmit={handleFormSubmit}
                onCancel={onCancel}
                mode={mode}
                inline={true}
                initialData={organismData}
                onReset={handleClearForm}
                onChange={handleFormUpdate}
                onOpenMoleculeBuilder={handleOpenMoleculeBuilder}
                onOpenOrganismBuilder={handleOpenOrganismBuilder}
                existingMoleculesProp={existingMolecules}
                existingOrganismsProp={existingOrganisms}
              />
            </div>
            
            {/* JSON Preview now at the bottom */}
            <div className="col-span-4 ">
              <div className="p-4 bg-background_main_card border border-border_main_default rounded-lg">
                <h4 className="text-sm font-medium text-text_main_high mb-4 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1.5 text-text_main_medium"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  JSON Output
                </h4>
                <div className="bg-background_main_surface border border-border_main_default rounded-md p-4 overflow-auto max-h-[500px]">
                  <pre className="text-xs text-text_main_high font-mono whitespace-pre-wrap">
                    {JSON.stringify(organismData, null, 2)}
                  </pre>
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
