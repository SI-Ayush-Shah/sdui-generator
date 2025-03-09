import React, { useState, useEffect, useCallback } from "react";
import {
  emptyTemplate,
  emptyOrganism,
  emptyMolecule,
  emptyAtom,
} from "../constants/emptyStructures";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/storage";
import { generateUUID } from "../utils/uuid";
import AtomBuilder from "./builders/AtomBuilder";
import MoleculeBuilder from "./builders/MoleculeBuilder";
import OrganismBuilder from "./builders/OrganismBuilder";
import TemplateBuilder from "./builders/TemplateBuilder";
import SchemaViewer from "./SchemaViewer";
import { TokenProvider } from "../contexts/TokenContext";
import json from "../sdui-schema.json";
import PageBuilder from "./builders/PageBuilder";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Text, Badge, Img } from "@sikit/ui";
import {
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiGrid,
  FiMousePointer,
  FiType,
  FiTag,
  FiImage,
} from "react-icons/fi";
import EditAtomModal from "./modals/EditAtomModal";
import { updateSduiSchema } from "../utils/fileOperations";
import { toast } from "react-hot-toast";
import {
  getTempComponents,
  addTempComponent,
  updateTempComponent,
  deleteTempComponent,
  hasPendingChanges,
  setPendingChanges,
  clearAllTempData
} from "../utils/localStorageManager";
import { componentMap } from "../molecules-mapper/molecules-map.jsx";
import { processAtoms, processMolecule } from "../utils/compile.js";
import { PendingChangesProvider } from "../contexts/PendingChangesContext";

const NAVIGATION_ITEMS = [
  { id: "pages", label: "Pages", icon: "document" },
  { id: "templates", label: "Templates", icon: "template" },
  { id: "organisms", label: "Organisms", icon: "puzzle" },
  { id: "molecules", label: "Molecules", icon: "cube" },
  { id: "atoms", label: "Atoms", icon: "atom" },
];

const ATOM_FILTERS = [
  { id: "all", label: "All Atoms", icon: FiGrid },
  { id: "button", label: "Buttons", icon: FiMousePointer },
  { id: "text", label: "Text", icon: FiType },
  { id: "badge", label: "Badges", icon: FiTag },
  { id: "image", label: "Images", icon: FiImage },
];

const JsonBuilder = ({ defaultSection = "pages" }) => {
  const navigate = useNavigate();
  const { pageId, templateId, organismId, moleculeId, atomId } = useParams();
  const [mode, setMode] = useState("edit");
  const [atomsFilter, setAtomsFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasPendingChangesState, setHasPendingChangesState] = useState(false);

  const [jsonData, setJsonData] = useState({
    data: {
      components: {
        template: [],
        organism: json.data.components.organism || [],
        molecule: json.data.components.molecule || [],
        atom: json.data.components.atom || [],
      },
      tokens: json.data.tokens,
      version: 1.01,
    },
    meta: {
      status: 200,
      timestamp: new Date().toISOString(),
    },
    pages: json.pages || [],
  });

  const [selectedPage, setSelectedPage] = useState(null);
  const [editingAtom, setEditingAtom] = useState(null);

  useEffect(() => {
    if (!defaultSection) {
      const savedData = loadFromLocalStorage("sdui-schema");
      if (savedData) {
        setJsonData(savedData);
      }
    }
  }, [defaultSection]);

  useEffect(() => {
    saveToLocalStorage("sdui-schema", jsonData);
  }, [jsonData]);

  useEffect(() => {
    // Load specific item based on ID if provided
    if (pageId) {
      const page = jsonData.pages?.find((p) => p.id === pageId);
      if (page) setSelectedPage(page);
    }
    // Similar for other types...
  }, [pageId, templateId, organismId, moleculeId, atomId]);

  // Combine schema data with temporary data from localStorage
  useEffect(() => {
    // On component mount, check localStorage for temporary components
    const tempAtoms = getTempComponents('ATOMS');
    const tempMolecules = getTempComponents('MOLECULES');
    const tempOrganisms = getTempComponents('ORGANISMS');
    const tempTemplates = getTempComponents('TEMPLATES');
    
    // Update the state with temporary components if they exist
    if (tempAtoms.length || tempMolecules.length || tempOrganisms.length || tempTemplates.length) {
      setJsonData(prevData => ({
        ...prevData,
        data: {
          ...prevData.data,
          components: {
            ...prevData.data.components,
            atom: mergeComponents(prevData.data.components.atom, tempAtoms),
            molecule: mergeComponents(prevData.data.components.molecule, tempMolecules),
            organism: mergeComponents(prevData.data.components.organism, tempOrganisms),
            template: mergeComponents(prevData.data.components.template, tempTemplates),
          }
        }
      }));
      
      // Check if there are pending changes
      setHasPendingChangesState(hasPendingChanges());
    }
  }, []);
  
  // Helper function to merge permanent components with temporary ones
  const mergeComponents = (permanentComponents, tempComponents) => {
    if (!tempComponents || tempComponents.length === 0) return permanentComponents;
    
    // Create a new array with all permanent components
    const merged = [...permanentComponents];
    
    // For each temporary component
    tempComponents.forEach(tempComponent => {
      // Check if it already exists in the permanent array
      const existingIndex = merged.findIndex(comp => comp.id === tempComponent.id);
      
      if (existingIndex >= 0) {
        // Replace the existing component
        merged[existingIndex] = tempComponent;
      } else {
        // Add as a new component
        merged.push(tempComponent);
      }
    });
    
    return merged;
  };

  // Apply all pending changes to the actual schema
  const applyChanges = async () => {
    try {
      // Get all temporary components
      const tempAtoms = getTempComponents('ATOMS');
      const tempMolecules = getTempComponents('MOLECULES');
      const tempOrganisms = getTempComponents('ORGANISMS');
      const tempTemplates = getTempComponents('TEMPLATES');
      
      // Create a new schema with all changes
      const updatedSchema = {
        ...jsonData,
        data: {
          ...jsonData.data,
          components: {
            ...jsonData.data.components,
            atom: mergeComponents(jsonData.data.components.atom || [], tempAtoms),
            molecule: mergeComponents(jsonData.data.components.molecule || [], tempMolecules),
            organism: mergeComponents(jsonData.data.components.organism || [], tempOrganisms),
            template: mergeComponents(jsonData.data.components.template || [], tempTemplates),
          }
        }
      };
      
      // Log the data being sent to ensure it's valid
      console.log('Applying schema update:', updatedSchema);
      
      // Update the schema file
      await updateSduiSchema(updatedSchema, true);
      
      // Clear all temporary data
      clearAllTempData();
      
      // Reset pending changes state
      setHasPendingChangesState(false);
      
      // Update the local state with the new schema to keep UI in sync
      setJsonData(updatedSchema);
      
      toast.success("All changes applied successfully");
    } catch (error) {
      console.error("Error applying changes:", error);
      toast.error(`Failed to apply changes: ${error.message}`);
    }
  };
  
  // Discard all pending changes
  const discardChanges = () => {
    // Clear all temporary data
    clearAllTempData();
    
    // Reset pending changes state
    setHasPendingChangesState(false);
    
    // Reset the state to the original data from the schema
    setJsonData({
      data: {
        components: {
          template: [],
          organism: json.data.components.organism || [],
          molecule: json.data.components.molecule || [],
          atom: json.data.components.atom || [],
        },
        tokens: json.data.tokens,
        version: 1.01,
      },
      meta: {
        status: 200,
        timestamp: new Date().toISOString(),
      },
      pages: json.pages || [],
    });
    
    toast.success("All pending changes discarded");
    
    // Reload the page to ensure everything is fresh
    window.location.reload();
  };

  const handleAddComponent = async (type, component, shouldRefresh = true) => {
    try {
      // Check if a component with this ID already exists in both current state and localStorage
      if (type === "atom") {
        // Get existing atoms from state
        const existingStateAtoms = jsonData.data.components.atom || [];
        
        // Get existing atoms from localStorage
        const existingTempAtoms = getTempComponents('ATOMS');
        
        // Check if the atom ID exists in either place
        const atomExists = [...existingStateAtoms, ...existingTempAtoms].some(
          (a) => a.id === component.id
        );
        
        if (atomExists) {
          toast.error("An atom with this ID already exists");
          return;
        }
      }

      // Remove data property from molecules to prevent dummy data storage
      let componentToAdd = component;
      if (type === "molecule" && component.data) {
        const { data, ...componentWithoutData } = component;
        componentToAdd = componentWithoutData;
      }

      // Update local state first
      const updatedData = {
        ...jsonData,
        data: {
          ...jsonData.data,
          components: {
            ...jsonData.data.components,
            [type]: [...(jsonData.data.components[type] || []), componentToAdd],
          },
        },
      };

      // Update the local state immediately
      setJsonData(updatedData);

      // Add to localStorage instead of updating the schema
      addTempComponent(type.toUpperCase(), componentToAdd);
      
      // Update the pending changes state
      updatePendingChangesState();
      
      // Only show toast if shouldRefresh is true
      if (shouldRefresh) {
        toast.success("Component added successfully");
      }
    } catch (error) {
      if (shouldRefresh) {
        toast.error("Failed to add component");
      }
      console.error("Error adding component:", error);
    }
  };

  const handleUpdateComponent = (type, index, component) => {
    // Remove data property from molecules to prevent dummy data storage
    let componentToUpdate = component;
    if (type === "molecule" && component.data) {
      const { data, ...componentWithoutData } = component;
      componentToUpdate = componentWithoutData;
    }

    // Update local state
    const updatedComponents = jsonData.data.components[type].map(
      (item, i) => (i === index ? componentToUpdate : item)
    );

    const updatedData = {
      ...jsonData,
      data: {
        ...jsonData.data,
        components: {
          ...jsonData.data.components,
          [type]: updatedComponents,
        },
      },
    };

    // Update local state
    setJsonData(updatedData);

    // Update in localStorage instead of updating the schema
    updateTempComponent(type.toUpperCase(), componentToUpdate.id, componentToUpdate);
    
    // Update the pending changes state
    updatePendingChangesState();
    
    toast.success("Component updated successfully");
  };

  const handleEdit = (type, item) => {
    if (type === "atom") {
      setEditingAtom(item);
    }
    // ... handle other types
  };

  const handleAddPage = (page) => {
    setJsonData((prev) => ({
      ...prev,
      pages: [...(prev.pages || []), page],
    }));
    navigate(`/pages/${page.id}`);
  };

  const handleUpdatePage = (index, page) => {
    setJsonData((prev) => ({
      ...prev,
      pages: prev.pages.map((item, i) => (i === index ? page : item)),
    }));
  };

  const handleUpdateAtom = async (updatedAtom) => {
    try {
      // Check if this atom already exists (excluding the one being updated)
      // Get existing atoms from both state and localStorage
      const existingStateAtoms = jsonData.data.components.atom || [];
      const existingTempAtoms = getTempComponents('ATOMS');
      
      // Check all atoms except the one being edited
      const duplicateExists = [...existingStateAtoms, ...existingTempAtoms].some(
        (a) => a.id === updatedAtom.id && a !== editingAtom
      );

      if (duplicateExists) {
        toast.error("An atom with this ID already exists");
        return;
      }

      // Update local state
      const newData = {
        ...jsonData,
        data: {
          ...jsonData.data,
          components: {
            ...jsonData.data.components,
            atom: jsonData.data.components.atom.map((a) =>
              a.id === updatedAtom.id ? updatedAtom : a
            ),
          },
        },
      };

      // Update the local state
      setJsonData(newData);
      
      // Update in localStorage instead of direct schema update
      updateTempComponent('ATOMS', updatedAtom.id, updatedAtom);
      
      // Update the pending changes state
      updatePendingChangesState();
      
      // Close the editing modal
      setEditingAtom(null);
      
      toast.success("Atom updated successfully");
    } catch (error) {
      console.error("Error updating atom:", error);
      toast.error("Failed to update atom");
    }
  };

  const renderMoleculePreview = (molecule) => {
    return (
      <div className="w-full h-full p-4 border border-border_main_default rounded-lg bg-background_main_container">
        <div className="flex flex-col gap-2">
          {/* Molecule Type */}
          <div className="text-xs font-medium text-text_main_high">
            Type: {molecule.name}
          </div>

          {/* Atoms Count */}
          <div className="text-xs text-text_main_medium">
            Contains: {molecule.atoms.length} atoms
          </div>

          {/* Style Preview */}
          {molecule.styles && (
            <div
              className="mt-2 p-2 rounded"
              style={{
                backgroundColor:
                  molecule.styles.background_color || "transparent",
                borderColor: molecule.styles.border_color || "transparent",
                borderWidth: molecule.styles.border_width
                  ? `${molecule.styles.border_width}px`
                  : "0",
                borderStyle: molecule.styles.border_width ? "solid" : "none",
                gap: molecule.styles.gap || "0",
                padding: molecule.styles.padding
                  ? `${molecule.styles.padding}px`
                  : "0",
              }}
            >
              <div className="text-xs text-text_main_medium">Style Preview</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAtomPreview = (atom) => {
    if (!atom || !atom.atom_type) return null;

    switch (atom.atom_type) {
      case "button":
        return <Button {...atom} text="Button Text" />;
      case "text":
        return <Text {...atom}>Sample Text</Text>;
      case "badge":
        return <Badge {...atom} text="Badge Text" />;
      case "image":
        return (
          <Img
            src={`https://stg-washington-freedom.sportz.io/static-assets/waf-images/3e/4d/f6/${
              atom.ratio?.split(":")[0] || "16"
            }-${atom.ratio?.split(":")[1] || "9"}/W62UAhQg2I.jpg?v=1.04&w=1920`}
            {...atom}
          />
        );
      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (defaultSection) {
      case "pages":
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <PageBuilder
                onAdd={handleAddPage}
                existingPages={jsonData.pages || []}
                existingTemplates={jsonData.data.components.template}
                onUpdate={handleUpdatePage}
                selectedPage={selectedPage}
              />
            </div>
          </div>
        );
      case "templates":
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <TemplateBuilder
                onAdd={(template) => handleAddComponent("template", template)}
                handleAddComponent={handleAddComponent}
                existingTemplates={jsonData.data.components.template || []}
                existingOrganisms={jsonData.data.components.organism || []}
                existingMolecules={jsonData.data.components.molecule || []}
                onUpdate={(index, template) =>
                  handleUpdateComponent("template", index, template)
                }
              />
            </div>
          </div>
        );
      case "organisms":
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <OrganismBuilder
                onAdd={(organism) => handleAddComponent("organism", organism)}  
                handleAddComponent={handleAddComponent}
                existingOrganisms={jsonData.data.components.organism || []}
                existingMolecules={jsonData.data.components.molecule || []}
                onUpdate={(index, organism) =>
                  handleUpdateComponent("organism", index, organism)
                }
              />
            </div>
          </div>
        );
      case "molecules":
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <MoleculeBuilder
                onAdd={(molecule) => handleAddComponent("molecule", molecule)}
                handleAddComponent={handleAddComponent}
                existingMolecules={jsonData.data.components.molecule || []}
                existingAtoms={jsonData.data.components.atom || []}
                onUpdate={(index, molecule) =>
                  handleUpdateComponent("molecule", index, molecule)
                }
              />
            </div>
          </div>
        );
      case "atoms":
        const filteredAtoms = jsonData.data.components.atom
          .sort((a, b) => {
            const order = ATOM_FILTERS.findIndex((f) => f.id === a.atom_type);
            return order - ATOM_FILTERS.findIndex((f) => f.id === b.atom_type);
          })
          .filter(
            (atom, index, self) =>
              index === self.findIndex((a) => a.id === atom.id)
          )
          .filter((atom) => {
            if (!atom) return false;

            const matchesType =
              atomsFilter === "all" || atom.atom_type === atomsFilter;
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
              (atom.name?.toLowerCase() || "").includes(searchLower) ||
              (atom.atom_type?.toLowerCase() || "").includes(searchLower) ||
              (atom.id?.toLowerCase() || "").includes(searchLower);

            return matchesType && matchesSearch;
          });

        return (
          <div className="flex flex-col h-full space-y-6">
            {/* Create Atom Section */}
            <div className="bg-background_main_surface rounded-lg shadow-sm border border-border_main_default">
              <AtomBuilder
                onAdd={(atom, shouldRefresh = true) => handleAddComponent("atom", atom, shouldRefresh)}
                existingAtoms={jsonData.data.components.atom || []}
                onUpdate={(index, atom) =>
                  handleUpdateComponent("atom", index, atom)
                }
                inline
              />
            </div>

            {/* Atoms List Section */}
            <div className="bg-background_main_surface rounded-lg shadow-sm border border-border_main_default">
              <div className="p-6 border-b border-border_main_default bg-background_main_container">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-text_main_high">
                    Atoms Library
                  </h3>
                  <div className="flex items-center space-x-4">
                    {/* Search Input with Icon */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-text_main_low" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search atoms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 pl-10 pr-4 py-2 rounded-lg border border-border_main_default bg-background_main_surface text-text_main_high placeholder-text_main_low focus:outline-none focus:ring-2 focus:ring-button_filled_style_3_surface_default focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Type Filter Tabs */}
                <div className="flex items-center space-x-2 bg-background_main_surface p-1 rounded-lg">
                  {ATOM_FILTERS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setAtomsFilter(id)}
                      className={`
                        flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                        ${
                          atomsFilter === id
                            ? "bg-button_filled_style_3_surface_default text-button_filled_style_3_text_default shadow-sm"
                            : "text-text_main_medium hover:bg-background_main_hover hover:text-text_main_high"
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                      {id !== "all" && (
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-background_main_container">
                          {
                            filteredAtoms.filter(
                              (atom) => atom.atom_type === id
                            ).length
                          }
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2 bg-background_main_default">
                <div className="grid grid-cols-4 gap-2">
                  {filteredAtoms.map((atom) => (
                    <div
                      key={atom.id}
                      className="group bg-background_main_surface rounded-lg border border-border_main_default overflow-hidden hover:border-button_filled_style_3_surface_default hover:shadow-md transition-all"
                    >
                      {/* Preview */}
                      <div className="p-2 flex items-center justify-center min-h-[120px] bg-color_neu_500 group-hover:bg-background_main_hover transition-colors">
                        {renderAtomPreview(atom)}
                      </div>

                      {/* Info */}
                      <div className="p-4 border-t border-border_main_default">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-button_filled_style_3_surface_default/10 text-button_filled_style_3_text_default rounded-full">
                              {atom.atom_type}
                            </span>
                            <div className="space-y-1">
                              <h4 className="text-sm font-medium text-text_main_high">
                                {atom.name}
                              </h4>
                              <p className="text-xs text-text_main_medium font-mono">
                                ID: {atom.id}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEdit("atom", atom)}
                              className="p-2 text-text_main_medium hover:text-button_filled_style_3_text_default rounded-md hover:bg-button_filled_style_3_surface_default/10 transition-colors"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setJsonData((prev) => ({
                                  ...prev,
                                  data: {
                                    ...prev.data,
                                    components: {
                                      ...prev.data.components,
                                      atom: prev.data.components.atom.filter(
                                        (a) => a.id !== atom.id
                                      ),
                                    },
                                  },
                                }));
                              }}
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
              </div>
            </div>
          </div>
        );
      // ... cases for other sections
    }
  };

  // Clean up all molecules in the schema by removing data properties
  const cleanupMoleculeData = async () => {
    try {
      // Make a deep copy of the current schema
      const updatedSchema = JSON.parse(JSON.stringify(jsonData));

      // Check if there are molecules with data properties
      let hasDataProperties = false;

      // Remove data properties from all molecules
      if (updatedSchema.data?.components?.molecule) {
        updatedSchema.data.components.molecule =
          updatedSchema.data.components.molecule.map((molecule) => {
            if (molecule.data) {
              hasDataProperties = true;
              const { data, ...moleculeWithoutData } = molecule;
              return moleculeWithoutData;
            }
            return molecule;
          });

        if (hasDataProperties) {
          // Save the updated schema
          await updateSduiSchema(updatedSchema);
          setJsonData(updatedSchema);
          toast.success("Removed data properties from all molecules");
        } else {
          toast.info("No molecules with data properties found");
        }
      }
    } catch (error) {
      console.error("Error cleaning up molecule data:", error);
      toast.error("Failed to clean up molecule data");
    }
  };

  // Define the section config based on the current section
  const activeSectionConfig = {
    title: NAVIGATION_ITEMS.find(
      (item) => item.id === defaultSection
    )?.title || "Components",
    actions: null,
  };

  // Check for pending changes on component mount
  useEffect(() => {
    const pendingStatus = hasPendingChanges();
    setHasPendingChangesState(pendingStatus);
  }, []);

  // Update the pending changes state whenever we add, update, or remove components
  const updatePendingChangesState = () => {
    const pendingStatus = hasPendingChanges();
    setHasPendingChangesState(pendingStatus);
  };

  return (
    <PendingChangesProvider applyChangesHandler={applyChanges} discardChangesHandler={discardChanges}>
      <div className="min-h-screen bg-background_main_surface">
        <nav className="bg-background_main_surface border-b border-border_main_default">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Left side - Utility buttons */}
              <div className="flex items-center space-x-4">
                {hasPendingChangesState && (
                  <div className="px-3 py-1 text-sm font-medium text-button_filled_style_1_text_icon_default bg-button_filled_style_1_surface_default rounded-full animate-pulse">
                    Unsaved Changes
                  </div>
                )}
                
                {defaultSection === "molecules" && (
                  <button
                    onClick={cleanupMoleculeData}
                    className="px-4 py-2 text-sm font-medium bg-background_main_container text-text_main_medium hover:bg-background_main_hover border border-border_main_default rounded-md"
                  >
                    Remove Data Properties
                  </button>
                )}
              </div>

              {/* Right side - Mode selector */}
              <div className="flex items-center space-x-4">
                {/* Apply Changes and Discard Changes buttons */}
                <div className="flex space-x-2 mr-4">
                  {hasPendingChangesState && (
                    <>
                      <button
                        onClick={discardChanges}
                        className="px-4 py-2 text-sm font-medium text-text_main_medium bg-background_main_container hover:bg-background_main_hover border border-border_main_default rounded-md"
                      >
                        Discard Changes
                      </button>
                      <button
                        onClick={applyChanges}
                        className="px-4 py-2 text-sm font-medium text-button_filled_style_2_text_icon_default bg-button_filled_style_2_surface_default rounded-md hover:bg-button_filled_style_2_surface_hover transition-colors"
                      >
                        Apply to Schema
                      </button>
                    </>
                  )}
                </div>
                
                <div className="flex rounded-md shadow-sm" role="group">
                  <button
                    onClick={() => setMode("edit")}
                    className={`px-4 py-2 text-sm font-medium ${
                      mode === "edit"
                        ? "bg-button_filled_style_3_surface_default text-button_filled_style_3_text_default"
                        : "bg-background_main_container text-text_main_medium hover:bg-background_main_hover"
                    } border border-border_main_default rounded-l-md`}
                  >
                    Edit Mode
                  </button>
                  <button
                    onClick={() => setMode("view")}
                    className={`px-4 py-2 text-sm font-medium ${
                      mode === "view"
                        ? "bg-button_filled_style_3_surface_default text-button_filled_style_3_text_default"
                        : "bg-background_main_container text-text_main_medium hover:bg-background_main_hover"
                    } border-t border-b border-r border-border_main_default rounded-r-md`}
                  >
                    View Mode
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="p-8">{renderContent()}</div>

        {editingAtom && (
          <EditAtomModal
            atom={editingAtom}
            onClose={() => setEditingAtom(null)}
            onSave={handleUpdateAtom}
          />
        )}
      </div>
    </PendingChangesProvider>
  );
};

export default JsonBuilder;
