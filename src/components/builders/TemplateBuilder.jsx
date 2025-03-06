import React, { useState } from "react";
import { emptyTemplate } from "../../constants/emptyStructures";
import { generateUUID } from "../../utils/uuid";
import TokenSelect from "../common/TokenSelect";
import ComponentSelectionModal from "../common/ComponentSelectionModal";
import OrganismBuilder from "./OrganismBuilder";

const TEMPLATE_TYPES = [
  { value: "showcase", label: "Showcase" },
  { value: "squad", label: "Squad" },
  { value: "fixture", label: "Fixture" },
  { value: "article", label: "Article" },
  { value: "multi_template", label: "Multi Template" },
  { value: "standings", label: "Standings" },
];

const LAYOUT_TYPES = [
  { value: "vertical_listing", label: "Vertical Listing" },
  { value: "horizontal_listing", label: "Horizontal Listing" },
  { value: "grid", label: "Grid" },
  { value: "carousel_listing", label: "Carousel" },
  { value: "tab_layout", label: "Tabs" },
  { value: "table", label: "Table" },
];

const TemplateBuilder = ({
  onAdd,
  handleAddComponent,
  existingTemplates,
  existingOrganisms,
  existingMolecules,
  onUpdate,
}) => {
  const [template, setTemplate] = useState(emptyTemplate);
  const [showCompositionModal, setShowCompositionModal] = useState(false);
  const [activeTab, setActiveTab] = useState("basic"); // 'basic', 'styles', 'composition'

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...template,
      id: generateUUID(),
    });
    setTemplate(emptyTemplate);
  };

  const handleAddComposition = (organismId) => {
    setTemplate((prev) => ({
      ...prev,
      composition: [
        ...prev.composition,
        {
          visibility: true,
          component_type: "organism",
          id: organismId,
        },
      ],
    }));
  };

  const handleStyleChange = (key, value, nestedKey = null) => {
    setTemplate((prev) => ({
      ...prev,
      styles: {
        ...prev.styles,
        [key]: nestedKey ? { ...prev.styles[key], [nestedKey]: value } : value,
      },
    }));
  };

  const handleCreateOrganism = (organism) => {
    // First add the organism
    handleAddComponent("organism", organism);
    // Then add it to the template's composition
    handleAddComposition(organism.id);
    setShowCompositionModal(false);
  };

  // Add template-specific configuration options
  const renderTemplateTypeOptions = () => {
    switch (template.template_type) {
      case "multi_template":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Child Templates
              </label>
              <div className="mt-2 space-y-4">
                {template.data?.child_templates?.map((childTemplate, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-900">
                        {childTemplate.template_type || `Template ${index + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setTemplate((prev) => ({
                            ...prev,
                            data: {
                              ...prev.data,
                              child_templates: prev.data.child_templates.filter(
                                (_, i) => i !== index
                              ),
                            },
                          }));
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <select
                      value={childTemplate.id || ""}
                      onChange={(e) => {
                        const selectedTemplate = existingTemplates.find(
                          (t) => t.id === e.target.value
                        );
                        setTemplate((prev) => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            child_templates: prev.data.child_templates.map(
                              (t, i) =>
                                i === index ? { ...selectedTemplate } : t
                            ),
                          },
                        }));
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select Template</option>
                      {existingTemplates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.template_type}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setTemplate((prev) => ({
                      ...prev,
                      data: {
                        ...prev.data,
                        child_templates: [
                          ...(prev.data?.child_templates || []),
                          {},
                        ],
                      },
                    }));
                  }}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-color_neu_00  hover:bg-gray-50"
                >
                  Add Child Template
                </button>
              </div>
            </div>
          </div>
        );

      case "showcase":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Content Type
              </label>
              <input
                type="text"
                value={template.content_type || ""}
                onChange={(e) =>
                  setTemplate((prev) => ({
                    ...prev,
                    content_type: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data Configuration
              </label>
              <div className="mt-2 space-y-4">
                <input
                  type="text"
                  value={template.data?.title || ""}
                  onChange={(e) =>
                    setTemplate((prev) => ({
                      ...prev,
                      data: { ...prev.data, title: e.target.value },
                    }))
                  }
                  placeholder="Title"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  value={template.data?.sub_title || ""}
                  onChange={(e) =>
                    setTemplate((prev) => ({
                      ...prev,
                      data: { ...prev.data, sub_title: e.target.value },
                    }))
                  }
                  placeholder="Subtitle"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );

      case "squad":
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Squad View Type
              </label>
              <select
                value={template.properties.squad_view_type}
                onChange={(e) =>
                  setTemplate((prev) => ({
                    ...prev,
                    properties: {
                      ...prev.properties,
                      squad_view_type: e.target.value,
                    },
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select View Type</option>
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
                <option value="compact">Compact View</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Show Player Stats
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={template.properties.show_player_stats}
                    onChange={(e) =>
                      setTemplate((prev) => ({
                        ...prev,
                        properties: {
                          ...prev.properties,
                          show_player_stats: e.target.checked,
                        },
                      }))
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Enable player statistics
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case "fixture":
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Fixture Type
              </label>
              <select
                value={template.properties.fixture_type}
                onChange={(e) =>
                  setTemplate((prev) => ({
                    ...prev,
                    properties: {
                      ...prev.properties,
                      fixture_type: e.target.value,
                    },
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Fixture Type</option>
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Show Match Stats
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={template.properties.show_match_stats}
                    onChange={(e) =>
                      setTemplate((prev) => ({
                        ...prev,
                        properties: {
                          ...prev.properties,
                          show_match_stats: e.target.checked,
                        },
                      }))
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Enable match statistics
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case "standings":
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Standings Type
              </label>
              <select
                value={template.properties.standings_type}
                onChange={(e) =>
                  setTemplate((prev) => ({
                    ...prev,
                    properties: {
                      ...prev.properties,
                      standings_type: e.target.value,
                    },
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Type</option>
                <option value="league">League</option>
                <option value="group">Group</option>
                <option value="knockout">Knockout</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Display Options
              </label>
              <div className="mt-2 space-y-2">
                {["show_form", "show_goals", "show_points"].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={template.properties[option]}
                      onChange={(e) =>
                        setTemplate((prev) => ({
                          ...prev,
                          properties: {
                            ...prev.properties,
                            [option]: e.target.checked,
                          },
                        }))
                      }
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {option
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="template-builder">
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setTemplate(emptyTemplate)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Clear Form
          </button>
          {existingTemplates.length > 0 && (
            <select
              onChange={(e) => {
                const selected = existingTemplates.find(
                  (t) => t.id === e.target.value
                );
                if (selected) setTemplate(selected);
              }}
              className="text-sm border-gray-300 rounded-md"
            >
              <option value="">Load Template</option>
              {existingTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.template_type}
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Template Type
                  </label>
                  <select
                    value={template.template_type}
                    onChange={(e) =>
                      setTemplate({
                        ...template,
                        template_type: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select Template Type</option>
                    {TEMPLATE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Layout Type
                  </label>
                  <select
                    value={template.properties.layout_type}
                    onChange={(e) =>
                      setTemplate((prev) => ({
                        ...prev,
                        properties: {
                          ...prev.properties,
                          layout_type: e.target.value,
                        },
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select Layout</option>
                    {LAYOUT_TYPES.map((layout) => (
                      <option key={layout.value} value={layout.value}>
                        {layout.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Template-specific options */}
              {renderTemplateTypeOptions()}

              {/* Layout-specific options */}
              {template.properties.layout_type === "grid" && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Columns
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={template.properties.columns || ""}
                      onChange={(e) =>
                        setTemplate((prev) => ({
                          ...prev,
                          properties: {
                            ...prev.properties,
                            columns: e.target.value,
                          },
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Row Gap
                    </label>
                    <TokenSelect
                      type="spacing"
                      value={template.properties.row_gap}
                      onChange={(value) =>
                        setTemplate((prev) => ({
                          ...prev,
                          properties: { ...prev.properties, row_gap: value },
                        }))
                      }
                    />
                  </div>
                </div>
              )}

              {template.properties.layout_type === "carousel_listing" && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Items Per View
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={template.properties.items_per_view || ""}
                      onChange={(e) =>
                        setTemplate((prev) => ({
                          ...prev,
                          properties: {
                            ...prev.properties,
                            items_per_view: e.target.value,
                          },
                        }))
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Auto Play
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={template.properties.auto_play}
                          onChange={(e) =>
                            setTemplate((prev) => ({
                              ...prev,
                              properties: {
                                ...prev.properties,
                                auto_play: e.target.checked,
                              },
                            }))
                          }
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Enable auto play
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stack
                  </label>
                  <select
                    value={template.properties.stack}
                    onChange={(e) =>
                      setTemplate((prev) => ({
                        ...prev,
                        properties: {
                          ...prev.properties,
                          stack: e.target.value,
                        },
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

              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={template.properties.is_full_width}
                    onChange={(e) =>
                      setTemplate((prev) => ({
                        ...prev,
                        properties: {
                          ...prev.properties,
                          is_full_width: e.target.checked,
                        },
                      }))
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Full Width</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={template.properties.section_gap}
                    onChange={(e) =>
                      setTemplate((prev) => ({
                        ...prev,
                        properties: {
                          ...prev.properties,
                          section_gap: e.target.checked,
                        },
                      }))
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Section Gap
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTab === "styles" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <TokenSelect
                  type="colors"
                  value={template.styles.background_color}
                  onChange={(value) =>
                    handleStyleChange("background_color", value)
                  }
                  label="Background Color"
                />
                <TokenSelect
                  type="spacing"
                  value={template.styles.gap}
                  onChange={(value) => handleStyleChange("gap", value)}
                  label="Gap"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {["top", "right", "bottom", "left"].map((direction) => (
                  <TokenSelect
                    key={direction}
                    type="spacing"
                    value={template.styles.padding[direction]}
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
                <h3 className="text-sm font-medium text-gray-700">Organisms</h3>
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
                  Add Organism
                </button>
              </div>

              <div className="space-y-2">
                {template.composition?.map((item, index) => {
                  const organism = existingOrganisms.find(
                    (org) => org.id === item.id
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {organism?.name || "Unknown Organism"}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          {item.id}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTemplate((prev) => ({
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
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setTemplate(emptyTemplate)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-color_neu_00  border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Save Template
            </button>
          </div>
        </form>
      </div>

      {/* Modal remains the same */}
      {showCompositionModal && (
        <ComponentSelectionModal
          title="Add Organism"
          existingComponents={existingOrganisms}
          onSelect={(organismId) => {
            handleAddComposition(organismId);
            setShowCompositionModal(false);
          }}
          onClose={() => setShowCompositionModal(false)}
          componentType="organism"
          displayProperty="name"
          onCreateNew={
            <OrganismBuilder
              onAdd={handleCreateOrganism}
              existingOrganisms={existingOrganisms}
              existingMolecules={existingMolecules}
              inline={true}
            />
          }
        />
      )}
    </div>
  );
};

export default TemplateBuilder;
