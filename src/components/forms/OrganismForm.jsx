import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import SearchableSelect from "../common/SearchableSelect";
import { generateUniqueId } from "../../utils/idGenerator";
import { emptyMolecule, emptyOrganism } from "../../constants/emptyStructures";
import { extractColors } from "../../utils/colors";
import { componentMap } from "../../molecules-mapper/molecules-map.jsx";
import { selectAllMolecules, addMolecule } from "../../store/slices/moleculesSlice";
import { selectAllOrganisms, addOrganism } from "../../store/slices/organismsSlice";
import {
  GRADIENT_OPTIONS,
  SPACING_OPTIONS,
  RADIUS_OPTIONS
} from "../../constants/atomOptions";
// Import the builder components for modals
import MoleculeBuilderModal from "../builders/MoleculeBuilderModal";
import OrganismBuilderModal from "../builders/OrganismBuilderModal";

// Define stack options for organism layout
const STACK_OPTIONS = [
  { value: "h", label: "Horizontal" },
  { value: "v", label: "Vertical" },
  { value: "z", label: "Stacked (Z-index)" },
];

// Define position options for organism
const POSITION_OPTIONS = [
  { value: "top_left", label: "Top Left" },
  { value: "top_right", label: "Top Right" },
  { value: "bottom_left", label: "Bottom Left" },
  { value: "bottom_right", label: "Bottom Right" },
  { value: "center", label: "Center" },
];

// Define text align options
const TEXT_ALIGN_OPTIONS = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
  { value: "justify", label: "Justify" },
];

const TABS = [
  { id: "basic", label: "Basic" },
  { id: "styles", label: "Styles" },
  { id: "border", label: "Border" },
  { id: "composition", label: "Composition" },
];

const COMPONENT_TYPES = [
  { value: "molecule", label: "Molecule" },
  { value: "organism", label: "Organism" }
];

// Export the reusable function for creating empty organisms
export const createEmptyOrganism = () => {
  // Generate a unique ID using our utility
  const uniqueId = generateUniqueId('organism');
  
  return {
    ...emptyOrganism,
    id: uniqueId,
    name: "organism_" + uniqueId.substring(0, 8),
    composition: [] // Empty composition to start with
  };
};

const OrganismForm = ({
  initialData,
  onSubmit,
  onCancel,
  mode = "create",
  inline = false,
  onReset,
  onChange,
  // Handlers for opening builders
  onOpenMoleculeBuilder,
  onOpenOrganismBuilder,
  // Fallback props in case Redux is not available
  existingMoleculesProp = [],
  existingOrganismsProp = [],
}) => {
  // Get molecules and organisms from Redux store with fallback to props
  const existingMoleculesFromRedux = useSelector(selectAllMolecules, () => []);
  const existingOrganismsFromRedux = useSelector(selectAllOrganisms, () => []);
  
  // Use Redux data if available, otherwise fall back to props
  const existingMolecules = existingMoleculesFromRedux.length > 0 
    ? existingMoleculesFromRedux 
    : existingMoleculesProp;
    
  const existingOrganisms = existingOrganismsFromRedux.length > 0 
    ? existingOrganismsFromRedux 
    : existingOrganismsProp;

  const [organismData, setOrganismData] = useState(initialData || createEmptyOrganism());
  const [activeTab, setActiveTab] = useState("basic");
  const colors = extractColors();
  
  // States for component modal and search
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [modalMode, setModalMode] = useState("select");
  const [selectedComponentType, setSelectedComponentType] = useState("molecule");
  const [searchTerm, setSearchTerm] = useState("");
  
  // States for builder modals
  const [showMoleculeBuilderModal, setShowMoleculeBuilderModal] = useState(false);
  const [showOrganismBuilderModal, setShowOrganismBuilderModal] = useState(false);

  const dispatch = useDispatch();

  // Format spacing options for SearchableSelect
  const spacingOptions = SPACING_OPTIONS
    ? SPACING_OPTIONS.map((spacing) => ({ value: spacing, label: spacing }))
    : [];

  // Reset when initialData changes (e.g., switching between organisms)
  useEffect(() => {
    if (initialData) {
      setOrganismData(initialData);
    }
  }, [initialData]);

  // Notify parent component when organism data changes
  // Using useRef to track if the onChange is from user input vs. initialData changes
  const isInitialMount = useRef(true);
  const prevInitialData = useRef(initialData);
  
  useEffect(() => {
    // Skip the first render and when changes are due to initialData updates
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Skip if this update was caused by initialData changing
    if (JSON.stringify(initialData) !== JSON.stringify(prevInitialData.current)) {
      prevInitialData.current = initialData;
      return;
    }
    
    // Only call onChange when the change is from user input
    if (onChange) {
      onChange(organismData);
    }
  }, [organismData, onChange, initialData]);

  const handlePropertyChange = (property, value) => {
    setOrganismData((prev) => ({
      ...prev,
      properties: {
        ...prev.properties,
        [property]: value,
      },
    }));
  };

  const handleStyleChange = (property, value) => {
    setOrganismData((prev) => ({
      ...prev,
      styles: {
        ...prev.styles,
        [property]: value,
      },
    }));
  };

  const handleOffsetChange = (side, value) => {
    setOrganismData((prev) => ({
      ...prev,
      styles: {
        ...prev.styles,
        offset: {
          ...prev.styles.offset,
          [side]: parseInt(value) || 0,
        },
      },
    }));
  };

  const handlePaddingChange = (side, value) => {
    setOrganismData((prev) => ({
      ...prev,
      styles: {
        ...prev.styles,
        padding: {
          ...prev.styles.padding,
          [side]: value,
        },
      },
    }));
  };

  const handleBorderRadiusChange = (corner, value) => {
    setOrganismData((prev) => ({
      ...prev,
      styles: {
        ...prev.styles,
        border_radius: {
          ...prev.styles.border_radius,
          [corner]: value,
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    // Always prevent the default form submission behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Generate a new ID if in create mode, otherwise keep the existing ID
    const finalOrganismData = {
      ...organismData,
      id: mode === 'create' ? generateUniqueId('organism') : organismData.id
    };

    // Pass the organism data to the parent component's submit handler
    onSubmit(finalOrganismData);
    
    // Return false to prevent form submission
    return false;
  };

  const handleReset = () => {
    // Reset to an empty organism
    const emptyOrg = createEmptyOrganism();
    setOrganismData(emptyOrg);
    if (onReset) onReset(emptyOrg);
  };

  const handleNameChange = (name) => {
    setOrganismData(prev => ({
      ...prev,
      name
    }));
  };

  // Add a component (molecule or organism) to the organism
  const handleAddComponent = (componentId) => {
    // Don't allow adding the current organism to itself
    if (selectedComponentType === 'organism' && componentId === organismData.id) {
      alert("Cannot add an organism to itself");
      return;
    }
    
    setOrganismData(prev => ({
      ...prev,
      composition: [
        ...prev.composition,
        {
          component_type: selectedComponentType,
          id: componentId,
          visibility: true
        }
      ]
    }));
    setShowComponentModal(false);
  };

  // Remove a component from the organism
  const handleRemoveComponent = (index) => {
    setOrganismData(prev => ({
      ...prev,
      composition: prev.composition.filter((_, i) => i !== index)
    }));
  };

  // Toggle component visibility
  const handleToggleComponentVisibility = (index) => {
    setOrganismData(prev => {
      const updatedComposition = [...prev.composition];
      updatedComposition[index] = {
        ...updatedComposition[index],
        visibility: !updatedComposition[index].visibility
      };
      return {
        ...prev,
        composition: updatedComposition
      };
    });
  };

  // Filter components for search based on the selected type
  const filteredComponents = selectedComponentType === 'molecule' 
    ? existingMolecules.filter(component => 
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : existingOrganisms.filter(component => 
        // Filter out the current organism to prevent circular references
        component.id !== organismData.id && (
          component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          component.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

  // Get component details by type and id
  const getComponentDetails = (type, id) => {
    if (type === 'molecule') {
      return existingMolecules.find(m => m.id === id);
    } else if (type === 'organism') {
      return existingOrganisms.find(o => o.id === id);
    }
    return null;
  };

  // Modified component creation functions to use modals
  const openMoleculeBuilderModal = () => {
    setShowComponentModal(false); // Close the component selection modal
    setShowMoleculeBuilderModal(true); // Open the molecule builder modal
  };

  const openOrganismBuilderModal = () => {
    setShowComponentModal(false); // Close the component selection modal
    setShowOrganismBuilderModal(true); // Open the organism builder modal
  };

  // Handler for when a new molecule is created in the modal
  const handleMoleculeCreated = (newMolecule) => {
    // Close the modal
    setShowMoleculeBuilderModal(false);
    
    // Add the component to the organism's composition
    if (newMolecule && newMolecule.id) {
      handleAddComponent(newMolecule.id);
    }
  };

  // Handler for when a new organism is created in the modal
  const handleOrganismCreated = (newOrganism) => {
    // Close the modal
    setShowOrganismBuilderModal(false);
    
    // Add the component to the organism's composition
    if (newOrganism && newOrganism.id) {
      handleAddComponent(newOrganism.id);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-4 border-b border-border_main_default">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-background_main_surface text-text_main_high border-b-2 border-background_prim_surface"
                    : "text-text_main_medium hover:text-text_main_high border-b-2 border-transparent hover:border-border_main_default"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Form content based on active tab */}
        <div className="space-y-6 pt-6">
          {/* Basic Tab */}
          <div className={activeTab === "basic" ? "block" : "hidden"}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text_main_high mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={organismData.name || ""}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-border_main_default rounded-md bg-background_main_surface text-text_main_high focus:outline-none focus:ring-1 focus:ring-background_prim_surface"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text_main_high mb-1">
                  Stack
                </label>
                <SearchableSelect
                  options={STACK_OPTIONS}
                  value={organismData.properties.stack || "h"}
                  onChange={(value) => handlePropertyChange("stack", value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text_main_high mb-1">
                  Position
                </label>
                <SearchableSelect
                  options={POSITION_OPTIONS}
                  value={organismData.properties.position || ""}
                  onChange={(value) => handlePropertyChange("position", value)}
                />
              </div>
            </div>
          </div>

          {/* Styles Tab */}
          <div className={activeTab === "styles" ? "block" : "hidden"}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text_main_high mb-1">
                  Background Color
                </label>
                <SearchableSelect
                  options={colors}
                  value={organismData.styles.background_color || ""}
                  onChange={(value) => handleStyleChange("background_color", value)}
                  isColor={true}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text_main_high mb-1">
                  Background Image URL
                </label>
                <input
                  type="text"
                  value={organismData.styles.background_img || ""}
                  onChange={(e) => handleStyleChange("background_img", e.target.value)}
                  placeholder="URL or path to image"
                  className="w-full px-3 py-2 border border-border_main_default rounded-md bg-background_main_surface text-text_main_high focus:outline-none focus:ring-1 focus:ring-background_prim_surface"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text_main_high mb-1">
                  Gradient
                </label>
                <SearchableSelect
                  options={
                    GRADIENT_OPTIONS?.map((gradient) => ({
                      value: gradient,
                      label: gradient,
                    })) || []
                  }
                  value={organismData.styles.gradient || ""}
                  onChange={(value) => handleStyleChange("gradient", value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text_main_high mb-1">
                  Gap
                </label>
                <SearchableSelect
                  options={spacingOptions}
                  value={organismData.styles.gap || ""}
                  onChange={(value) => handleStyleChange("gap", value)}
                />
              </div>

              {/* Padding */}
              <div>
                <label className="block text-sm font-medium text-text_main_high mb-1">
                  Padding
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-text_main_medium mb-1">Top</label>
                    <SearchableSelect
                      options={spacingOptions}
                      value={organismData.styles.padding.top || ""}
                      onChange={(value) => handlePaddingChange("top", value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text_main_medium mb-1">Right</label>
                    <SearchableSelect
                      options={spacingOptions}
                      value={organismData.styles.padding.right || ""}
                      onChange={(value) => handlePaddingChange("right", value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text_main_medium mb-1">Bottom</label>
                    <SearchableSelect
                      options={spacingOptions}
                      value={organismData.styles.padding.bottom || ""}
                      onChange={(value) => handlePaddingChange("bottom", value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text_main_medium mb-1">Left</label>
                    <SearchableSelect
                      options={spacingOptions}
                      value={organismData.styles.padding.left || ""}
                      onChange={(value) => handlePaddingChange("left", value)}
                    />
                  </div>
                </div>
              </div>

              {/* Offset */}
              <div>
                <label className="block text-sm font-medium text-text_main_high mb-1">
                  Offset
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-text_main_medium mb-1">Top</label>
                    <input
                      type="number"
                      value={organismData.styles.offset.top}
                      onChange={(e) => handleOffsetChange("top", e.target.value)}
                      className="w-full px-3 py-2 border border-border_main_default rounded-md bg-background_main_surface text-text_main_high focus:outline-none focus:ring-1 focus:ring-background_prim_surface"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text_main_medium mb-1">Right</label>
                    <input
                      type="number"
                      value={organismData.styles.offset.right}
                      onChange={(e) => handleOffsetChange("right", e.target.value)}
                      className="w-full px-3 py-2 border border-border_main_default rounded-md bg-background_main_surface text-text_main_high focus:outline-none focus:ring-1 focus:ring-background_prim_surface"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text_main_medium mb-1">Bottom</label>
                    <input
                      type="number"
                      value={organismData.styles.offset.bottom}
                      onChange={(e) => handleOffsetChange("bottom", e.target.value)}
                      className="w-full px-3 py-2 border border-border_main_default rounded-md bg-background_main_surface text-text_main_high focus:outline-none focus:ring-1 focus:ring-background_prim_surface"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text_main_medium mb-1">Left</label>
                    <input
                      type="number"
                      value={organismData.styles.offset.left}
                      onChange={(e) => handleOffsetChange("left", e.target.value)}
                      className="w-full px-3 py-2 border border-border_main_default rounded-md bg-background_main_surface text-text_main_high focus:outline-none focus:ring-1 focus:ring-background_prim_surface"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Border Tab */}
          <div className={activeTab === "border" ? "block" : "hidden"}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text_main_high mb-1">
                  Border Width
                </label>
                <input
                  type="text"
                  value={organismData.styles.border_width || ""}
                  onChange={(e) => handleStyleChange("border_width", e.target.value)}
                  placeholder="Border width (px, rem, etc.)"
                  className="w-full px-3 py-2 border border-border_main_default rounded-md bg-background_main_surface text-text_main_high focus:outline-none focus:ring-1 focus:ring-background_prim_surface"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text_main_high mb-1">
                  Border Color
                </label>
                <SearchableSelect
                  options={colors}
                  value={organismData.styles.border_color || ""}
                  onChange={(value) => handleStyleChange("border_color", value)}
                  isColor={true}
                />
              </div>

              {/* Border Radius */}
              <div>
                <label className="block text-sm font-medium text-text_main_high mb-1">
                  Border Radius
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-text_main_medium mb-1">Top Left</label>
                    <SearchableSelect
                      options={RADIUS_OPTIONS}
                      value={organismData.styles.border_radius.top_left || ""}
                      onChange={(value) => handleBorderRadiusChange("top_left", value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text_main_medium mb-1">Top Right</label>
                    <SearchableSelect
                      options={RADIUS_OPTIONS}
                      value={organismData.styles.border_radius.top_right || ""}
                      onChange={(value) => handleBorderRadiusChange("top_right", value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text_main_medium mb-1">Bottom Left</label>
                    <SearchableSelect
                      options={RADIUS_OPTIONS}
                      value={organismData.styles.border_radius.bottom_left || ""}
                      onChange={(value) => handleBorderRadiusChange("bottom_left", value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text_main_medium mb-1">Bottom Right</label>
                    <SearchableSelect
                      options={RADIUS_OPTIONS}
                      value={organismData.styles.border_radius.bottom_right || ""}
                      onChange={(value) => handleBorderRadiusChange("bottom_right", value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Composition Tab */}
          <div className={activeTab === "composition" ? "block" : "hidden"}>
            <div className="space-y-6">
              <div className="bg-background_main_card p-4 rounded-md border border-border_main_default">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-text_main_high">Component Composition</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedComponentType("molecule");
                      setShowComponentModal(true);
                    }}
                    className="px-3 py-2 text-sm bg-button_filled_style_2_surface_default text-button_filled_style_2_text_icon_default rounded-md hover:bg-button_filled_style_2_surface_hover"
                  >
                    Add Component
                  </button>
                </div>
                
                <p className="text-xs text-text_main_medium mb-4">
                  Add molecules and organisms to create your layout.
                </p>
                
                {organismData.composition && organismData.composition.length > 0 ? (
                  <div className="space-y-2">
                    {organismData.composition.map((component, index) => {
                      // Find component details based on type
                      const componentDetails = getComponentDetails(component.component_type, component.id);
                      
                      return (
                        <div 
                          key={component.id || index} 
                          className="flex items-center justify-between p-3 bg-background_main_surface rounded border border-border_main_default"
                        >
                          <div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full mr-2 ${
                              component.component_type === 'molecule' 
                                ? 'bg-background_sec_surface text-text_sec_high' 
                                : 'bg-background_prim_surface bg-opacity-20 text-background_prim_surface'
                            }`}>
                              {component.component_type === 'molecule' ? 'Molecule' : 'Organism'}
                            </span>
                            <span className="text-sm text-text_main_high">
                              {componentDetails?.name || "Unknown Component"}
                            </span>
                            <span className="text-xs text-text_main_medium ml-2">
                              {component.id.substring(0, 8)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleToggleComponentVisibility(index)}
                              className="p-1.5 rounded text-text_main_medium hover:text-text_main_high hover:bg-background_main_card"
                              title={component.visibility ? "Hide component" : "Show component"}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                {component.visibility ? (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                ) : (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                                  />
                                )}
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveComponent(index)}
                              className="p-1.5 rounded text-text_main_medium hover:text-error_main_high hover:bg-background_main_card"
                              title="Remove component"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-text_main_medium border border-dashed border-border_main_default rounded-md bg-background_main_surface">
                    <svg
                      className="w-10 h-10 mx-auto mb-2 text-text_main_low"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium">No components added yet</p>
                    <p className="text-xs mt-1">Click "Add Component" to add molecules or organisms to this layout</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Form actions */}
        <div className="mt-8 pt-4 border-t border-border_main_default flex justify-end space-x-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-text_main_medium bg-background_main_surface border border-border_main_default rounded-md hover:bg-background_main_card transition-colors"
            >
              Cancel
            </button>
          )}
          {onReset && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-text_main_medium bg-background_main_surface border border-border_main_default rounded-md hover:bg-background_main_card transition-colors"
            >
              Reset
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-button_filled_style_2_text_icon_default bg-button_filled_style_2_surface_default rounded-md hover:bg-button_filled_style_2_surface_hover transition-colors"
          >
            {mode === "create" ? "Save Organism" : "Update Organism"}
          </button>
        </div>
      </form>
      
      {/* Component Selection Modal */}
      {showComponentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background_main_container rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-border_main_default bg-background_main_card">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-text_main_high">
                  {modalMode === "create" ? `Create New Component` : "Select Component"}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowComponentModal(false)}
                  className="text-text_main_medium hover:text-text_main_high"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {/* Modal Mode Tabs */}
              <div className="mb-4 border-b border-border_main_default">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setModalMode("select")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${
                      modalMode === "select"
                        ? 'border-background_prim_surface text-text_main_high'
                        : 'border-transparent text-text_main_medium hover:text-text_main_high'
                    }`}
                  >
                    Select Existing
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalMode("create")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${
                      modalMode === "create"
                        ? 'border-background_prim_surface text-text_main_high'
                        : 'border-transparent text-text_main_medium hover:text-text_main_high'
                    }`}
                  >
                    Create New
                  </button>
                </div>
              </div>

              {modalMode === "select" ? (
                <>
                  {/* Component Type Selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text_main_high mb-1">
                      Component Type
                    </label>
                    <div className="flex space-x-3 mb-4">
                      {COMPONENT_TYPES.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setSelectedComponentType(type.value)}
                          className={`px-4 py-2 text-sm font-medium rounded-md ${
                            selectedComponentType === type.value
                              ? 'bg-background_prim_surface text-text_prim_high'
                              : 'bg-background_main_surface text-text_main_medium border border-border_main_default hover:bg-background_main_card'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder={`Search ${selectedComponentType}s...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-border_main_default rounded-md bg-background_main_surface text-text_main_high"
                    />
                  </div>
                  
                  {/* Components List */}
                  <div className="overflow-y-auto max-h-[60vh]">
                    {filteredComponents.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {filteredComponents.map((component) => (
                          <div
                            key={component.id}
                            className="flex items-center justify-between p-3 bg-background_main_surface border border-border_main_default rounded-md hover:border-background_prim_surface cursor-pointer"
                            onClick={() => handleAddComponent(component.id)}
                          >
                            <div>
                              <span className="text-sm font-medium text-text_main_high">
                                {component.name}
                              </span>
                              <span className="text-xs text-text_main_medium ml-2">
                                {component.id.substring(0, 8)}
                              </span>
                            </div>
                            <div>
                              <button
                                type="button"
                                className="px-2 py-1 text-xs bg-background_prim_surface text-text_prim_high rounded"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-text_main_medium">
                        <p className="text-sm font-medium">No {selectedComponentType}s found</p>
                        {searchTerm ? (
                          <p className="text-xs mt-1">Try a different search term</p>
                        ) : (
                          <div>
                            <p className="text-xs mt-1">
                              No existing {selectedComponentType}s available
                            </p>
                            <button
                              type="button"
                              onClick={() => setModalMode("create")}
                              className="mt-3 px-3 py-2 text-sm bg-background_prim_surface text-text_prim_high rounded-md hover:bg-opacity-90"
                            >
                              Create New {selectedComponentType}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Create New Component Tab */
                <div className="overflow-y-auto py-6 px-4">
                  <div className="text-center mb-8">
                    <p className="text-lg font-medium text-text_main_high mb-2">
                      Create a New Component
                    </p>
                    <p className="text-sm text-text_main_medium">
                      Choose the type of component you want to create
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Create Molecule Card */}
                    <div 
                      className="bg-background_main_surface border border-border_main_default rounded-lg p-6 flex flex-col items-center text-center hover:border-background_prim_surface cursor-pointer transition-all"
                      onClick={openMoleculeBuilderModal}
                    >
                      <div className="w-16 h-16 rounded-full bg-background_sec_surface bg-opacity-20 flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-background_sec_surface"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <h3 className="text-base font-medium text-text_main_high mb-2">Create Molecule</h3>
                      <p className="text-sm text-text_main_medium">
                        Open the Molecule Builder to create a detailed molecule component
                      </p>
                    </div>
                    
                    {/* Create Organism Card */}
                    <div 
                      className="bg-background_main_surface border border-border_main_default rounded-lg p-6 flex flex-col items-center text-center hover:border-background_prim_surface cursor-pointer transition-all"
                      onClick={openOrganismBuilderModal}
                    >
                      <div className="w-16 h-16 rounded-full bg-background_prim_surface bg-opacity-20 flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-background_prim_surface"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-base font-medium text-text_main_high mb-2">Create Organism</h3>
                      <p className="text-sm text-text_main_medium">
                        Open the Organism Builder to create a complex organism layout
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Molecule Builder Modal */}
      {showMoleculeBuilderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-auto py-8">
          <div className="bg-background_main_container rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-border_main_default bg-background_main_card sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-text_main_high">
                  Create New Molecule
                </h3>
                <button
                  type="button"
                  onClick={() => setShowMoleculeBuilderModal(false)}
                  className="text-text_main_medium hover:text-text_main_high"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <MoleculeBuilderModal 
                onCancel={() => setShowMoleculeBuilderModal(false)} 
                onMoleculeCreated={handleMoleculeCreated} 
                inline={true}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Organism Builder Modal */}
      {showOrganismBuilderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-auto py-8">
          <div className="bg-background_main_container rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-border_main_default bg-background_main_card sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-text_main_high">
                  Create New Organism
                </h3>
                <button
                  type="button"
                  onClick={() => setShowOrganismBuilderModal(false)}
                  className="text-text_main_medium hover:text-text_main_high"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <OrganismBuilderModal 
                onCancel={() => setShowOrganismBuilderModal(false)} 
                onOrganismCreated={handleOrganismCreated}
                inline={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrganismForm; 