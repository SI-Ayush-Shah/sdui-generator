import React, { useState, useEffect } from "react";
import { emptyMolecule } from "../../constants/emptyStructures";
import TokenSelect from "../common/TokenSelect";
import SearchableSelect from "../common/SearchableSelect";
import ComponentSelectionModal from "../common/ComponentSelectionModal";
import AtomBuilder from "./AtomBuilder";
import { extractColors } from "../../utils/colors";
import {
  RADIUS_OPTIONS,
  TYPOGRAPHY_OPTIONS,
  GRADIENT_OPTIONS,
  SPACING_OPTIONS,
  ATOM_TYPES as ATOM_TYPE_OPTIONS,
} from "../../constants/atomOptions";
import {
  VARIANT_OPTIONS,
  SUB_VARIANT_OPTIONS,
  MOLECULE_NAMES,
  MOLECULE_DUMMY_DATA,
} from "../../constants/moleculeOptions";
import {
  getAtomOptionsForMolecule,
  getAtomStructureForMolecule,
  ATOM_TYPES,
} from "../../constants/moleculeStructures";
import {
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiGrid,
  FiBox,
  FiLayers,
  FiFileText,
  FiUser,
  FiCalendar,
  FiLayout,
  FiStar,
  FiPlus,
  FiInfo,
} from "react-icons/fi";
import { Button, Text, Badge, Img } from "@sikit/ui";
import { componentMap } from "../../molecules-mapper/molecules-map.jsx";
import { processAtoms, processMolecule } from "../../utils/compile.js";
import AtomForm from "../forms/AtomForm";
import { generateUniqueId } from "../../utils/idGenerator";
import { toast } from "react-hot-toast";

// Test environment variables
const apiUrl = process.env.VITE_API_URL;
const appName = process.env.VITE_APP_NAME;
console.log("Environment Variables Test:", { apiUrl, appName });

const STACK_OPTIONS = [
  { value: "h", label: "Horizontal" },
  { value: "v", label: "Vertical" },
];

// Enhanced molecule filters with more specific categories
const MOLECULE_FILTERS = [
  { id: "all", label: "All Molecules", icon: FiGrid },
  { id: "article", label: "Article", icon: FiFileText },
  { id: "player", label: "Player", icon: FiUser },
  { id: "fixturecard", label: "Fixture Card", icon: FiCalendar },
  { id: "section", label: "Section", icon: FiLayout },
  { id: "footer", label: "Footer", icon: FiLayout },
  { id: "other", label: "Other", icon: FiStar },
];

// Function to determine molecule category based on name
const getMoleculeCategory = (moleculeName) => {
  if (!moleculeName) return "other";

  const nameStr = String(moleculeName).toLowerCase();

  if (nameStr.includes("article")) return "article";
  if (nameStr.includes("player")) return "player";
  if (nameStr.includes("fixturecard") || nameStr.includes("fixture"))
    return "fixturecard";
  if (nameStr.includes("section")) return "section";
  if (nameStr.includes("footer")) return "footer";

  return "other";
};

const MoleculeBuilder = ({
  onAdd,
  handleAddComponent,
  existingMolecules,
  existingAtoms,
  onUpdate,
  inline = false,
}) => {
  const [molecule, setMolecule] = useState(emptyMolecule);
  const [showAtomModal, setShowAtomModal] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [moleculesFilter, setMoleculesFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const colors = extractColors();
  const prossedExistingAtoms = processAtoms(existingAtoms);

  // For custom atom name modal
  const [selectedAtomId, setSelectedAtomId] = useState(null);
  const [showCustomNameModal, setShowCustomNameModal] = useState(false);
  const [customAtomName, setCustomAtomName] = useState("");
  const [customTranslationKey, setCustomTranslationKey] = useState("");

  // State for controlling modals
  const [showAtomCreationModal, setShowAtomCreationModal] = useState(false);
  const [selectedAtomType, setSelectedAtomType] = useState(null);
  const [selectedAtomName, setSelectedAtomName] = useState('');

  // For atom library modal
  const [showAtomLibraryModal, setShowAtomLibraryModal] = useState(false);

  // Debug log for component map and available molecule names
  useEffect(() => {
    console.log(
      "Available components in componentMap:",
      Object.keys(componentMap)
    );
    console.log("Molecule names in constants:", MOLECULE_NAMES);
    console.log("Dummy data molecule keys:", Object.keys(MOLECULE_DUMMY_DATA));

    // Check if any molecule names in MOLECULE_NAMES don't have components
    if (MOLECULE_NAMES) {
      const missingComponents = MOLECULE_NAMES.filter(
        (name) => !componentMap[name.value]
      );
      if (missingComponents.length > 0) {
        console.warn(
          "Missing components for molecule types:",
          missingComponents
        );
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Process the form
    const moleculeData = {
      ...molecule,
      id: molecule.id || generateUniqueId('molecule'),
      name: molecule.name,
      atoms: molecule.atoms,
    };

    onAdd(moleculeData);
    setMolecule(emptyMolecule);
  };

  // Initial handler for selecting an atom - this now shows the custom name modal
  const handleSelectAtom = (atomId) => {
    const atomToAdd = existingAtoms.find((a) => a.id === atomId);
    if (!atomToAdd) return;

    // Pre-fill the custom name based on the atom type and suggested names for this molecule type
    let suggestedName = "";

    // Look for matching suggested atom name based on atom type
    if (molecule.name) {
      const moleculeStructure = getAtomStructureForMolecule(molecule.name);
      if (moleculeStructure) {
        // Find a matching suggested atom name that matches this atom's type
        const suggestedAtomNames = Object.entries(moleculeStructure)
          .filter(([_, config]) => config.type === atomToAdd.atom_type)
          .map(([name]) => name);

        if (suggestedAtomNames.length > 0) {
          suggestedName = suggestedAtomNames[0]; // Use the first matching suggestion
        }
      }
    }

    // If no suggested name found, use the atom's type as fallback
    setCustomAtomName(suggestedName || atomToAdd.atom_type);
    setSelectedAtomId(atomId);
    setShowCustomNameModal(true);
  };

  // Actual handler to add the atom with the custom name
  const handleAddAtom = (atomId, displayName, translationKey = "") => {
    // Find the original atom
    const atomToAdd = existingAtoms.find((a) => a.id === atomId);
    if (!atomToAdd) return;

    // Add the atom reference to the molecule with the custom name
    setMolecule((prev) => ({
      ...prev,
      atoms: [
        ...prev.atoms,
        {
          id: atomId,
          name: displayName || atomToAdd.atom_type || "Unnamed Atom",
          visibility: true,
          translation_key: translationKey,
        },
      ],
    }));
  };

  // Submit custom atom name from modal
  const handleCustomNameSubmit = () => {
    if (selectedAtomId) {
      // If we have an atom ID, we're adding an existing atom
      
      // Add a number suffix if this name is already used
      const existingNames = molecule.atoms.map(a => a.name);
      let nameIndex = 1;
      let finalName = customAtomName;
      
      while (existingNames.includes(finalName)) {
        finalName = `${customAtomName}_${nameIndex}`;
        nameIndex++;
      }
      
      // Add the atom with the custom name and translation key
      handleAddAtom(selectedAtomId, finalName, customTranslationKey);
      
      // Show success message
      toast.success(`Atom added as "${finalName}"`);
    } else {
      // If we don't have an atom ID, we need to create a new atom
      // First determine the atom type based on the name and molecule structure
      let atomType = ATOM_TYPES.TEXT; // Default type

      if (molecule.name) {
        const structure = getAtomStructureForMolecule(molecule.name);
        if (structure && structure[customAtomName]) {
          atomType = structure[customAtomName].type;
        }
      }

      // Create a new atom
      const newAtom = {
        id: generateUniqueId('atom'),
        name: `${customAtomName}_${Date.now().toString(36)}`, // Unique name for the atom
        atom_type: atomType,
        styles: {},
        properties: {},
      };

      // Add the atom to the global list
      handleAddComponent("atom", newAtom, false);

      // Add it to the molecule with the custom name
      handleAddAtom(newAtom.id, customAtomName, customTranslationKey);
    }

    setShowCustomNameModal(false);
    setSelectedAtomId(null);
    setCustomAtomName("");
    setCustomTranslationKey("");
  };

  // Create a new atom and immediately add it to the molecule (avoid page refresh)
  const handleCreateAtom = (atomData) => {
    // Prevent form submission default behavior that would refresh the page
    event.preventDefault && event.preventDefault();

    // Generate an ID if not present
    const newAtom = {
      ...atomData,
      id: atomData.id || generateUniqueId('atom'),
    };

    // Add the atom to the global store without redirecting or refreshing
    handleAddComponent("atom", newAtom, false);

    // Pre-select a name for this new atom and show the modal
    setSelectedAtomId(newAtom.id);

    // Try to suggest a name based on the atom type
    let suggestedName = "";
    if (molecule.name) {
      const moleculeStructure = getAtomStructureForMolecule(molecule.name);
      if (moleculeStructure) {
        const matchingNames = Object.entries(moleculeStructure)
          .filter(([_, config]) => config.type === newAtom.atom_type)
          .map(([name]) => name);

        if (matchingNames.length > 0) {
          suggestedName = matchingNames[0];
        }
      }
    }
    setCustomAtomName(suggestedName || newAtom.atom_type);

    setShowAtomModal(false);
    setShowCustomNameModal(true);
  };

  // Modify an atom's custom name in the molecule
  const handleAtomNameChange = (index, newName) => {
    setMolecule((prev) => {
      const updatedAtoms = [...prev.atoms];
      updatedAtoms[index] = {
        ...updatedAtoms[index],
        name: newName,
      };
      return {
        ...prev,
        atoms: updatedAtoms,
      };
    });
  };

  // Updated function to get the atom object from either an ID reference or object structure
  const getAtomById = (atomRef) => {
    if (!atomRef) return null;

    if (typeof atomRef === "string") {
      return existingAtoms.find((a) => a.id === atomRef);
    } else if (atomRef.id) {
      return existingAtoms.find((a) => a.id === atomRef.id);
    } else {
      return atomRef;
    }
  };

  const handleStyleChange = (key, value, nestedKey = null) => {
    setMolecule((prev) => ({
      ...prev,
      styles: {
        ...prev.styles,
        [key]: nestedKey ? { ...prev.styles[key], [nestedKey]: value } : value,
      },
    }));
  };

  const handlePropertyChange = (key, value) => {
    setMolecule((prev) => ({
      ...prev,
      properties: {
        ...prev.properties,
        [key]: value,
      },
    }));
  };

  const handleEditMolecule = (moleculeToEdit) => {
    // Remove data property if it exists
    const { data, ...moleculeWithoutData } = moleculeToEdit;

    setMolecule(moleculeWithoutData);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteMolecule = (id) => {
    if (window.confirm("Are you sure you want to delete this molecule?")) {
      // Call the onUpdate function with the id to delete
      onUpdate && onUpdate({ type: "delete", id });
    }
  };

  const TABS = [
    { id: "basic", label: "Basic" },
    { id: "styles", label: "Styles" },
    { id: "atoms", label: "Atoms" },
  ];

  // Format spacing options for SearchableSelect
  const spacingOptions = SPACING_OPTIONS
    ? SPACING_OPTIONS.map((spacing) => ({ value: spacing, label: spacing }))
    : [];

  // Filter and sort molecules
  const filteredMolecules = existingMolecules.filter((mol) => {
    if (!mol) return false;

    // Filter by category
    const category = getMoleculeCategory(mol.name);
    const matchesCategory =
      moleculesFilter === "all" || category === moleculesFilter;

    // Filter by search query
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (mol.name?.toLowerCase() || "").includes(searchLower) ||
      (mol.id?.toLowerCase() || "").includes(searchLower);

    return matchesCategory && matchesSearch;
  });

  // Group molecules by category for analytics
  const moleculesByCategory = MOLECULE_FILTERS.reduce((acc, filter) => {
    if (filter.id === "all") return acc;
    acc[filter.id] = existingMolecules.filter(
      (mol) => getMoleculeCategory(mol?.name) === filter.id
    ).length;
    return acc;
  }, {});

  // Render molecule preview
  const renderMoleculePreview = (mol) => {
    if (!mol) return null;

    // Create a deep copy of the molecule to avoid modifying the original
    const previewMolecule = JSON.parse(JSON.stringify(mol));

    // Get atoms from molecule
    const processedMolecule = processMolecule(
      previewMolecule,
      prossedExistingAtoms
    );

    // Check if molecule name exists in componentMap
    let Molecule = previewMolecule.name
      ? componentMap[previewMolecule.name]
      : null;

    // Only add data for preview purposes
    let previewData = {};
    if (previewMolecule.name && MOLECULE_DUMMY_DATA[previewMolecule.name]) {
      previewData = MOLECULE_DUMMY_DATA[previewMolecule.name];
    }

    return (
      <div
        className={`p-3 border border-border_main_default rounded-md overflow-hidden`}
      >
        {Molecule ? (
          <Molecule {...processedMolecule} data={previewData} />
        ) : (
          <div className="p-4 bg-background_main_card rounded border border-error_main_surface text-error_main_high">
            <p className="text-sm font-medium">Component Not Found</p>
            <p className="text-xs mt-1">
              No component found for molecule type:{" "}
              {previewMolecule.name || "undefined"}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="molecule-builder bg-background_main_container rounded-lg p-6">
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text_main_high">
          Molecule Builder
        </h2>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setMolecule(emptyMolecule)}
            className="px-3 py-2 text-sm text-text_main_medium hover:text-text_main_high border border-border_main_default rounded-md bg-background_main_surface hover:bg-background_main_card transition-colors"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-background_main_surface rounded-lg shadow-sm border border-border_main_default overflow-hidden mb-8">
        {/* Tabs */}
        <div className="border-b border-border_main_default bg-background_main_card">
          <nav className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-6 text-sm font-medium transition-colors ${
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

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Form Column */}
            <div className="col-span-8">
              {/* Basic Tab */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Name
                      </label>
                      <SearchableSelect
                        options={MOLECULE_NAMES || []}
                        value={molecule.name}
                        onChange={(value) =>
                          setMolecule({ ...molecule, name: value })
                        }
                        allowCustomValue={true}
                        placeholder="e.g., molecule_player_thumbnail"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Stack
                      </label>
                      <SearchableSelect
                        options={STACK_OPTIONS}
                        value={molecule.properties?.stack || ""}
                        onChange={(value) =>
                          handlePropertyChange("stack", value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Variant
                      </label>
                      <input
                        type="text"
                        value={molecule.properties?.variant || ""}
                        onChange={(e) =>
                          handlePropertyChange("variant", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-border_main_default rounded-md text-text_main_high placeholder-text_main_disable bg-background_main_surface focus:border-background_prim_surface focus:ring-1 focus:ring-background_prim_card transition-colors"
                        placeholder="e.g., primary, 1, 2, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Sub Variant
                      </label>
                      <input
                        type="text"
                        value={molecule.properties?.sub_variant || ""}
                        onChange={(e) =>
                          handlePropertyChange("sub_variant", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-border_main_default rounded-md text-text_main_high placeholder-text_main_disable bg-background_main_surface focus:border-background_prim_surface focus:ring-1 focus:ring-background_prim_card transition-colors"
                        placeholder="Any sub-variant value"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Styles Tab */}
              {activeTab === "styles" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Background Color
                      </label>
                      <SearchableSelect
                        options={colors}
                        value={molecule.styles.background_color || ""}
                        onChange={(value) =>
                          handleStyleChange("background_color", value)
                        }
                        isColor={true}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Border Color
                      </label>
                      <SearchableSelect
                        options={colors}
                        value={molecule.styles.border_color || ""}
                        onChange={(value) =>
                          handleStyleChange("border_color", value)
                        }
                        isColor={true}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Border Width
                      </label>
                      <input
                        type="number"
                        value={molecule.styles.border_width || ""}
                        onChange={(e) =>
                          handleStyleChange("border_width", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-border_main_default rounded-md text-text_main_high placeholder-text_main_disable bg-background_main_surface focus:border-background_prim_surface focus:ring-1 focus:ring-background_prim_card transition-colors"
                        placeholder="Border width in px"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Gap
                      </label>
                      <SearchableSelect
                        options={spacingOptions}
                        value={molecule.styles.gap || ""}
                        onChange={(value) => handleStyleChange("gap", value)}
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
                        value={molecule.styles.gradient || ""}
                        onChange={(value) =>
                          handleStyleChange("gradient", value)
                        }
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-background_main_card border border-border_main_default rounded-md mt-6">
                    <h3 className="text-sm font-medium text-text_main_high mb-3">
                      Border Radius
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        "top_left",
                        "top_right",
                        "bottom_left",
                        "bottom_right",
                      ].map((corner) => (
                        <div key={corner}>
                          <label className="block text-xs font-medium text-text_main_medium mb-1">
                            {corner
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </label>
                          <SearchableSelect
                            options={RADIUS_OPTIONS}
                            value={
                              molecule.styles.border_radius?.[corner] || ""
                            }
                            onChange={(value) =>
                              handleStyleChange("border_radius", value, corner)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-background_main_card border border-border_main_default rounded-md">
                    <h3 className="text-sm font-medium text-text_main_high mb-3">
                      Offset
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      {["top", "right", "bottom", "left"].map((direction) => (
                        <div key={direction}>
                          <label className="block text-xs font-medium text-text_main_medium mb-1">
                            {direction.charAt(0).toUpperCase() +
                              direction.slice(1)}
                          </label>
                          <input
                            type="number"
                            value={molecule.styles.offset?.[direction] || 0}
                            onChange={(e) =>
                              handleStyleChange(
                                "offset",
                                parseInt(e.target.value) || 0,
                                direction
                              )
                            }
                            className="w-full px-3 py-2 border border-border_main_default rounded-md text-text_main_high placeholder-text_main_disable bg-background_main_surface focus:border-background_prim_surface focus:ring-1 focus:ring-background_prim_card transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-background_main_card border border-border_main_default rounded-md">
                    <h3 className="text-sm font-medium text-text_main_high mb-3">
                      Padding
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      {["top", "right", "bottom", "left"].map((direction) => (
                        <div key={direction}>
                          <label className="block text-xs font-medium text-text_main_medium mb-1">
                            {direction.charAt(0).toUpperCase() +
                              direction.slice(1)}
                          </label>
                          <SearchableSelect
                            options={spacingOptions}
                            value={molecule.styles.padding?.[direction] || ""}
                            onChange={(value) =>
                              handleStyleChange("padding", value, direction)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Atoms Tab */}
              {activeTab === "atoms" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-text_main_high">
                      Atoms
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="px-3 py-2 text-sm bg-button_filled_style_2_surface_default text-button_filled_style_2_text_icon_default rounded-md hover:bg-button_filled_style_2_surface_hover"
                        onClick={() => {
                          // First show atom library
                          setShowAtomLibraryModal(true);
                        }}
                      >
                        Create & Add
                      </button>
                    </div>
                  </div>

                  {/* Suggested Atoms Section */}
                  {molecule.name && (
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <FiInfo className="text-text_main_medium mr-2" />
                        <h4 className="text-sm font-medium text-text_main_high">
                          Suggested Atoms for {molecule.name}
                        </h4>
                      </div>

                      <div className="bg-background_main_card p-4 rounded-md border border-border_main_default">
                        <div className="grid grid-cols-2 gap-3">
                          {getAtomOptionsForMolecule(molecule.name).map(
                            (atomOption) => {
                              // Check if this atom is already added
                              const isAdded = molecule.atoms.some(
                                (atom) =>
                                  atom.name === atomOption.value ||
                                  (atom.name &&
                                    atom.name.toLowerCase() ===
                                      atomOption.value.toLowerCase())
                              );

                              return (
                                <div
                                  key={atomOption.value}
                                  className={`p-3 rounded-md border ${
                                    isAdded
                                      ? "border-background_prim_surface bg-background_prim_surface bg-opacity-10"
                                      : "border-border_main_default hover:border-border_main_prim cursor-pointer"
                                  } transition-colors`}
                                  onClick={() => {
                                    if (!isAdded) {
                                      // Skip custom name modal and go directly to atom creation
                                      setSelectedAtomType(atomOption.type);
                                      setSelectedAtomName(atomOption.value);
                                      setCustomTranslationKey('');
                                      setShowAtomCreationModal(true);
                                      // Close current modal if open
                                      setShowCustomNameModal(false);
                                    }
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="flex items-center">
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background_main_surface text-text_main_high mr-2">
                                          {atomOption.type}
                                        </span>
                                        <span className="text-sm font-medium text-text_main_high">
                                          {atomOption.value}
                                        </span>
                                      </div>
                                      <p className="text-xs text-text_main_medium mt-1">
                                        {atomOption.description}
                                      </p>
                                    </div>

                                    {isAdded ? (
                                      <span className="text-xs px-2 py-1 rounded-full bg-background_prim_surface text-text_prim_high">
                                        Added
                                      </span>
                                    ) : (
                                      <div className="flex justify-end space-x-2">
                                        {/* Show "Create & Add" button only when no atom is selected */}
                                        {!selectedAtomId && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              // First show atom library modal instead of direct creation
                                              setShowAtomLibraryModal(true);
                                            }}
                                            className="text-xs px-2 py-1 bg-button_filled_style_2_surface_default text-button_filled_style_2_text_icon_default rounded hover:bg-button_filled_style_2_surface_hover"
                                          >
                                            Create & Add
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {Array.isArray(molecule.atoms) &&
                      molecule.atoms.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-6 bg-background_main_card border border-border_main_default rounded-md text-text_main_medium">
                          <svg
                            className="w-10 h-10 mb-2 text-text_main_low"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                          <p className="text-sm">No atoms added yet</p>
                          <p className="text-xs mt-1">
                            Click the "Add Atom" button to add atoms to this
                            molecule
                          </p>
                        </div>
                      )}

                    {Array.isArray(molecule.atoms) &&
                      molecule.atoms.map((atom, index) => {
                        const atomObj = getAtomById(atom);
                        const atomId = atomObj?.id || atom.id || atom;

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-background_main_surface border border-border_main_default rounded-lg hover:border-border_main_prim hover:shadow-sm transition-all"
                          >
                            <div className="flex items-center flex-1">
                              <span className="text-xs font-medium text-text_sec_high bg-background_sec_card px-2.5 py-1 rounded-full mr-3">
                                {atomObj?.atom_type || "Atom"}
                              </span>

                              {/* Custom Name (Display Name) */}
                              <div className="flex flex-col">
                                <div className="flex items-center">
                                  <input
                                    type="text"
                                    value={
                                      atom.name ||
                                      atomObj?.atom_type ||
                                      "Unknown Atom"
                                    }
                                    onChange={(e) =>
                                      handleAtomNameChange(
                                        index,
                                        e.target.value
                                      )
                                    }
                                    className="text-sm font-medium text-text_main_high bg-transparent border-b border-transparent hover:border-border_main_default focus:border-background_prim_surface focus:outline-none px-1 py-0.5"
                                    placeholder="Custom atom name"
                                  />
                                </div>

                                {/* Translation key field */}
                                <div className="flex items-center mt-2">
                                  <span className="text-xs text-text_main_medium mr-2">
                                    Translation Key:
                                  </span>
                                  <input
                                    type="text"
                                    value={atom.translation_key || ""}
                                    onChange={(e) => {
                                      const updatedAtoms = [...molecule.atoms];
                                      updatedAtoms[index] = {
                                        ...updatedAtoms[index],
                                        translation_key: e.target.value,
                                      };
                                      setMolecule((prev) => ({
                                        ...prev,
                                        atoms: updatedAtoms,
                                      }));
                                    }}
                                    className="text-xs text-text_main_medium bg-transparent border-b border-transparent hover:border-border_main_default focus:border-background_prim_surface focus:outline-none px-1 py-0.5 flex-1"
                                    placeholder="Enter translation key"
                                  />
                                </div>

                                {/* Original atom name for reference */}
                                <span className="text-xs text-text_main_low mt-2">
                                  Original: {atomObj?.atom_type || "Unknown"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <label className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  checked={atom.visibility !== false}
                                  onChange={(e) => {
                                    const updatedAtoms = [...molecule.atoms];
                                    updatedAtoms[index] = {
                                      ...updatedAtoms[index],
                                      visibility: e.target.checked,
                                    };
                                    setMolecule((prev) => ({
                                      ...prev,
                                      atoms: updatedAtoms,
                                    }));
                                  }}
                                  className="rounded border-border_main_default text-background_prim_surface focus:ring-background_prim_card"
                                />
                                <span className="ml-1.5 text-xs text-text_main_medium">
                                  Visible
                                </span>
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setMolecule((prev) => ({
                                    ...prev,
                                    atoms: prev.atoms.filter(
                                      (_, i) => i !== index
                                    ),
                                  }));
                                }}
                                className="p-1.5 rounded-full text-text_main_medium hover:text-text_main_prim hover:bg-background_main_card transition-colors"
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
                </div>
              )}
            </div>

            {/* Preview Column */}
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
                    Preview Structure
                  </h4>
                  <div className="bg-background_main_surface border border-border_main_default rounded-md p-4 overflow-auto max-h-[500px]">
                    <pre className="text-xs text-text_main_medium whitespace-pre-wrap">
                      {JSON.stringify(molecule, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-border_main_default flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setMolecule(emptyMolecule)}
              className="px-4 py-2 text-sm font-medium text-text_main_medium bg-background_main_surface border border-border_main_default rounded-md hover:bg-background_main_card transition-colors"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-button_filled_style_2_text_icon_default bg-button_filled_style_2_surface_default rounded-md hover:bg-button_filled_style_2_surface_hover transition-colors"
            >
              Save Molecule
            </button>
          </div>
        </form>
      </div>

      {/* Molecules Library Section */}
      <div className="bg-background_main_surface rounded-lg shadow-sm border border-border_main_default overflow-hidden">
        <div className="p-6 border-b border-border_main_default bg-background_main_container">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-text_main_high">
              Molecules Library
            </h3>
            <div className="flex items-center space-x-4">
              {/* Search Input with Icon */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-text_main_low" />
                </div>
                <input
                  type="text"
                  placeholder="Search molecules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-border_main_default bg-background_main_surface text-text_main_high placeholder-text_main_low focus:outline-none focus:ring-2 focus:ring-button_filled_style_3_surface_default focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Type Filter Tabs */}
          <div className="flex items-center flex-wrap gap-2 bg-background_main_surface p-2 rounded-lg">
            {MOLECULE_FILTERS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMoleculesFilter(id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                  ${
                    moleculesFilter === id
                      ? "bg-button_filled_style_3_surface_default text-button_filled_style_3_text_default shadow-sm"
                      : "text-text_main_medium hover:bg-background_main_hover hover:text-text_main_high"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {id !== "all" && moleculesByCategory[id] > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-background_main_container">
                    {moleculesByCategory[id]}
                  </span>
                )}
                {id === "all" && existingMolecules.length > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-background_main_container">
                    {existingMolecules.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-2 bg-background_main_default">
          {filteredMolecules.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-text_main_medium">
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
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
              <p className="text-base font-medium">No molecules found</p>
              <p className="text-sm mt-1">
                Create your first molecule using the form above
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {filteredMolecules.map((mol) => (
                <div
                  key={mol.id}
                  className="group bg-background_main_surface rounded-lg border border-border_main_default overflow-hidden hover:border-button_filled_style_3_surface_default hover:shadow-md transition-all"
                >
                  {/* Preview */}
                  <div className="p-3 min-h-[120px] bg-color_neu_500 group-hover:bg-background_main_hover transition-colors">
                    {renderMoleculePreview(mol)}
                  </div>

                  {/* Info */}
                  <div className="p-4 border-t border-border_main_default">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium text-text_main_high">
                            {mol.name}
                          </h4>
                          <p className="text-xs text-text_main_medium font-mono">
                            ID: {mol.id.substring(0, 12)}...
                          </p>
                          {mol.properties?.stack && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-background_main_card rounded">
                              Stack: {mol.properties.stack}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleEditMolecule(mol)}
                          className="p-2 text-text_main_medium hover:text-button_filled_style_3_text_default rounded-md hover:bg-button_filled_style_3_surface_default/10 transition-colors"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMolecule(mol.id)}
                          className="p-2 text-text_main_medium hover:text-button_ghost_style_3_text_hover rounded-md hover:bg-button_ghost_style_3_surface_hover transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Atom Selection Modal */}
      {showAtomModal && (
        <ComponentSelectionModal
          title="Add Atom"
          existingComponents={existingAtoms}
          onSelect={(atomId) => {
            handleSelectAtom(atomId);
            setShowAtomModal(false);
          }}
          onClose={() => setShowAtomModal(false)}
          componentType="atom"
          displayProperty="name"
          onCreateNew={
            <div>
              <h4 className="font-medium text-text_main_high mb-2">
                Create New Atom
              </h4>
              <AtomBuilder
                onAdd={handleCreateAtom}
                existingAtoms={existingAtoms}
                inline={true}
              />
            </div>
          }
        />
      )}

      {/* Custom Atom Name Modal */}
      {showCustomNameModal && (
        <div className="fixed inset-0 bg-[#000]/50 flex items-center justify-center z-50">
          <div className="bg-color_neu_00  p-8 rounded-lg shadow-xl max-w-md w-full">
            <h4 className="text-xl font-semibold mb-2 text-text_main_high">
              {selectedAtomId ? "Custom Atom Name" : "Create New Atom"}
            </h4>
            <p className="text-text_main_medium mb-4">
              {selectedAtomId
                ? "Provide a descriptive name for this atom in the context of this molecule."
                : "Create a new atom with this name for the current molecule."}
            </p>

            {/* Atom Information */}
            {selectedAtomId && (
              <div className="mb-4 p-3 bg-background_main_card rounded-md">
                <p className="text-sm text-text_main_medium">
                  <span className="font-medium">Original Atom:</span>{" "}
                  {existingAtoms.find((a) => a.id === selectedAtomId)?.atom_type ||
                    "Unknown"}
                </p>
                <p className="text-sm text-text_main_medium mt-1">
                  <span className="font-medium">Type:</span>{" "}
                  {existingAtoms.find((a) => a.id === selectedAtomId)
                    ?.atom_type || "Unknown"}
                </p>
              </div>
            )}

            {/* Suggested Atom Names */}
            {molecule.name && (
              <div className="mb-4">
                <h5 className="text-sm font-medium text-text_main_high mb-2">
                  {selectedAtomId
                    ? "Suggested Names for This Atom Type"
                    : "Suggested Atoms for This Molecule"}
                </h5>

                {(() => {
                  // Find all suggested atom names for this molecule
                  const moleculeStructure = getAtomStructureForMolecule(
                    molecule.name
                  );

                  if (moleculeStructure) {
                    let suggestedNames = [];

                    // If an atom is selected, filter by its type
                    if (selectedAtomId) {
                      const atomType = existingAtoms.find(
                        (a) => a.id === selectedAtomId
                      )?.atom_type;

                      if (atomType) {
                        suggestedNames = Object.entries(moleculeStructure)
                          .filter(([_, config]) => config.type === atomType)
                          .map(([name, config]) => ({
                            name,
                            description: config.description,
                            required: config.required,
                            type: config.type,
                          }));
                      }
                    }
                    // Otherwise show all suggested atoms
                    else {
                      suggestedNames = Object.entries(moleculeStructure).map(
                        ([name, config]) => ({
                          name,
                          description: config.description,
                          required: config.required,
                          type: config.type,
                        })
                      );
                    }

                    if (suggestedNames.length > 0) {
                      return (
                        <div className="grid grid-cols-1 gap-2 mb-4">
                          {suggestedNames.map((suggestion) => (
                            <div
                              key={suggestion.name}
                              className={`text-left p-2 rounded border ${
                                customAtomName === suggestion.name
                                  ? "bg-background_prim_surface bg-opacity-10 border-background_prim_surface"
                                  : "bg-background_main_card border-border_main_default"
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium text-text_main_high">
                                    {suggestion.name}
                                  </span>
                                  {suggestion.required && (
                                    <span className="ml-2 text-xs px-2 py-0.5 bg-background_sec_surface text-text_sec_high rounded-full">
                                      Required
                                    </span>
                                  )}
                                </div>

                                {/* Actions for this suggested atom */}
                                <div className="flex justify-end space-x-2">
                                  {/* Show "Create & Add" button only when no atom is selected */}
                                  {!selectedAtomId && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // First show atom library modal instead of direct creation
                                        setShowAtomLibraryModal(true);
                                      }}
                                      className="text-xs px-2 py-1 bg-button_filled_style_2_surface_default text-button_filled_style_2_text_icon_default rounded hover:bg-button_filled_style_2_surface_hover"
                                    >
                                      Create & Add
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-text_main_medium mt-1">
                                {suggestion.description}
                              </p>
                              <p className="text-xs text-text_main_medium mt-1">
                                <span className="font-medium">Type:</span>{" "}
                                {suggestion.type}
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    }
                  }

                  return (
                    <p className="text-xs text-text_main_medium bg-background_main_card p-3 rounded">
                      No suggested names found for{" "}
                      {selectedAtomId ? "this atom type in" : ""}{" "}
                      {molecule.name}
                    </p>
                  );
                })()}
              </div>
            )}

            {/* Show if current name is a suggested atom */}
            {molecule.name && customAtomName && (
              <div className="mb-4">
                {getAtomStructureForMolecule(molecule.name)?.[
                  customAtomName
                ] ? (
                  <div className="p-3 bg-background_prim_surface bg-opacity-10 rounded-md border border-background_prim_surface">
                    <div className="flex items-center">
                      <FiInfo className="text-background_prim_surface mr-2" />
                      <span className="text-sm font-medium text-text_main_high">
                        Suggested atom for {molecule.name}
                      </span>
                    </div>
                    <p className="text-xs text-text_main_medium mt-1">
                      {
                        getAtomStructureForMolecule(molecule.name)[
                          customAtomName
                        ].description
                      }
                    </p>
                    <p className="text-xs text-text_main_medium mt-1">
                      <span className="font-medium">Type:</span>{" "}
                      {
                        getAtomStructureForMolecule(molecule.name)[
                          customAtomName
                        ].type
                      }
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-background_main_card rounded-md border border-border_main_default">
                    <div className="flex items-center">
                      <FiInfo className="text-text_main_medium mr-2" />
                      <span className="text-sm font-medium text-text_main_high">
                        Custom atom name
                      </span>
                    </div>
                    <p className="text-xs text-text_main_medium mt-1">
                      This is not a standard atom name for this molecule type.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Hint about creating a new atom */}
            {!selectedAtomId && (
              <div className="mb-4 p-3 bg-background_prim_surface bg-opacity-10 rounded-md border border-background_prim_surface">
                <div className="flex items-center">
                  <FiInfo className="text-background_prim_surface mr-2" />
                  <span className="text-sm font-medium text-text_main_high">
                    Creating a new atom
                  </span>
                </div>
                <p className="text-xs text-text_main_medium mt-1">
                  You are creating a new atom with the name "{customAtomName}".
                  This atom will be added to your atoms library and used in this
                  molecule.
                </p>
                {molecule.name &&
                  customAtomName &&
                  getAtomStructureForMolecule(molecule.name)?.[
                    customAtomName
                  ] && (
                    <p className="text-xs text-text_main_medium mt-2">
                      <strong>Type:</strong>{" "}
                      {
                        getAtomStructureForMolecule(molecule.name)[
                          customAtomName
                        ].type
                      }
                      <br />
                      {
                        getAtomStructureForMolecule(molecule.name)[
                          customAtomName
                        ].description
                      }
                    </p>
                  )}
              </div>
            )}

            <label className="block text-sm font-medium text-text_main_high mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={customAtomName}
              onChange={(e) => setCustomAtomName(e.target.value)}
              className="w-full px-3 py-2 border border-border_main_default rounded-md text-text_main_high placeholder-text_main_disable bg-background_main_surface focus:border-background_prim_surface focus:ring-1 focus:ring-background_prim_card transition-colors"
              placeholder="Enter a descriptive name for this atom"
              autoFocus
            />

            <label className="block text-sm font-medium text-text_main_high mb-1 mt-4">
              Translation Key
            </label>
            <input
              type="text"
              value={customTranslationKey}
              onChange={(e) => setCustomTranslationKey(e.target.value)}
              className="w-full px-3 py-2 border border-border_main_default rounded-md text-text_main_high placeholder-text_main_disable bg-background_main_surface focus:border-background_prim_surface focus:ring-1 focus:ring-background_prim_card transition-colors"
              placeholder="Optional translation key for i18n"
            />

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCustomNameModal(false)}
                className="px-4 py-2 text-sm font-medium text-text_main_medium bg-background_main_surface border border-border_main_default rounded-md hover:bg-background_main_card transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCustomNameSubmit}
                disabled={selectedAtomId && !customAtomName.trim()}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  selectedAtomId
                    ? customAtomName.trim()
                      ? "text-button_filled_style_2_text_icon_default bg-button_filled_style_2_surface_default hover:bg-button_filled_style_2_surface_hover"
                      : "text-text_main_disable bg-background_main_card cursor-not-allowed"
                    : "text-button_filled_style_2_text_icon_default bg-button_filled_style_2_surface_default hover:bg-button_filled_style_2_surface_hover"
                }`}
              >
                {selectedAtomId ? "Add to Molecule" : "Create & Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Atom Creation Modal */}
      {showAtomCreationModal && (
        <div className="fixed inset-0 bg-[#000]/50 flex items-center justify-center z-50">
          <div className="bg-color_neu_00 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto flex flex-col">
            <div className="border-b border-border_main_default bg-background_main_card px-6 py-3 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text_main_high">
                Create New Atom
              </h3>
              <button
                type="button"
                onClick={() => setShowAtomCreationModal(false)}
                className="text-text_main_medium hover:text-text_main_high"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
            
            <div className="p-6">
              {/* AtomForm */}
              <AtomForm
                initialData={{
                  id: generateUniqueId('atom'),
                  atom_type: selectedAtomType || "button", // Default to button if not specified
                }}
                disableTypeSelection={selectedAtomType ? true : false}
                onSubmit={(atomData) => {
                  // Prevent default form submission
                  event && event.preventDefault && event.preventDefault();
                  
                  try {
                    // Generate a sensible display name if not provided
                    const displayName = selectedAtomName.trim() || 
                      `${atomData.atom_type}_${molecule.atoms.length + 1}`;
                    
                    // Add to global atoms collection
                    handleAddComponent("atom", atomData, false);
                    
                    // Add to the molecule with the generated display name
                    handleAddAtom(atomData.id, displayName, customTranslationKey);
                    
                    // Close the modal
                    setShowAtomCreationModal(false);
                    setSelectedAtomType(null);
                    setSelectedAtomName('');
                    setCustomTranslationKey('');
                    
                    toast.success(`Atom created and added as "${displayName}"`);
                  } catch (error) {
                    console.error("Error creating atom:", error);
                    toast.error("Failed to create atom");
                  }
                  
                  return false;
                }}
                onCancel={() => {
                  setShowAtomCreationModal(false);
                  setSelectedAtomType(null);
                  setSelectedAtomName('');
                  setCustomTranslationKey('');
                }}
                mode="create"
                inline={true}
              />
              
              {/* Display Name for Molecule - Bottom Section (Optional) */}
              <div className="mt-6 border-t border-border_main_default pt-6">
                <div>
                  <label className="block text-sm font-medium text-text_main_high mb-1">
                    Display Name in Molecule (Optional)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={selectedAtomName}
                      onChange={(e) => setSelectedAtomName(e.target.value)}
                      className="flex-grow px-3 py-2 border border-border_main_default rounded-md text-text_main_high placeholder-text_main_disable bg-background_main_surface focus:border-background_prim_surface focus:ring-1 focus:ring-background_prim_card transition-colors"
                      placeholder="Enter a custom name or leave blank for auto-naming"
                    />
                  </div>
                  <p className="text-xs text-text_main_medium mt-1">
                    This is how the atom will be identified in the molecule (a name will be auto-generated if left blank)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Atom Library Modal */}
      {showAtomLibraryModal && (
        <div className="fixed inset-0 bg-[#000]/50 flex items-center justify-center z-50">
          <div className="bg-color_neu_00 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="border-b border-border_main_default bg-background_main_card px-6 py-3 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-text_main_high">
                Select Atom from Library
              </h3>
              <button
                type="button"
                onClick={() => setShowAtomLibraryModal(false)}
                className="text-text_main_medium hover:text-text_main_high"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
            
            <div className="p-6 flex-grow overflow-y-auto">
              {/* Filter Controls */}
              <div className="mb-6 flex items-center space-x-4">
                <div className="w-64">
                  <label className="block text-sm font-medium text-text_main_high mb-1">
                    Filter by Type
                  </label>
                  <SearchableSelect
                    options={[
                      { value: "", label: "All Types" },
                      ...ATOM_TYPE_OPTIONS.map(type => ({ value: type.value, label: type.label }))
                    ]}
                    onChange={(value) => {
                      // Filter atoms by type logic would go here
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-text_main_high mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search atoms..."
                    className="w-full px-3 py-2 border border-border_main_default rounded-md"
                  />
                </div>
              </div>
              
              {/* Group atoms by type */}
              {(() => {
                // Group atoms by type
                const groupedAtoms = existingAtoms.reduce((acc, atom) => {
                  const type = atom.atom_type || 'other';
                  if (!acc[type]) acc[type] = [];
                  acc[type].push(atom);
                  return acc;
                }, {});
                
                return Object.entries(groupedAtoms).map(([type, atoms]) => (
                  <div key={type} className="mb-8">
                    <h4 className="text-md font-medium text-text_main_high mb-4 capitalize border-b border-border_main_default pb-2">
                      {type} Atoms ({atoms.length})
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {atoms.map((atom) => {
                        // Determine preview content based on atom type
                        let previewContent;
                        
                        switch(atom.atom_type) {
                          case 'button':
                            previewContent = (
                              <div 
                                className={`py-2 px-3 text-sm inline-flex items-center justify-center rounded ${
                                  atom.background_color 
                                    ? `bg-${atom.background_color} text-${atom.text_color || 'white'}`
                                    : 'bg-button_filled_style_1_surface_default text-button_filled_style_1_text_icon_default'
                                }`}
                              >
                                Button
                              </div>
                            );
                            break;
                            
                          case 'badge':
                            previewContent = (
                              <div 
                                className={`py-1 px-2 text-xs inline-flex items-center justify-center rounded-full ${
                                  atom.background_color 
                                    ? `bg-${atom.background_color} text-${atom.text_color || 'white'}`
                                    : 'bg-button_filled_style_3_surface_default text-button_filled_style_3_text_default'
                                }`}
                              >
                                Badge
                              </div>
                            );
                            break;
                            
                          case 'text':
                            previewContent = (
                              <div className={`text-${atom.text_color || 'text_main_high'} ${atom.typography || 'text-sm'}`}>
                                Text Sample
                              </div>
                            );
                            break;
                            
                          default:
                            previewContent = (
                              <div className="text-xs text-text_main_medium">
                                {atom.atom_type} Preview
                              </div>
                            );
                        }
                        
                        return (
                          <div 
                            key={atom.id}
                            className="border border-border_main_default rounded-lg p-4 hover:border-background_prim_surface cursor-pointer transition-colors"
                            onClick={() => {
                              // When atom is selected
                              setSelectedAtomId(atom.id);
                              
                              // Generate a sensible display name
                              let displayName = atom.atom_type;
                              
                              // Try to find a suggested name based on the atom type
                              if (molecule.name) {
                                const moleculeStructure = getAtomStructureForMolecule(molecule.name);
                                if (moleculeStructure) {
                                  const suggestedNames = Object.entries(moleculeStructure)
                                    .filter(([_, config]) => config.type === atom.atom_type)
                                    .map(([name]) => name);
                                    
                                  if (suggestedNames.length > 0) {
                                    displayName = suggestedNames[0];
                                  }
                                }
                              }
                              
                              // Set the default name
                              setCustomAtomName(displayName);
                              
                              // Close current modal and show the custom name modal
                              setShowAtomLibraryModal(false);
                              setShowCustomNameModal(true);
                            }}
                          >
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-text_main_high mb-2">
                                {atom.atom_type}
                              </div>
                              
                              {/* Properties */}
                              <div className="text-xs text-text_main_medium mb-3 space-y-1">
                                {atom.background_color && (
                                  <div>Background: {atom.background_color}</div>
                                )}
                                {atom.text_color && (
                                  <div>Text color: {atom.text_color}</div>
                                )}
                                {atom.typography && (
                                  <div>Typography: {atom.typography}</div>
                                )}
                              </div>
                              
                              {/* Preview */}
                              <div className="mt-2 p-3 border border-dashed border-border_main_default rounded flex items-center justify-center bg-background_main_card">
                                {previewContent}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ));
              })()}
              
              {/* Create New Atom button */}
              <div className="mt-8 flex justify-center">
                <button 
                  className="flex items-center px-4 py-2 border-2 border-dashed border-border_main_default rounded-md hover:border-background_prim_surface text-text_main_high hover:text-background_prim_surface transition-colors"
                  onClick={() => {
                    setShowAtomLibraryModal(false);
                    setSelectedAtomId(null);
                    setSelectedAtomType(null);
                    setSelectedAtomName("");
                    setCustomTranslationKey("");
                    setShowAtomCreationModal(true);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Create New Atom
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoleculeBuilder;
