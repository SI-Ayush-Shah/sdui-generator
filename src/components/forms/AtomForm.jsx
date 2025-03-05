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

const TABS = [
  { id: "basic", label: "Basic" },
  { id: "colors", label: "Colors" },
  { id: "border", label: "Border" },
];

const AtomForm = ({ initialData, onSubmit, onCancel, mode = "create" }) => {
  const [atomData, setAtomData] = useState(() => ({
    id: initialData?.id || crypto.randomUUID(),
    name: initialData?.name || "",
    atom_type: initialData?.atom_type || "button",
    typography: initialData?.typography || "",
    size: initialData?.size || "medium",
    variant: initialData?.variant || "primary",
    sub_variant: initialData?.sub_variant || "only_text",
    background_color: initialData?.background_color || "",
    text_color: initialData?.text_color || "",
    border_radius:
      typeof initialData?.border_radius === "string"
        ? {
            top_left: initialData.border_radius,
            top_right: initialData.border_radius,
            bottom_left: initialData.border_radius,
            bottom_right: initialData.border_radius,
          }
        : initialData?.border_radius || {
            top_left: "",
            top_right: "",
            bottom_left: "",
            bottom_right: "",
          },
    border_color: initialData?.border_color || "",
    border_width: initialData?.border_width || "",
    gradient: initialData?.gradient || "",
  }));

  const [activeTab, setActiveTab] = useState("basic");
  const colors = extractColors();

  // Debug the colors

  useEffect(() => {
    if (initialData) {
      const newData = {
        ...initialData,
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
    setAtomData((prev) => ({
      ...prev,
      [property]: value,
    }));
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
    e.preventDefault();
    onSubmit(atomData);
  };

  const updatePreview = () => {
    console.log(atomData);
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
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-8">
          <div className="space-y-6">
            {/* Name and Type */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text_main_high mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={atomData.name}
                  onChange={(e) => handlePropertyChange("name", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-border_main_default"
                  placeholder="Enter atom name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text_main_high mb-1">
                  Type
                </label>
                <SearchableSelect
                  options={ATOM_TYPES}
                  value={atomData.atom_type}
                  onChange={(value) => handlePropertyChange("atom_type", value)}
                  disabled={mode === "edit"}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border_main_default">
              <nav className="flex space-x-8">
                {TABS.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`py-4 px-1 text-sm font-medium  ${
                      activeTab === id ? " border-b-2 " : ""
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
                          value={atomData.sub_variant}
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
                          options={SIZES}
                          value={atomData.size}
                          onChange={(value) =>
                            handlePropertyChange("size", value)
                          }
                        />
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
                          value={atomData.sub_variant}
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
                          options={SIZES}
                          value={atomData.size}
                          onChange={(value) =>
                            handlePropertyChange("size", value)
                          }
                        />
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
                          options={RATIO_OPTIONS}
                          value={atomData.ratio}
                          onChange={(value) =>
                            handlePropertyChange("ratio", value)
                          }
                        />
                      </div>
                    </>
                  )}
                  {atomData.atom_type === "text" && (
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Typography
                      </label>
                      <SearchableSelect
                        options={TYPOGRAPHY_OPTIONS}
                        value={atomData.typography}
                        onChange={(value) =>
                          handlePropertyChange("typography", value)
                        }
                      />
                    </div>
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
                        value={atomData.background_color}
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
                        value={atomData.text_color}
                        onChange={(value) =>
                          handlePropertyChange("text_color", value)
                        }
                        isColor={true}
                      />
                    </div>
                  )}
                  {/* gradient   */}
                  <div>
                    <label className="block text-sm font-medium text-text_main_high mb-1">
                      Gradient
                    </label>
                    <SearchableSelect
                      options={GRADIENT_OPTIONS}
                      value={atomData.gradient}
                      onChange={(value) =>
                        handlePropertyChange("gradient", value)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Border Tab */}
              <div className={activeTab === "border" ? "block" : "hidden"}>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Top Left Radius
                      </label>
                      <SearchableSelect
                        options={RADIUS_OPTIONS}
                        value={atomData.border_radius.top_left}
                        onChange={(value) =>
                          handleBorderRadiusChange("top_left", value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Top Right Radius
                      </label>
                      <SearchableSelect
                        options={RADIUS_OPTIONS}
                        value={atomData.border_radius.top_right}
                        onChange={(value) =>
                          handleBorderRadiusChange("top_right", value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Bottom Left Radius
                      </label>
                      <SearchableSelect
                        options={RADIUS_OPTIONS}
                        value={atomData.border_radius.bottom_left}
                        onChange={(value) =>
                          handleBorderRadiusChange("bottom_left", value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Bottom Right Radius
                      </label>
                      <SearchableSelect
                        options={RADIUS_OPTIONS}
                        value={atomData.border_radius.bottom_right}
                        onChange={(value) =>
                          handleBorderRadiusChange("bottom_right", value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text_main_high mb-1">
                      Border Color
                    </label>
                    <SearchableSelect
                      options={colors}
                      value={atomData.border_color}
                      onChange={(value) =>
                        handlePropertyChange("border_color", value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Column */}
        <div className="col-span-4">
          <div className="sticky top-6">
            <div className="p-4 bg-background_main_container rounded-lg">
              <h4 className="text-sm font-medium text-text_main_high mb-4">
                Preview
              </h4>
              <div className="flex items-center justify-center min-h-[120px] bg-background_main_surface rounded p-4">
                {updatePreview()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-border_main_default">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-text_main_high bg-background_main_surface border border-border_main_default rounded-md hover:bg-background_main_hover"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-button_filled_style_3_text_default bg-button_filled_style_3_surface_default rounded-md hover:bg-button_filled_style_3_surface_hover"
        >
          {mode === "create" ? "Create Atom" : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default AtomForm;
