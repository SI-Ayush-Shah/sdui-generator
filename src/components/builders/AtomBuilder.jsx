import React, { useState, useEffect } from "react";
import { generateUUID } from "../../utils/uuid";
import { Button, Text, Img, Badge } from "@sikit/ui";
import SearchableSelect from "../common/SearchableSelect";
import { extractColors } from "../../utils/colors";
import { toast } from "react-hot-toast";
import { emptyAtom } from "../../constants/emptyStructures";

const ATOM_TYPES = [
  {
    value: "button",
    label: "Button",
    defaultProps: {
      variant: "primary",
      size: "medium",
      label: "Button Text",
      isDisabled: false,
      isFullWidth: false,
    },
  },
  {
    value: "text",
    label: "Text",
    defaultProps: {
      variant: "body1",
      color: "primary",
      content: "Text content",
    },
  },
  {
    value: "image",
    label: "Image",
    defaultProps: {
      src: "",
      alt: "",
      width: "auto",
      height: "auto",
      fit: "cover",
    },
  },
  {
    value: "badge",
    label: "Badge",
    defaultProps: {
      variant: "default",
      content: "Badge Text",
      size: "medium",
    },
  },
];

const BUTTON_VARIANTS = ["primary", "secondary", "tertiary", "ghost", "danger"];
const TEXT_VARIANTS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "body1",
  "body2",
  "caption",
];
const BADGE_VARIANTS = ["default", "success", "warning", "error", "info"];
const SIZES = ["small", "medium", "large"];

const BUTTON_SUB_VARIANTS = [
  { value: "only_text", label: "Only Text" },
  { value: "leading_icon", label: "Leading Icon" },
  { value: "trailing_icon", label: "Trailing Icon" },
  { value: "icon_text_icon", label: "Icon Text Icon" },
  { value: "only_icon", label: "Only Icon" },
];

const RADIUS_OPTIONS = [
  { value: "radius_none", label: "radius_none" },
  { value: "radius_xs", label: "radius_xs" },
  { value: "radius_sm", label: "radius_sm" },
  { value: "radius_md", label: "radius_md" },
  { value: "radius_lg", label: "radius_lg" },
  { value: "radius_xl", label: "radius_xl" },
  { value: "radius_2xl", label: "radius_2xl" },
  { value: "radius_3xl", label: "radius_3xl" },
  { value: "radius_rounded", label: "radius_rounded" },
];

const TABS = [
  { id: "basic", label: "Basic" },
  { id: "colors", label: "Colors" },
  { id: "border", label: "Border" },
];

// Add typography options from schema
const TYPOGRAPHY_OPTIONS = [
  { value: "dp_1_black", label: "dp_1_black" },
  { value: "dp_1_bold", label: "dp_1_bold" },
  { value: "dp_2_black", label: "dp_2_black" },
  { value: "dp_2_bold", label: "dp_2_bold" },
  { value: "dp_3_black", label: "dp_3_black" },
  { value: "dp_3_bold", label: "dp_3_bold" },
  { value: "xl_bold", label: "xl_bold" },
  { value: "xl_medium", label: "xl_medium" },
  { value: "xl_regular", label: "xl_regular" },
  { value: "h1_bold", label: "h1_bold" },
  { value: "h1_medium", label: "h1_medium" },
  { value: "h1_regular", label: "h1_regular" },
  { value: "h2_bold", label: "h2_bold" },
  { value: "h2_medium", label: "h2_medium" },
  { value: "h2_regular", label: "h2_regular" },
  { value: "h3_bold", label: "h3_bold" },
  { value: "h3_medium", label: "h3_medium" },
  { value: "h3_regular", label: "h3_regular" },
  { value: "body_lg_bold", label: "body_lg_bold" },
  { value: "body_lg_medium", label: "body_lg_medium" },
  { value: "body_lg_regular", label: "body_lg_regular" },
  { value: "body_md_bold", label: "body_md_bold" },
  { value: "body_md_medium", label: "body_md_medium" },
  { value: "body_md_regular", label: "body_md_regular" },
  { value: "body_md_badge", label: "body_md_badge" },
  { value: "body_sm_bold", label: "body_sm_bold" },
  { value: "body_sm_medium", label: "body_sm_medium" },
  { value: "body_sm_regular", label: "body_sm_regular" },
  { value: "body_xs_bold", label: "body_xs_bold" },
  { value: "body_xs_medium", label: "body_xs_medium" },
  { value: "body_xs_regular", label: "body_xs_regular" },
  { value: "button_lg", label: "button_lg" },
  { value: "button_md", label: "button_md" },
  { value: "button_sm", label: "button_sm" },
  { value: "badge_lg", label: "badge_lg" },
  { value: "badge_md", label: "badge_md" },
  { value: "badge_sm", label: "badge_sm" },
];

const AtomBuilder = ({ onAdd, existingAtoms, onUpdate, inline = false }) => {
  const [atom, setAtom] = useState({
    ...emptyAtom,
    id: generateUUID(),
  });
  const [activeTab, setActiveTab] = useState("basic");
  const [preview, setPreview] = useState(null);

  const colors = extractColors();

  // Update preview when atom state changes
  useEffect(() => {
    if (atom.atom_type) {
      updatePreview(atom.atom_type, atom);
    }
  }, [atom]);

  const handleAtomTypeChange = (type) => {
    const selectedType = ATOM_TYPES.find((t) => t.value === type);
    setAtom((prev) => ({
      ...prev,
      atom_type: type,
      // Reset all properties when type changes
      background_color: "",
      border_color: "",
      border_radius: {
        bottom_left: "",
        bottom_right: "",
        top_left: "",
        top_right: "",
      },
      border_width: "",
      full_width: false,
      gradient: "",
      leading_icon: "",
      size: "",
      sub_variant: "only_text",
      text_color: "",
      trailing_icon: "",
      typography: "",
    }));
  };

  const updatePreview = (type, props) => {
    switch (type) {
      case "button":
        setPreview(
          <Button
            background_color={props.background_color}
            border_color={props.border_color}
            border_radius={props.border_radius}
            border_width={props.border_width}
            full_width={props.full_width}
            gradient={props.gradient}
            leading_icon={props.leading_icon}
            size={props.size}
            sub_variant={props.sub_variant}
            text_color={props.text_color}
            trailing_icon={props.trailing_icon}
            typography={props.typography}
            text={"Button Text"}
          ></Button>
        );
        break;
      case "text":
        setPreview(
          <Text variant={props.variant} color={props.color}>
            {props.content}
          </Text>
        );
        break;
      case "image":
        setPreview(
          <Img
            src={props.src || "https://via.placeholder.com/150"}
            alt={props.alt}
            width={props.width}
            height={props.height}
            objectFit={props.fit}
          />
        );
        break;
      case "badge":
        setPreview(
          <Badge variant={props.variant} size={props.size} text="Badge Text">
            {props.content}
          </Badge>
        );
        break;
      default:
        setPreview(null);
    }
  };

  const handlePropertyChange = (property, value) => {
    setAtom((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  // Add border width validation handler
  const handleBorderWidthChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and empty string
    if (value === "" || /^\d+$/.test(value)) {
      setAtom((prev) => ({ ...prev, border_width: value }));
    }
  };

  // Get final atom JSON
  const getFinalAtom = () => {
    return {
      ...atom,
      id: atom.id || generateUUID(),
    };
  };

  // Update tab change handler
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAtom = {
      ...atom,
      id: atom.id || generateUUID(),
      name: `${atom.atom_type}_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onAdd(newAtom);

    setAtom({
      ...emptyAtom,
      id: generateUUID(),
    });

    toast.success("Atom saved successfully!");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="space-y-6">
            {/* Typography and Size Section */}
            <div className="p-4 bg-background_main_container rounded-lg space-y-4">
              <h4 className="text-sm font-medium text-text_main_high mb-2">
                Basic Settings
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <SearchableSelect
                  label="Typography"
                  options={TYPOGRAPHY_OPTIONS}
                  value={atom.typography}
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
                  value={atom.size}
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
                value={atom.sub_variant}
                onChange={(value) => handlePropertyChange("sub_variant", value)}
              />

              {/* Dynamic Icon Fields */}
              {(atom.sub_variant === "leading_icon" ||
                atom.sub_variant === "only_icon" ||
                atom.sub_variant === "icon_text_icon") && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-text_main_high mb-2">
                    Leading Icon
                  </label>
                  <input
                    type="text"
                    value={atom.leading_icon}
                    onChange={(e) =>
                      handlePropertyChange("leading_icon", e.target.value)
                    }
                    className="block p-2 w-full rounded-md border-border_main_default bg-background_main_surface shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
                    placeholder="Enter icon name"
                  />
                </div>
              )}

              {(atom.sub_variant === "trailing_icon" ||
                atom.sub_variant === "icon_text_icon") && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-text_main_high mb-2">
                    Trailing Icon
                  </label>
                  <input
                    type="text"
                    value={atom.trailing_icon}
                    onChange={(e) =>
                      handlePropertyChange("trailing_icon", e.target.value)
                    }
                    className="block p-2 w-full rounded-md border-border_main_default bg-background_main_surface shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
                    placeholder="Enter icon name"
                  />
                </div>
              )}
            </div>

            {/* Options Section */}
            <div className="p-4 bg-background_main_container rounded-lg">
              <h4 className="text-sm font-medium text-text_main_high mb-4">
                Options
              </h4>
              <label className="inline-flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="full_width"
                  checked={atom.full_width}
                  onChange={(e) =>
                    handlePropertyChange("full_width", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-border_main_default text-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
                />
                <span className="text-sm font-medium text-text_main_high">
                  Full Width
                </span>
              </label>
            </div>
          </div>
        );
      case "colors":
        return (
          <div className="p-4 bg-background_main_container rounded-lg space-y-6">
            <h4 className="text-sm font-medium text-text_main_high mb-2">
              Color Settings
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <SearchableSelect
                label="Background Color"
                options={colors}
                value={atom.background_color}
                onChange={(value) =>
                  handlePropertyChange("background_color", value)
                }
                placeholder="Select color"
                isColor
              />
              <SearchableSelect
                label="Text Color"
                options={colors}
                value={atom.text_color}
                onChange={(value) => handlePropertyChange("text_color", value)}
                placeholder="Select color"
                isColor
              />
            </div>
          </div>
        );
      case "border":
        return (
          <div className="space-y-6">
            {/* Border Color and Width */}
            <div className="p-4 bg-background_main_container rounded-lg space-y-4">
              <h4 className="text-sm font-medium text-text_main_high mb-2">
                Border Settings
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <SearchableSelect
                  label="Border Color"
                  options={colors}
                  value={atom.border_color}
                  onChange={(value) =>
                    handlePropertyChange("border_color", value)
                  }
                  placeholder="Select color"
                  isColor
                />
                <div>
                  <label className="block text-sm font-medium text-text_main_high mb-2">
                    Border Width
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={atom.border_width}
                      onChange={handleBorderWidthChange}
                      className="block p-2 w-full rounded-md border-border_main_default bg-background_main_surface shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default pr-8"
                      placeholder="Enter number"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-text_main_medium text-sm">
                      px
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Border Radius */}
            <div className="p-4 bg-background_main_container rounded-lg space-y-4">
              <h4 className="text-sm font-medium text-text_main_high mb-2">
                Border Radius
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-4">
                  <SearchableSelect
                    label="Top Left"
                    options={RADIUS_OPTIONS}
                    value={atom.border_radius.top_left}
                    onChange={(value) =>
                      handlePropertyChange("top_left", value)
                    }
                    placeholder="Select radius"
                  />
                  <SearchableSelect
                    label="Bottom Left"
                    options={RADIUS_OPTIONS}
                    value={atom.border_radius.bottom_left}
                    onChange={(value) =>
                      handlePropertyChange("bottom_left", value)
                    }
                    placeholder="Select radius"
                  />
                </div>
                <div className="space-y-4">
                  <SearchableSelect
                    label="Top Right"
                    options={RADIUS_OPTIONS}
                    value={atom.border_radius.top_right}
                    onChange={(value) =>
                      handlePropertyChange("top_right", value)
                    }
                    placeholder="Select radius"
                  />
                  <SearchableSelect
                    label="Bottom Right"
                    options={RADIUS_OPTIONS}
                    value={atom.border_radius.bottom_right}
                    onChange={(value) =>
                      handlePropertyChange("bottom_right", value)
                    }
                    placeholder="Select radius"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`atom-builder ${
        inline ? "" : "bg-background_main_surface rounded-lg shadow-sm"
      }`}
    >
      <div className="p-6 border-b border-border_main_default">
        <h2 className="text-lg font-medium text-text_main_high">Create Atom</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text_main_high mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={atom.name}
                    onChange={(e) =>
                      handlePropertyChange("name", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-border_main_default bg-background_main_surface shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
                    placeholder="e.g., primary_button, header_text"
                  />
                </div>
                <div>
                  <SearchableSelect
                    label="Atom Type"
                    options={ATOM_TYPES}
                    value={atom.atom_type}
                    onChange={(value) => handleAtomTypeChange(value)}
                    placeholder="Select Type"
                  />
                </div>
              </div>

              {/* Properties */}
              {atom.atom_type && (
                <div className="space-y-4">
                  <div className="border-b border-border_main_default">
                    <nav className="-mb-px flex space-x-8">
                      {TABS.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          type="button"
                          className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                            ${
                              activeTab === tab.id
                                ? "border-button_filled_style_1_surface_default text-button_filled_style_1_surface_default"
                                : "border-transparent text-text_main_medium hover:text-text_main_high hover:border-border_main_default"
                            }
                          `}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                  {renderTabContent()}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() =>
                    setAtom({
                      ...emptyAtom,
                      id: generateUUID(),
                    })
                  }
                  className="px-4 py-2 text-sm font-medium text-text_main_high bg-background_main_surface border border-border_main_default rounded-md hover:bg-background_main_container"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-button_filled_style_3_text_default bg-button_filled_style_3_surface_default rounded-md hover:bg-button_filled_style_3_surface_hover"
                >
                  Save Atom
                </button>
              </div>
            </form>
          </div>

          {/* Preview and JSON */}
          <div className="col-span-4 space-y-4">
            {/* Preview section remains same */}
            <div className="bg-background_main_container rounded-lg p-4">
              <h3 className="text-sm font-medium text-text_main_high mb-4">
                Preview
              </h3>
              <div className="flex items-center justify-center min-h-[200px] border-2 border-dashed border-border_main_default rounded-lg bg-background_main_surface">
                {preview}
              </div>
            </div>

            {/* JSON Preview */}
            <div className="bg-background_main_container rounded-lg p-4">
              <h3 className="text-sm font-medium text-text_main_high mb-4">
                JSON Output
              </h3>
              <pre className="bg-background_main_surface p-4 rounded-lg overflow-auto max-h-[200px] text-xs">
                {JSON.stringify(getFinalAtom(), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtomBuilder;
