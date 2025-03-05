import React, { useState, useEffect } from "react";
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

const NAVIGATION_ITEMS = [
  { id: "pages", label: "Pages", icon: "document" },
  { id: "templates", label: "Templates", icon: "template" },
  { id: "organisms", label: "Organisms", icon: "puzzle" },
  { id: "molecules", label: "Molecules", icon: "cube" },
  { id: "atoms", label: "Atoms", icon: "atom" },
];

const JsonBuilder = ({ defaultSection = "pages" }) => {
  const navigate = useNavigate();
  const { pageId, templateId, organismId, moleculeId, atomId } = useParams();
  const [mode, setMode] = useState("edit");
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
      request_id: crypto.randomUUID(),
      execution_time_ms: 0,
      app_version: "1.0.0",
    },
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

  const handleAddComponent = async (type, component) => {
    try {
      // Check if an atom with this ID already exists
      if (
        type === "atom" &&
        jsonData.data.components.atom.some((a) => a.id === component.id)
      ) {
        toast.error("An atom with this ID already exists");
        return;
      }

      const newData = {
        ...jsonData,
        data: {
          ...jsonData.data,
          components: {
            ...jsonData.data.components,
            [type]: [...(jsonData.data.components[type] || []), component],
          },
        },
      };

      await updateSduiSchema(newData);
      setJsonData(newData);
      toast.success("Component added successfully");
    } catch (error) {
      toast.error("Failed to add component");
    }
  };

  const handleUpdateComponent = (type, index, component) => {
    setJsonData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        components: {
          ...prev.data.components,
          [type]: prev.data.components[type].map((item, i) =>
            i === index ? component : item
          ),
        },
      },
    }));
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
      const duplicateExists = jsonData.data.components.atom.some(
        (a) => a.id === updatedAtom.id && a !== editingAtom
      );

      if (duplicateExists) {
        toast.error("An atom with this ID already exists");
        return;
      }

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

      await updateSduiSchema(newData);
      setJsonData(newData);
      toast.success("Atom updated successfully");
    } catch (error) {
      toast.error("Failed to update atom");
    }
  };

  const renderContent = () => {
    switch (defaultSection) {
      case "pages":
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <PageBuilder
                onAdd={handleAddPage}
                existingPages={jsonData.pages || []}
                existingTemplates={jsonData.data.components.template}
                onUpdate={handleUpdatePage}
                selectedPage={selectedPage}
              />
            </div>
            <div className="col-span-4">
              <div className="bg-background_main_surface rounded-lg shadow-sm border border-border_main_default">
                <div className="p-4 border-b border-border_main_default bg-background_main_container">
                  <h3 className="text-lg font-medium text-text_main_high">
                    Pages List
                  </h3>
                </div>
                <div className="p-4 bg-background_main_default">
                  <div className="space-y-2">
                    {jsonData.pages?.map((page, index) => (
                      <div
                        key={page.id}
                        className="flex items-center justify-between p-3 bg-background_main_surface rounded-lg"
                      >
                        <div>
                          <span className="text-sm font-medium text-text_main_high">
                            {page.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit("pages", page)}
                            className="text-sm text-button_filled_style_3_text_default bg-button_filled_style_3_surface_default px-3 py-1 rounded-md hover:bg-button_filled_style_3_surface_hover"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setJsonData((prev) => ({
                                ...prev,
                                pages: prev.pages.filter(
                                  (p) => p.id !== page.id
                                ),
                              }));
                            }}
                            className="text-sm text-button_ghost_style_3_text_default hover:text-button_ghost_style_3_text_hover px-3 py-1 rounded-md border border-border_main_default hover:bg-button_ghost_style_3_surface_hover"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "templates":
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
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
            <div className="col-span-4">
              <div className="bg-background_main_surface rounded-lg shadow-sm border border-border_main_default">
                <div className="p-4 border-b border-border_main_default bg-background_main_container">
                  <h3 className="text-lg font-medium text-text_main_high">
                    Templates List
                  </h3>
                </div>
                <div className="p-4 bg-background_main_default">
                  <div className="space-y-2">
                    {jsonData.data.components.template.map(
                      (template, index) => (
                        <div
                          key={template.id}
                          className="flex items-center justify-between p-3 bg-background_main_surface rounded-lg"
                        >
                          <div>
                            <span className="text-sm font-medium text-text_main_high">
                              {template.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit("template", template)}
                              className="text-sm text-button_filled_style_3_text_default bg-button_filled_style_3_surface_default px-3 py-1 rounded-md hover:bg-button_filled_style_3_surface_hover"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setJsonData((prev) => ({
                                  ...prev,
                                  data: {
                                    ...prev.data,
                                    components: {
                                      ...prev.data.components,
                                      template:
                                        prev.data.components.template.filter(
                                          (t) => t.id !== template.id
                                        ),
                                    },
                                  },
                                }));
                              }}
                              className="text-sm text-button_ghost_style_3_text_default hover:text-button_ghost_style_3_text_hover px-3 py-1 rounded-md border border-border_main_default hover:bg-button_ghost_style_3_surface_hover"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "molecules":
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
                      borderColor:
                        molecule.styles.border_color || "transparent",
                      borderWidth: molecule.styles.border_width
                        ? `${molecule.styles.border_width}px`
                        : "0",
                      borderStyle: molecule.styles.border_width
                        ? "solid"
                        : "none",
                      gap: molecule.styles.gap || "0",
                      padding: molecule.styles.padding
                        ? `${molecule.styles.padding}px`
                        : "0",
                    }}
                  >
                    <div className="text-xs text-text_main_medium">
                      Style Preview
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        };

        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
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
            <div className="col-span-4">
              <div className="bg-background_main_surface rounded-lg shadow-sm border border-border_main_default">
                <div className="p-4 border-b border-border_main_default bg-background_main_container">
                  <h3 className="text-lg font-medium text-text_main_high">
                    Molecules List
                  </h3>
                </div>
                <div className="p-4 bg-background_main_default">
                  <div className="grid gap-4">
                    {jsonData.data.components.molecule.map((molecule) => (
                      <div
                        key={molecule.id}
                        className="bg-background_main_surface rounded-lg border border-border_main_default overflow-hidden"
                      >
                        {/* Header with Type and ID */}
                        <div className="p-4 border-b border-border_main_default bg-background_main_container">
                          <div className="flex justify-between items-center">
                            <div className="space-y-1">
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-button_filled_style_3_surface_default text-button_filled_style_3_text_default rounded">
                                {molecule.name}
                              </span>
                              <div className="text-xs text-text_main_medium">
                                ID: {molecule.id}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit("molecule", molecule)}
                                className="text-sm text-button_filled_style_3_text_default bg-button_filled_style_3_surface_default px-3 py-1 rounded-md hover:bg-button_filled_style_3_surface_hover border border-border_main_default"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setJsonData((prev) => ({
                                    ...prev,
                                    data: {
                                      ...prev.data,
                                      components: {
                                        ...prev.data.components,
                                        molecule:
                                          prev.data.components.molecule.filter(
                                            (m) => m.id !== molecule.id
                                          ),
                                      },
                                    },
                                  }));
                                }}
                                className="text-sm text-button_ghost_style_3_text_default hover:text-button_ghost_style_3_text_hover px-3 py-1 rounded-md border border-border_main_default hover:bg-button_ghost_style_3_surface_hover"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Preview */}
                        <div className="p-4 bg-background_main_surface">
                          <div className="flex items-center justify-center min-h-[60px] bg-background_main_container rounded p-4">
                            {renderMoleculePreview(molecule)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "atoms":
        const [atomsFilter, setAtomsFilter] = useState("all");
        const [searchQuery, setSearchQuery] = useState("");

        const ATOM_FILTERS = [
          { id: "all", label: "All Atoms", icon: FiGrid },
          { id: "button", label: "Buttons", icon: FiMousePointer },
          { id: "text", label: "Text", icon: FiType },
          { id: "badge", label: "Badges", icon: FiTag },
          { id: "image", label: "Images", icon: FiImage },
        ];

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
                  }-${
                    atom.ratio?.split(":")[1] || "9"
                  }/W62UAhQg2I.jpg?v=1.04&w=1920`}
                  {...atom}
                />
              );
            default:
              return null;
          }
        };

        return (
          <div className="flex flex-col h-full space-y-6">
            {/* Create Atom Section */}
            <div className="bg-background_main_surface rounded-lg shadow-sm border border-border_main_default">
              <AtomBuilder
                onAdd={(atom) => handleAddComponent("atom", atom)}
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
                      <div className="p-2 flex items-center justify-center min-h-[120px] bg-background_main_container group-hover:bg-background_main_hover transition-colors">
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

  return (
    <TokenProvider tokens={jsonData.data.tokens}>
      <div className="min-h-screen bg-background_main_surface">
        <nav className="bg-background_main_surface border-b border-border_main_default">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end h-16 items-center">
              <div className="flex items-center space-x-4">
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
                <button className="bg-button_filled_style_3_surface_default text-button_filled_style_3_text_default px-4 py-2 rounded-md hover:bg-button_filled_style_3_surface_hover">
                  Import JSON
                </button>
                <button className="bg-button_filled_style_3_surface_default text-button_filled_style_3_text_default px-4 py-2 rounded-md hover:bg-button_filled_style_3_surface_hover">
                  Export JSON
                </button>
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
    </TokenProvider>
  );
};

export default JsonBuilder;
