import React, { useState } from "react";
import { emptyOrganism } from "../../constants/emptyStructures";
import { generateUUID } from "../../utils/uuid";
import TokenSelect from "../common/TokenSelect";
import ComponentSelectionModal from "../common/ComponentSelectionModal";
import MoleculeBuilder from "./MoleculeBuilder";

const POSITION_TYPES = [
  { value: "top_left", label: "Top Left" },
  { value: "top_center", label: "Top Center" },
  { value: "top_right", label: "Top Right" },
  { value: "middle_left", label: "Middle Left" },
  { value: "middle_center", label: "Middle Center" },
  { value: "middle_right", label: "Middle Right" },
  { value: "bottom_left", label: "Bottom Left" },
  { value: "bottom_center", label: "Bottom Center" },
  { value: "bottom_right", label: "Bottom Right" },
];

const OrganismBuilder = ({
  onAdd,
  handleAddComponent,
  existingOrganisms,
  existingMolecules,
  onUpdate,
  inline = false,
}) => {
  const [organism, setOrganism] = useState(emptyOrganism);
  const [showCompositionModal, setShowCompositionModal] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...organism,
      id: generateUUID(),
    });
    setOrganism(emptyOrganism);
  };

  const handleAddComposition = (componentType, componentId) => {
    setOrganism((prev) => ({
      ...prev,
      composition: [
        ...prev.composition,
        {
          visibility: true,
          component_type: componentType,
          id: componentId,
        },
      ],
    }));
  };

  const handleStyleChange = (key, value, nestedKey = null) => {
    setOrganism((prev) => ({
      ...prev,
      styles: {
        ...prev.styles,
        [key]: nestedKey ? { ...prev.styles[key], [nestedKey]: value } : value,
      },
    }));
  };

  const handleCreateMolecule = (molecule) => {
    // First add the molecule
    handleAddComposition("molecule", molecule.id);
    // Then add it to the organism's composition
    setShowCompositionModal(false);
  };

  return (
    <div className="organism-builder">
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setOrganism(emptyOrganism)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Clear Form
          </button>
          {existingOrganisms.length > 0 && (
            <select
              onChange={(e) => {
                const selected = existingOrganisms.find(
                  (o) => o.id === e.target.value
                );
                if (selected) setOrganism(selected);
              }}
              className="text-sm border-gray-300 rounded-md"
            >
              <option value="">Load Organism</option>
              {existingOrganisms.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-color_neu_00  rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {["basic", "styles", "composition"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={organism.name}
                    onChange={(e) =>
                      setOrganism({ ...organism, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., header_organism, hero_section"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <select
                    value={organism.properties.position}
                    onChange={(e) =>
                      setOrganism((prev) => ({
                        ...prev,
                        properties: {
                          ...prev.properties,
                          position: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select Position</option>
                    {POSITION_TYPES.map((pos) => (
                      <option key={pos.value} value={pos.value}>
                        {pos.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stack
                </label>
                <select
                  value={organism.properties.stack}
                  onChange={(e) =>
                    setOrganism((prev) => ({
                      ...prev,
                      properties: { ...prev.properties, stack: e.target.value },
                    }))
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select Stack</option>
                  <option value="h">Horizontal</option>
                  <option value="v">Vertical</option>
                  <option value="z">Z-Stack</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "styles" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <TokenSelect
                  type="colors"
                  value={organism.styles.background_color}
                  onChange={(value) =>
                    handleStyleChange("background_color", value)
                  }
                  label="Background Color"
                />
                <TokenSelect
                  type="colors"
                  value={organism.styles.border_color}
                  onChange={(value) => handleStyleChange("border_color", value)}
                  label="Border Color"
                />
                <TokenSelect
                  type="borders"
                  value={organism.styles.border_width}
                  onChange={(value) => handleStyleChange("border_width", value)}
                  label="Border Width"
                />
                <TokenSelect
                  type="radius"
                  value={organism.styles.border_radius}
                  onChange={(value) =>
                    handleStyleChange("border_radius", value)
                  }
                  label="Border Radius"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {["top", "right", "bottom", "left"].map((direction) => (
                  <TokenSelect
                    key={direction}
                    type="spacing"
                    value={organism.styles.padding[direction]}
                    onChange={(value) =>
                      handleStyleChange("padding", value, direction)
                    }
                    label={`Padding ${direction}`}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "composition" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700">
                  Components
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCompositionModal(true)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
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
                  Add Component
                </button>
              </div>

              <div className="space-y-2">
                {organism.composition?.map((item, index) => {
                  const component =
                    item.component_type === "organism"
                      ? existingOrganisms.find((org) => org.id === item.id)
                      : existingMolecules.find((mol) => mol.id === item.id);

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full mr-2">
                          {item.component_type}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {component?.name || "Unknown Component"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={item.visibility}
                            onChange={(e) => {
                              setOrganism((prev) => ({
                                ...prev,
                                composition: prev.composition.map((comp, i) =>
                                  i === index
                                    ? { ...comp, visibility: e.target.checked }
                                    : comp
                                ),
                              }));
                            }}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            Visible
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setOrganism((prev) => ({
                              ...prev,
                              composition: prev.composition.filter(
                                (_, i) => i !== index
                              ),
                            }));
                          }}
                          className="text-gray-400 hover:text-red-500"
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

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setOrganism(emptyOrganism)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-color_neu_00  border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Save Organism
            </button>
          </div>
        </form>
      </div>

      {/* Component Selection Modal */}
      {showCompositionModal && (
        <ComponentSelectionModal
          title="Add Component"
          existingComponents={[
            ...existingOrganisms.map((org) => ({ ...org, type: "organism" })),
            ...existingMolecules.map((mol) => ({ ...mol, type: "molecule" })),
          ]}
          onSelect={(componentId, type) => {
            handleAddComposition(type, componentId);
            setShowCompositionModal(false);
          }}
          onClose={() => setShowCompositionModal(false)}
          componentType="mixed"
          displayProperty="name"
          onCreateNew={
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Create New Organism
                </h4>
                <OrganismBuilder
                  onAdd={(org) => handleAddComposition("organism", org.id)}
                  existingOrganisms={existingOrganisms}
                  existingMolecules={existingMolecules}
                  inline={true}
                />
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">
                  Create New Molecule
                </h4>
                <MoleculeBuilder
                  onAdd={(mol) => handleAddComposition("molecule", mol.id)}
                  existingMolecules={existingMolecules}
                  existingAtoms={existingAtoms}
                  inline={true}
                />
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default OrganismBuilder;
