import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import SearchableSelect from "../common/SearchableSelect";
import { toast } from "react-hot-toast";
import { Button, Text, Badge, Img } from "@sikit/ui";
import {
  ATOM_TYPES,
  BUTTON_SUB_VARIANTS,
  RADIUS_OPTIONS,
  TYPOGRAPHY_OPTIONS,
  SIZES,
} from "../../constants/atomOptions";
import { extractColors } from "../../utils/colors";

const TABS = [
  { id: "basic", label: "Basic" },
  { id: "colors", label: "Colors" },
  { id: "border", label: "Border" },
];

const EditAtomModal = ({ atom, onClose, onSave }) => {
  const [editedAtom, setEditedAtom] = useState(atom);
  const [activeTab, setActiveTab] = useState("basic");
  const colors = extractColors();

  // Update preview whenever atom changes
  useEffect(() => {
    updatePreview();
  }, [editedAtom]);

  const updatePreview = () => {
    switch (editedAtom.atom_type) {
      case "button":
        return <Button {...editedAtom} text="Button Text" />;
      case "text":
        return <Text {...editedAtom}>Sample Text</Text>;
      case "badge":
        return <Badge {...editedAtom} text="Badge Text" />;
      case "image":
        return (
          <Img
            src={`https://stg-washington-freedom.sportz.io/static-assets/waf-images/3e/4d/f6/${
              editedAtom.ratio?.split(":")[0] || "1"
            }-${
              editedAtom.ratio?.split(":")[1] || "1"
            }/W62UAhQg2I.jpg?v=1.04&w=1920`}
            {...editedAtom}
          />
        );
      default:
        return null;
    }
  };

  const handlePropertyChange = (property, value) => {
    setEditedAtom((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...editedAtom,
      updated_at: new Date().toISOString(),
    });
    toast.success("Atom updated successfully!");
    onClose();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <>
            {/* Typography and Size Section */}
            <div className="p-4 bg-background_main_container rounded-lg space-y-4">
              <h4 className="text-sm font-medium text-text_main_high mb-2">
                Basic Settings
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <SearchableSelect
                  label="Typography"
                  options={TYPOGRAPHY_OPTIONS}
                  value={editedAtom.typography}
                  onChange={(value) =>
                    handlePropertyChange("typography", value)
                  }
                  placeholder="Select typography"
                />
                <SearchableSelect
                  label="Size"
                  options={SIZES.map((size) => ({
                    value: size,
                    label: size.charAt(0).toUpperCase() + size.slice(1),
                  }))}
                  value={editedAtom.size}
                  onChange={(value) => handlePropertyChange("size", value)}
                  placeholder="Select Size"
                />
              </div>
            </div>

            {/* Variant Section */}
            <div className="p-4 bg-background_main_container rounded-lg space-y-4">
              <h4 className="text-sm font-medium text-text_main_high mb-2">
                Variant Settings
              </h4>
              <SearchableSelect
                label="Sub Variant"
                options={BUTTON_SUB_VARIANTS}
                value={editedAtom.sub_variant}
                onChange={(value) => handlePropertyChange("sub_variant", value)}
              />

              {/* Dynamic Icon Fields */}
              {editedAtom.sub_variant !== "only_text" && (
                <div className="grid grid-cols-2 gap-6">
                  {(editedAtom.sub_variant === "leading_icon" ||
                    editedAtom.sub_variant === "icon_text_icon") && (
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Leading Icon
                      </label>
                      <input
                        type="text"
                        value={editedAtom.leading_icon}
                        onChange={(e) =>
                          handlePropertyChange("leading_icon", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-md border border-border_main_default"
                      />
                    </div>
                  )}
                  {(editedAtom.sub_variant === "trailing_icon" ||
                    editedAtom.sub_variant === "icon_text_icon") && (
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Trailing Icon
                      </label>
                      <input
                        type="text"
                        value={editedAtom.trailing_icon}
                        onChange={(e) =>
                          handlePropertyChange("trailing_icon", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-md border border-border_main_default"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        );

      case "colors":
        return (
          <div className="space-y-6">
            {/* Background Color */}
            <div className="p-4 bg-background_main_container rounded-lg space-y-4">
              <h4 className="text-sm font-medium text-text_main_high mb-2">
                Colors
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <SearchableSelect
                  label="Background Color"
                  options={colors}
                  value={editedAtom.background_color}
                  onChange={(value) =>
                    handlePropertyChange("background_color", value)
                  }
                />
                <SearchableSelect
                  label="Text Color"
                  options={colors}
                  value={editedAtom.text_color}
                  onChange={(value) =>
                    handlePropertyChange("text_color", value)
                  }
                />
              </div>
            </div>

            {/* Gradient */}
            <div className="p-4 bg-background_main_container rounded-lg space-y-4">
              <h4 className="text-sm font-medium text-text_main_high mb-2">
                Gradient
              </h4>
              <input
                type="text"
                value={editedAtom.gradient}
                onChange={(e) =>
                  handlePropertyChange("gradient", e.target.value)
                }
                className="w-full px-3 py-2 rounded-md border border-border_main_default"
                placeholder="Enter gradient value"
              />
            </div>
          </div>
        );

      case "border":
        return (
          <div className="space-y-6">
            {/* Border Settings */}
            <div className="p-4 bg-background_main_container rounded-lg space-y-4">
              <h4 className="text-sm font-medium text-text_main_high mb-2">
                Border Settings
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <SearchableSelect
                  label="Border Color"
                  options={colors}
                  value={editedAtom.border_color}
                  onChange={(value) =>
                    handlePropertyChange("border_color", value)
                  }
                />
                <div>
                  <label className="block text-sm font-medium text-text_main_high mb-1">
                    Border Width
                  </label>
                  <input
                    type="number"
                    value={editedAtom.border_width}
                    onChange={(e) =>
                      handlePropertyChange("border_width", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-md border border-border_main_default"
                  />
                </div>
              </div>
            </div>

            {/* Border Radius */}
            <div className="p-4 bg-background_main_container rounded-lg space-y-4">
              <h4 className="text-sm font-medium text-text_main_high mb-2">
                Border Radius
              </h4>
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(editedAtom.border_radius || {}).map(
                  ([key, value]) => (
                    <SearchableSelect
                      key={key}
                      label={key.split("_").join(" ").toUpperCase()}
                      options={RADIUS_OPTIONS}
                      value={value}
                      onChange={(newValue) =>
                        handlePropertyChange("border_radius", {
                          ...editedAtom.border_radius,
                          [key]: newValue,
                        })
                      }
                    />
                  )
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000]/50 flex items-center justify-center z-50">
      <div className="bg-background_main_surface rounded-lg shadow-xl w-[1000px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border_main_default bg-background_main_container flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text_main_high">
            Edit Atom: {editedAtom.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text_main_medium hover:text-text_main_high rounded-full hover:bg-background_main_hover"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="grid grid-cols-12 gap-6">
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
                        value={editedAtom.name}
                        onChange={(e) =>
                          handlePropertyChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-md border border-border_main_default bg-background_main_surface text-text_main_high"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text_main_high mb-1">
                        Type
                      </label>
                      <input
                        type="text"
                        value={editedAtom.atom_type}
                        disabled
                        className="w-full px-3 py-2 rounded-md border border-border_main_default bg-background_main_container text-text_main_medium cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-border_main_default">
                    <nav className="-mb-px flex space-x-8">
                      {TABS.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          type="button"
                          className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                            ${
                              activeTab === tab.id
                                ? "border-button_filled_style_3_surface_default text-button_filled_style_3_text_default"
                                : "border-transparent text-text_main_medium hover:text-text_main_high hover:border-border_main_default"
                            }
                          `}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  {renderTabContent()}
                </div>
              </div>

              {/* Preview Column */}
              <div className="col-span-4">
                <div className="sticky top-6 space-y-6">
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
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text_main_high bg-background_main_surface border border-border_main_default rounded-md hover:bg-background_main_hover"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-button_filled_style_3_text_default bg-button_filled_style_3_surface_default rounded-md hover:bg-button_filled_style_3_surface_hover"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAtomModal;
