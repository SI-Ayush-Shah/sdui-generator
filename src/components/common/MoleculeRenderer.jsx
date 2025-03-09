import React from 'react';
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
  
  console.log("MoleculeRenderer - Redux data:", { 
    atomsFromRedux: atomsFromRedux.length,
    processedAtomsProp: processedAtomsProp ? Object.keys(processedAtomsProp).length : 0
  });
  
  // Process atoms from Redux if available, otherwise use prop
  const processedAtoms = atomsFromRedux.length > 0 
    ? processAtoms(atomsFromRedux)
    : processedAtomsProp;
    
  if (!molecule) return null;

  // Create a deep copy of the molecule to avoid modifying the original
  const previewMolecule = JSON.parse(JSON.stringify(molecule));

  // Process the molecule with atoms
  const processedMolecule = processMolecule(previewMolecule, processedAtoms);
console.log("processedMolecule",processedAtoms);
  // Check if molecule name exists in componentMap
  let MoleculeComponent = previewMolecule.name ? componentMap[previewMolecule.name] : null;

  // Get data for preview
  let previewData = customData;
  if (!previewData && useDummyData && previewMolecule.name && MOLECULE_DUMMY_DATA[previewMolecule.name]) {
    previewData = MOLECULE_DUMMY_DATA[previewMolecule.name];
  }

  return    MoleculeComponent ? (
        <MoleculeComponent {...processedMolecule} data={previewData} />
      ) : (
        <div className="p-3 bg-background_main_card text-text_main_medium text-xs">
          <p className="font-medium">{previewMolecule.name || "Unnamed Molecule"}</p>
          <p className="text-text_main_low mt-1">ID: {previewMolecule.id?.substring(0, 8)}</p>
          {!MoleculeComponent && previewMolecule.name && (
            <p className="text-error_main_high mt-1">Component not found in componentMap</p>
          )}
        </div>
      )
  ;
};

export default MoleculeRenderer; 