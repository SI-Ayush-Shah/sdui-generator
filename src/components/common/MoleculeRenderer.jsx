import React, { useMemo } from 'react';
import { componentMap } from "../../molecules-mapper/molecules-map.jsx";
import { MOLECULE_DUMMY_DATA } from "../../constants/moleculeOptions";
import { processMolecule } from "../../utils/compile.js";
import { useSelector } from 'react-redux';
import { selectAllAtoms } from '../../store/slices/atomsSlice';
import { processAtoms } from '../../utils/compile.js';

/**
 * A reusable component for rendering molecule previews
 * 
 * @param {Object} props
 * @param {Object} props.molecule - The molecule data to render
 * @param {Object} props.processedAtoms - Processed atoms for the molecule (fallback if Redux not available)
 * @param {String} props.className - Additional classes to apply
 * @param {Boolean} props.useDummyData - Whether to use dummy data for preview
 * @param {Object} props.customData - Custom data to use instead of dummy data
 * @returns {JSX.Element}
 */
const MoleculeRenderer = ({ 
  molecule, 
  processedAtoms: processedAtomsProp, 
  className = "", 
  useDummyData = true,
  customData = null 
}) => {
  // Get atoms from Redux
  const atomsFromRedux = useSelector(selectAllAtoms) || [];
  
  // Process atoms from Redux if available, otherwise use prop
  const processedAtoms = atomsFromRedux.length > 0 
    ? processAtoms(atomsFromRedux)
    : processedAtomsProp;
    
  if (!molecule) return null;

  // Create a deep copy of the molecule and process it with atoms, memoized to avoid unnecessary processing
  const processedMolecule = useMemo(() => {
    const previewMolecule = JSON.parse(JSON.stringify(molecule));
    return processMolecule(previewMolecule, processedAtoms);
  }, [molecule, processedAtoms]);

  // Check if molecule name exists in componentMap
  let MoleculeComponent = molecule.name ? componentMap[molecule.name] : null;
  
  // If no matching component is found, return a placeholder
  if (!MoleculeComponent) {
    return (
      <div className={`molecule-renderer p-2 bg-background_main_card border border-border_main_default text-text_main_medium text-xs rounded ${className}`}>
        Unknown Molecule: {molecule.name}
      </div>
    );
  }

  // Determine what data to use for the molecule
  const dataToUse = customData || (useDummyData ? MOLECULE_DUMMY_DATA[molecule.name] || {} : {});
console.log("dataToUse", dataToUse);
  // Render the molecule with the appropriate data
  return (
      <MoleculeComponent 
        key={molecule.id}
        {...processedMolecule} 
        data={dataToUse}
      />
  );
};

// Wrap with React.memo to prevent unnecessary re-renders
export default React.memo(MoleculeRenderer); 