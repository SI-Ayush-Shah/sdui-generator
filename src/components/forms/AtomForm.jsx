import React, { useState, useEffect } from "react";
import SearchableSelect from "../common/SearchableSelect";
import { Button, Text, Badge, Img } from "@sikit/ui";
import {
  ATOM_TYPES,
  BUTTON_SUB_VARIANTS,
  RADIUS_OPTIONS,
  TYPOGRAPHY_OPTIONS,
  SIZES,
  RATIO_OPTIONS,
  GRADIENT_OPTIONS,
} from "../../constants/atomOptions";
import { extractColors } from "../../utils/colors";
import { generateUniqueId } from "../../utils/idGenerator";

const TABS = [
  { id: "basic", label: "Basic" },
  { id: "colors", label: "Colors" },
  { id: "border", label: "Border" },
];

// Create default empty atom data structure
export const createEmptyAtom = (type = "button") => {
  // Generate a unique ID using our utility
  const uniqueId = generateUniqueId('atom');
  
  const baseAtom = {
    id: uniqueId,
    atom_type: type,
    size: "medium",
    variant: "primary",
    sub_variant: "only_text",
    background_color: "",
    text_color: "",
    border_width: "",
    border_radius: {
      top_left: "",
      top_right: "",
      bottom_left: "",
      bottom_right: "",
    },
    border_color: "",
    gradient: "",
    full_width: false,
    no_padding: false,
  };

  // Set properties specific to text atoms
  if (type === "text") {
    baseAtom.typography = "body_md_regular";
    baseAtom.text_color = "text_main_high"; // Default text color
    baseAtom.clamp = 1; // Default line clamp (no clamp)
    baseAtom.align = "left"; // Default text alignment
  } else {
    baseAtom.typography = "";
  }

  return baseAtom;
};

const AtomForm = ({
  initialData,
  onSubmit,
  onCancel,
  mode = "create",
  inline = false,
  onReset,
  disableTypeSelection = false,
}) => {
  // Initialize state
  const [activeTab, setActiveTab] = useState("basic");
  const [showBorderOptions, setShowBorderOptions] = useState(false);
  const [atomData, setAtomData] = useState(() => {
    if (initialData) return initialData;
    // Use the initialData atom_type or default to "button"
    return createEmptyAtom(initialData?.atom_type);
  });
  const colors = extractColors();

  // Use useEffect to update state when props change
  useEffect(() => {
    if (initialData) {
      const newData = {
        ...initialData,
        id: initialData.id || crypto.randomUUID(),
        atom_type: initialData.atom_type || "button",
        background_color: initialData.background_color || "",
        text_color: initialData.text_color || "",
        border_radius:
          typeof initialData.border_radius === "string"
            ? {
                top_left: initialData.border_radius,
                top_right: initialData.border_radius,
                bottom_left: initialData.border_radius,
                bottom_right: initialData.border_radius,
              }
            : initialData.border_radius || {
                top_left: "",
                top_right: "",
                bottom_left: "",
                bottom_right: "",
              },
      };

      setAtomData(newData);
    }
  }, [initialData]);

  const handlePropertyChange = (property, value) => {
    setAtomData((prev) => {
      // If changing atom type to "text", set default text-specific properties
      // and remove border-related properties
      if (property === "atom_type" && value === "text") {
        const newData = {
          ...prev,
          [property]: value,
          // Remove border-related properties for text atoms
          border_width: "",
          border_color: "",
          border_radius: {
            top_left: "",
            top_right: "",
            bottom_left: "",
            bottom_right: "",
          },
          // Set default text-specific properties if not already set
          text_color: prev.text_color || "text_main_high",
          clamp: prev.clamp || 1,
          align: prev.align || "left"
        };
        
        // Set default typography if it's empty
        if (!prev.typography) {
          newData.typography = "body_md_regular";
        }
        
        return newData;
      }
      
      return {
        ...prev,
        [property]: value,
      };
    });
  };

  const handleBorderRadiusChange = (corner, value) => {
    setAtomData((prev) => ({
      ...prev,
      border_radius: {
        ...prev.border_radius,
        [corner]: value,
      },
    }));
  };

  const handleSubmit = (e) => {
    // Always prevent the default form submission behavior which causes page refresh
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Pass the atom data to the parent component's submit handler
    onSubmit(atomData);
    
    // Return false to prevent form submission
    return false;
  };

  const handleReset = () => {
    // Reset to an empty atom of the same type
    const emptyAtom = createEmptyAtom(atomData.atom_type);
    setAtomData(emptyAtom);
    if (onReset) onReset(emptyAtom);
  };

  const updatePreview = () => {
    switch (atomData.atom_type) {
      case "button":
        return <Button {...atomData} text="Button Text" />;
      case "text":
        return <Text {...atomData}>Sample Text</Text>;
      case "badge":
        return <Badge {...atomData} text="Badge Text" />;
      case "img":
        return (
          <Img
            src={`https://stg-washington-freedom.sportz.io/static-assets/waf-images/3e/4d/f6/${
              atomData.ratio?.split(":")[0] || "16"
            }-${
              atomData.ratio?.split(":")[1] || "9"
            }/W62UAhQg2I.jpg?v=1.04&w=1920`}
            {...atomData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-8">
          <div className="space-y-6">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-text_main_high mb-1">
                Type
              </label>
              <SearchableSelect
                options={ATOM_TYPES}
                value={atomData.atom_type || "button"}
                onChange={(value) => handlePropertyChange("atom_type", value)}
                disabled={disableTypeSelection}
              />
            </div>

            {/* Tabs */}
            <div className="border-b border-border_main_default">
              <nav className="flex">
                {TABS.filter(tab => !(tab.id === 'border' && atomData.atom_type === 'text')).map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`py-3 px-6 text-sm font-medium transition-colors border-b-2 ${
                      activeTab === id
                        ? "text-text_main_high border-background_prim_surface"
                        : "text-text_main_medium hover:text-text_main_high border-transparent hover:border-border_main_default"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="pt-4">
              {/* Basic Tab */}
              <div className={activeTab === "basic" ? "block" : "hidden"}>
                <div className="space-y-6">
                  {atomData.atom_type === "button" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text_main_high mb-1">
                          Sub Variant
                        </label>
                        <SearchableSelect
                          options={BUTTON_SUB_VARIANTS}
                          value={atomData.sub_variant || "only_text"}
                          onChange={(value) =>
                            handlePropertyChange("sub_variant", value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text_main_high mb-1">
                          Size
                        </label>
                        <SearchableSelect
                          options={SIZES.map((size) => ({
                            value: size,
                            label: size.charAt(0).toUpperCase() + size.slice(1),
                          }))}
                          value={atomData.size || "medium"}
                          onChange={(value) =>
                            handlePropertyChange("size", value)
                          }
                        />
                      </div>
                      
                      {/* Toggle switches for button */}
                      <div className="flex flex-col gap-4 mt-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-text_main_high">
                            Full Width
                          </label>
                          <div className="ml-auto">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={atomData.full_width || false}
                                onChange={(e) =>
                                  handlePropertyChange("full_width", e.target.checked)
                                }
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-background_main_container peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-background_prim_surface rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-background_prim_surface"></div>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-text_main_high">
                            No Padding
                          </label>
                          <div className="ml-auto">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={atomData.no_padding || false}
                                onChange={(e) =>
                                  handlePropertyChange("no_padding", e.target.checked)
                                }
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-background_main_container peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-background_prim_surface rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-background_prim_surface"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {atomData.atom_type === "badge" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text_main_high mb-1">
                          Sub Variant
                        </label>
                        <SearchableSelect
                          options={BUTTON_SUB_VARIANTS}
                          value={atomData.sub_variant || "only_text"}
                          onChange={(value) =>
                            handlePropertyChange("sub_variant", value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text_main_high mb-1">
                          Size
                        </label>
                        <SearchableSelect
                          options={SIZES.map((size) => ({
                            value: size,
                            label: size.charAt(0).toUpperCase() + size.slice(1),
                          }))}
                          value={atomData.size || "medium"}
                          onChange={(value) =>
                            handlePropertyChange("size", value)
                          }
                        />
                      </div>
                      
                      {/* Toggle switches for badge */}
                      <div className="flex flex-col gap-4 mt-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-text_main_high">
                            Full Width
                          </label>
                          <div className="ml-auto">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={atomData.full_width || false}
                                onChange={(e) =>
                                  handlePropertyChange("full_width", e.target.checked)
                                }
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-background_main_container peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-background_prim_surface rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-background_prim_surface"></div>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-text_main_high">
                            No Padding
                          </label>
                          <div className="ml-auto">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={atomData.no_padding || false}
                                onChange={(e) =>
                                  handlePropertyChange("no_padding", e.target.checked)
                                }
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-background_main_container peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-background_prim_surface rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-background_prim_surface"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {atomData.atom_type === "img" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text_main_high mb-1">
                          Ratio
                        </label>
                        <SearchableSelect
                          options={RATIO_OPTIONS.map((ratio) => ({
                            value: ratio,
                            label: ratio,
                          }))}
                          value={atomData.ratio || "16:9"}
                          onChange={(value) =>
                            handlePropertyChange("ratio", value)
                          }
                        />
                      </div>
                    </>
                  )}
                  {atomData.atom_type === "text" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-text_main_high mb-1">
                          Typography
                        </label>
                        <SearchableSelect
                          options={TYPOGRAPHY_OPTIONS}
                          value={atomData.typography || ""}
                          onChange={(value) =>
                            handlePropertyChange("typography", value)
                          }
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text_main_high mb-1">
                          Line Clamp
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={atomData.clamp || 1}
                          onChange={(e) => handlePropertyChange("clamp", parseInt(e.target.value, 10))}
                          className="w-full px-3 py-2 border border-border_main_default rounded-md text-text_main_high placeholder-text_main_disable bg-background_main_surface focus:border-background_prim_surface focus:ring-1 focus:ring-background_prim_card transition-colors"
                        />
                        <p className="text-xs text-text_main_medium mt-1">Number of lines to display (1 for no clamp)</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-text_main_high mb-1">
                          Text Alignment
                        </label>
                        <div className="flex space-x-4">
                          {["left", "center", "right"].map((alignment) => (
                            <label key={alignment} className="flex items-center">
                              <input
                                type="radio"
                                name="textAlign"
                                value={alignment}
                                checked={atomData.align === alignment}
                                onChange={() => handlePropertyChange("align", alignment)}
                                className="mr-2"
                              />
                              <span className="text-sm text-text_main_high capitalize">{alignment}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Colors Tab */}
              <div className={activeTab === "colors" ? "block" : "hidden"}>
                <div className="space-y-6">
                  {["badge", "button"].includes(atomData.atom_type) && (
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Background Color
                      </label>

                      <SearchableSelect
                        options={colors}
                        value={atomData.background_color || ""}
                        onChange={(value) =>
                          handlePropertyChange("background_color", value)
                        }
                        isColor={true}
                      />
                    </div>
                  )}
                  {["badge", "button"].includes(atomData.atom_type) && (
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Text Color
                      </label>
                      <SearchableSelect
                        options={colors}
                        value={atomData.text_color || ""}
                        onChange={(value) =>
                          handlePropertyChange("text_color", value)
                        }
                        isColor={true}
                      />
                    </div>
                  )}
                  
                  {atomData.atom_type === "text" && (
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Text Color
                      </label>
                      <SearchableSelect
                        options={colors}
                        value={atomData.text_color || ""}
                        onChange={(value) =>
                          handlePropertyChange("text_color", value)
                        }
                        isColor={true}
                      />
                    </div>
                  )}

                  {["badge", "button", "img", "text"].includes(
                    atomData.atom_type
                  ) && (
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Gradient
                      </label>
                      <SearchableSelect
                        options={GRADIENT_OPTIONS.map((gradient) => ({
                          value: gradient,
                          label: gradient,
                        }))}
                        value={atomData.gradient || ""}
                        onChange={(value) =>
                          handlePropertyChange("gradient", value)
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Border Tab */}
              <div className={activeTab === "border" ? "block" : "hidden"}>
                <div className="space-y-6">
                  <div className="p-4 bg-background_main_card border border-border_main_default rounded-md">
                    <h3 className="text-sm font-medium text-text_main_high mb-3">
                      Border Radius
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-text_main_medium mb-1">
                          Top Left Radius
                        </label>
                        <SearchableSelect
                          options={RADIUS_OPTIONS}
                          value={atomData.border_radius?.top_left || ""}
                          onChange={(value) =>
                            handleBorderRadiusChange("top_left", value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text_main_medium mb-1">
                          Top Right Radius
                        </label>
                        <SearchableSelect
                          options={RADIUS_OPTIONS}
                          value={atomData.border_radius?.top_right || ""}
                          onChange={(value) =>
                            handleBorderRadiusChange("top_right", value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text_main_medium mb-1">
                          Bottom Left Radius
                        </label>
                        <SearchableSelect
                          options={RADIUS_OPTIONS}
                          value={atomData.border_radius?.bottom_left || ""}
                          onChange={(value) =>
                            handleBorderRadiusChange("bottom_left", value)
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-text_main_medium mb-1">
                          Bottom Right Radius
                        </label>
                        <SearchableSelect
                          options={RADIUS_OPTIONS}
                          value={atomData.border_radius?.bottom_right || ""}
                          onChange={(value) =>
                            handleBorderRadiusChange("bottom_right", value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Border Width
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-border_main_default rounded-md text-text_main_high placeholder-text_main_disable bg-background_main_surface focus:border-background_prim_surface focus:ring-1 focus:ring-background_prim_card transition-colors"
                        value={atomData.border_width || ""}
                        onChange={(e) =>
                          handlePropertyChange(
                            "border_width",
                            parseInt(e.target.value) || ""
                          )
                        }
                        placeholder="Border width in px"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Border Color
                      </label>
                      <SearchableSelect
                        options={colors}
                        value={atomData.border_color || ""}
                        onChange={(value) =>
                          handlePropertyChange("border_color", value)
                        }
                        isColor={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                Preview
              </h4>
              <div className="flex items-center justify-center min-h-[120px] bg-background_main_surface border border-border_main_default rounded p-4">
                {updatePreview()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-border_main_default">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-text_main_medium bg-background_main_surface border border-border_main_default rounded-md hover:bg-background_main_card transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-text_main_medium bg-background_main_surface border border-border_main_default rounded-md hover:bg-background_main_card transition-colors"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
            return false;
          }}
          className="px-4 py-2 text-sm font-medium text-button_filled_style_2_text_icon_default bg-button_filled_style_2_surface_default rounded-md hover:bg-button_filled_style_2_surface_hover transition-colors"
        >
          {mode === "create" ? "Create Atom" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default AtomForm;
