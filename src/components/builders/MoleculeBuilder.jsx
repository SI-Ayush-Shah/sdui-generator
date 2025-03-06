import React, { useState, useEffect } from "react";
import { emptyMolecule } from "../../constants/emptyStructures";
import { generateUUID } from "../../utils/uuid";
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
} from "../../constants/atomOptions";
import {
  VARIANT_OPTIONS,
  SUB_VARIANT_OPTIONS,
  MOLECULE_NAMES,
  MOLECULE_DUMMY_DATA,
} from "../../constants/moleculeOptions";
import {
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiGrid,
  FiBox,
  FiLayers,
} from "react-icons/fi";
import { Button, Text, Badge, Img } from "@sikit/ui";
import { componentMap } from "../../molecules-mapper/molecules-map.jsx";
import { processAtoms, processMolecule } from "../../utils/compile.js";

// Test environment variables
const apiUrl = process.env.VITE_API_URL;
const appName = process.env.VITE_APP_NAME;
console.log("Environment Variables Test:", { apiUrl, appName });

const STACK_OPTIONS = [
  { value: "h", label: "Horizontal" },
  { value: "v", label: "Vertical" },
];

const MOLECULE_FILTERS = [
  { id: "all", label: "All Molecules", icon: FiGrid },
  { id: "card", label: "Cards", icon: FiBox },
  { id: "content", label: "Content", icon: FiLayers },
];

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
    const newMolecule = {
      ...molecule,
      id: molecule.id || generateUUID(),
    };
    onAdd(newMolecule);
    setMolecule(emptyMolecule);
  };

  const handleAddAtom = (atomId) => {
    setMolecule((prev) => ({
      ...prev,
      atoms: [...prev.atoms, atomId],
    }));
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

  const handleCreateAtom = (atom) => {
    handleAddComponent("atom", atom);
    handleAddAtom(atom.id);
    setShowAtomModal(false);
  };

  const handleEditMolecule = (moleculeToEdit) => {
    setMolecule(moleculeToEdit);
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

    // Filter by type if needed
    const matchesType =
      moleculesFilter === "all" ||
      (mol.molecule_type && mol.molecule_type === moleculesFilter);

    // Filter by search query
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (mol.name?.toLowerCase() || "").includes(searchLower) ||
      (mol.id?.toLowerCase() || "").includes(searchLower);

    return matchesType && matchesSearch;
  });

  // Render molecule preview
  const renderMoleculePreview = (mol) => {
    console.log("mol", mol);
    if (!mol) return null;

    // Get atoms from molecule
    const processedMolecule = processMolecule(mol, prossedExistingAtoms);
    // Apply molecule styles to container
    // Determine stack direction for molecule content

    // Check if molecule name exists in componentMap
    let Molecule = mol.name ? componentMap[mol.name] : null;

    // Only set data if molecule name exists in MOLECULE_DUMMY_DATA
    if (mol.name && MOLECULE_DUMMY_DATA[mol.name]) {
      mol.data = MOLECULE_DUMMY_DATA[mol.name];
    } else {
      mol.data = {}; // Default empty data
    }

    // console.log("mol.data", mol.data);
    // console.log("processedMolecule", processedMolecule);

    return (
      <div
        className={`p-3 border border-border_main_default rounded-md overflow-hidden`}
      >
        {Molecule ? (
          <Molecule {...processedMolecule} data={mol.data} />
        ) : (
          <div className="p-4 bg-background_main_card rounded border border-error_main_surface text-error_main_high">
            <p className="text-sm font-medium">Component Not Found</p>
            <p className="text-xs mt-1">
              No component found for molecule type: {mol.name || "undefined"}
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
                    <button
                      type="button"
                      onClick={() => setShowAtomModal(true)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-button_filled_style_2_text_icon_default bg-button_filled_style_2_surface_default rounded-md hover:bg-button_filled_style_2_surface_hover transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-1.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Atom
                    </button>
                  </div>

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
                        const atomObj =
                          typeof atom === "string"
                            ? existingAtoms.find((a) => a.id === atom)
                            : atom;
                        const atomId =
                          typeof atom === "string" ? atom : atom.id;

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-background_main_surface border border-border_main_default rounded-lg hover:border-border_main_prim hover:shadow-sm transition-all"
                          >
                            <div className="flex items-center">
                              <span className="text-xs font-medium text-text_sec_high bg-background_sec_card px-2.5 py-1 rounded-full mr-3">
                                {atomObj?.atom_type || "Atom"}
                              </span>
                              <span className="text-sm font-medium text-text_main_high">
                                {atomObj?.name ||
                                  (typeof atom === "object"
                                    ? atom.name
                                    : "Unknown Atom")}
                              </span>
                              {typeof atom === "object" &&
                                atom.translation_key && (
                                  <span className="ml-2 px-2 py-0.5 bg-background_main_card text-xs text-text_main_medium rounded">
                                    Key: {atom.translation_key}
                                  </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-3">
                              {typeof atom === "object" && (
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
                              )}
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
          <div className="flex items-center space-x-2 bg-background_main_surface p-1 rounded-lg">
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
                {id !== "all" &&
                  existingMolecules.filter((m) => m.molecule_type === id)
                    .length > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-background_main_container">
                      {
                        existingMolecules.filter((m) => m.molecule_type === id)
                          .length
                      }
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
                    {/* {JSON.stringify(mol)} */}
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
            handleAddAtom(atomId);
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
    </div>
  );
};

export default MoleculeBuilder;
