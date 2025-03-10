import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box } from "@sikit/ui";
import MoleculeRenderer from './MoleculeRenderer';
import { selectAllMolecules } from "../../store/slices/moleculesSlice";
import { selectAllOrganisms } from "../../store/slices/organismsSlice";

/**
 * A reusable component for rendering organism previews
 * 
 * @param {Object} props
 * @param {Object} props.organism - The organism data to render
 * @param {Object} props.processedAtoms - Processed atoms for molecules
 * @param {String} props.className - Additional classes to apply
 * @param {Number} props.maxDepth - Maximum recursion depth for nested organisms
 * @param {Number} props.currentDepth - Current recursion depth
 * @returns {JSX.Element}
 */
const OrganismRenderer = ({ 
  organism, 
  processedAtoms = {},
  className = "",
  maxDepth = 3,
  currentDepth = 0,
  // Fallback props in case Redux is not available
  existingOrganismsProp = [], 
  existingMoleculesProp = []
}) => {
  // Get organisms and molecules from Redux store with fallback to props
  const existingOrganismsFromRedux = useSelector(selectAllOrganisms) || [];
  const existingMoleculesFromRedux = useSelector(selectAllMolecules) || [];
  
  // Use Redux data if available, otherwise fall back to props
  const existingOrganisms = existingOrganismsFromRedux.length > 0 
    ? existingOrganismsFromRedux 
    : existingOrganismsProp;
    
  const existingMolecules = existingMoleculesFromRedux.length > 0 
    ? existingMoleculesFromRedux 
    : existingMoleculesProp;

  if (!organism) return null;
  
  // Create a deep copy using useMemo to avoid unnecessary cloning on re-renders
  const previewOrganism = useMemo(() => {
    return JSON.parse(JSON.stringify(organism));
  }, [organism]);

  
  // Add any additional classes
  
  return (
    <Box 
      {...organism.properties} 
      {...organism.styles} 
    >
      {previewOrganism.composition && previewOrganism.composition.length > 0 ? (
        // Render organism composition
        previewOrganism.composition.map((component, index) => {
          // Skip if component is not visible
          if (component.visibility === false) return null;
          
          // Generate a stable key for this component
          const componentKey = component.id || `comp-${index}`;
          
          // Render based on component type
          if (component.component_type === 'organism') {
            // Find the nested organism
            const nestedOrganism = existingOrganisms.find(o => o.id === component.id);
            if (!nestedOrganism) {
              return (
                <div 
                  key={componentKey} 
                  className="p-2 bg-background_main_card border border-border_main_default text-text_main_medium text-xs rounded m-1"
                >
                  Organism not found
                </div>
              );
            }
            
            // Render the nested organism with proper styling
            return (
              <React.Fragment key={componentKey}>
                <OrganismRenderer
                  organism={nestedOrganism}
                  processedAtoms={processedAtoms}
                  maxDepth={maxDepth}
                  currentDepth={currentDepth + 1}
                  className="border border-dashed border-border_main_default rounded-md"
                  existingOrganismsProp={existingOrganisms}
                  existingMoleculesProp={existingMolecules}
                />
              </React.Fragment>
            );
          } else {
            // Find the molecule
            const molecule = existingMolecules.find(m => m.id === component.id);
            if (!molecule) {
              return (
                <div
                  key={componentKey}
                  className="bg-background_main_card border border-dashed border-border_main_default rounded-md p-2 m-1 text-text_main_medium text-xs"
                  style={{ 
                    position: previewOrganism.properties?.stack === 'z' ? 'absolute' : 'relative',
                    zIndex: previewOrganism.properties?.stack === 'z' ? index + 1 : 'auto',
                  }}
                >
                  <p>Molecule not found</p>
                  <p className="text-text_main_low">ID: {component.id.substring(0, 8)}</p>
                </div>
              );
            }
            
            // Render the molecule with proper styling
            return (
              
                <MoleculeRenderer 
                  molecule={molecule} 
                  processedAtoms={processedAtoms} 
                />
            );
          }
        })
      ) : (
        // Render placeholder for empty organism
        <div className="p-2 text-xs text-text_main_low flex items-center justify-center w-full">
          Empty Organism: {previewOrganism.name}
        </div>
      )}
    </Box>
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default React.memo(OrganismRenderer); 