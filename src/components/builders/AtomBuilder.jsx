import React, { useState } from "react";
import { generateUUID } from "../../utils/uuid";
import { Button, Text, Img, Badge } from "@sikit/ui";
import SearchableSelect from "../common/SearchableSelect";
import { extractColors } from "../../utils/colors";

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

const AtomBuilder = ({ onAdd, existingAtoms, onUpdate, inline = false }) => {
  const [atom, setAtom] = useState({
    id: "",
    name: "",
    atom_type: "",
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
  });
  const [activeTab, setActiveTab] = useState("basic");
  const [preview, setPreview] = useState(null);

  const colors = extractColors();

  const handleAtomTypeChange = (type) => {
    const selectedType = ATOM_TYPES.find((t) => t.value === type);
    setAtom((prev) => ({
      ...prev,
      atom_type: type,
      properties: selectedType?.defaultProps || {},
    }));
    updatePreview(type, selectedType?.defaultProps || {});
  };

  const updatePreview = (type, props) => {
    switch (type) {
      case "button":
        setPreview(
          <Button {...props} text={"demo Text"}>
            {props.label}
          </Button>
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
          <Badge variant={props.variant} size={props.size}>
            {props.content}
          </Badge>
        );
        break;
      default:
        setPreview(null);
    }
  };

  const handlePropertyChange = (property, value) => {
    const newProperties = {
      ...atom.properties,
      [property]: value,
    };
    setAtom((prev) => ({
      ...prev,
      properties: newProperties,
    }));
    updatePreview(atom.atom_type, newProperties);
  };

  const renderButtonProperties = () => (
    <div className="space-y-4">
      {/* Sub Variant and Size */}
      <div className="grid grid-cols-2 gap-4">
        <SearchableSelect
          label="Sub Variant"
          options={BUTTON_SUB_VARIANTS}
          value={atom.sub_variant}
          onChange={(value) =>
            setAtom((prev) => ({ ...prev, sub_variant: value }))
          }
        />
        <SearchableSelect
          label="Size"
          options={SIZES.map((size) => ({
            value: size,
            label: size,
          }))}
          value={atom.size}
          onChange={(value) => setAtom((prev) => ({ ...prev, size: value }))}
          placeholder="Select Size"
        />
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <SearchableSelect
          label="Background Color"
          options={colors}
          value={atom.background_color}
          onChange={(value) =>
            setAtom((prev) => ({ ...prev, background_color: value }))
          }
          placeholder="Select color"
          isColor
        />
        <SearchableSelect
          label="Text Color"
          options={colors}
          value={atom.text_color}
          onChange={(value) =>
            setAtom((prev) => ({ ...prev, text_color: value }))
          }
          placeholder="Select color"
          isColor
        />
      </div>

      {/* Border Properties */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <SearchableSelect
            label="Border Color"
            options={colors}
            value={atom.border_color}
            onChange={(value) =>
              setAtom((prev) => ({ ...prev, border_color: value }))
            }
            placeholder="Select color"
            isColor
          />
          <div>
            <label className="block text-sm font-medium text-text_main_high">
              Border Width
            </label>
            <input
              type="text"
              value={atom.border_width}
              onChange={(e) =>
                setAtom((prev) => ({ ...prev, border_width: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
              placeholder="1px"
            />
          </div>
        </div>

        {/* Border Radius */}
        <div>
          <label className="block text-sm font-medium text-text_main_high mb-1">
            Border Radius
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={atom.border_radius.top_left}
              onChange={(e) =>
                setAtom((prev) => ({
                  ...prev,
                  border_radius: {
                    ...prev.border_radius,
                    top_left: e.target.value,
                  },
                }))
              }
              className="block w-full rounded-tl-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
              placeholder="Top Left"
            />
            <input
              type="text"
              value={atom.border_radius.top_right}
              onChange={(e) =>
                setAtom((prev) => ({
                  ...prev,
                  border_radius: {
                    ...prev.border_radius,
                    top_right: e.target.value,
                  },
                }))
              }
              className="block w-full rounded-tr-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
              placeholder="Top Right"
            />
            <input
              type="text"
              value={atom.border_radius.bottom_left}
              onChange={(e) =>
                setAtom((prev) => ({
                  ...prev,
                  border_radius: {
                    ...prev.border_radius,
                    bottom_left: e.target.value,
                  },
                }))
              }
              className="block w-full rounded-bl-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
              placeholder="Bottom Left"
            />
            <input
              type="text"
              value={atom.border_radius.bottom_right}
              onChange={(e) =>
                setAtom((prev) => ({
                  ...prev,
                  border_radius: {
                    ...prev.border_radius,
                    bottom_right: e.target.value,
                  },
                }))
              }
              className="block w-full rounded-br-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
              placeholder="Bottom Right"
            />
          </div>
        </div>
      </div>

      {/* Other Properties */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="full_width"
          checked={atom.full_width}
          onChange={(e) =>
            setAtom((prev) => ({ ...prev, full_width: e.target.checked }))
          }
          className="h-4 w-4 text-text_main_high focus:ring-button_filled_style_1_surface_default border-border_main_default rounded"
        />
        <label
          htmlFor="full_width"
          className="ml-2 block text-sm text-text_main_high"
        >
          Full Width
        </label>
      </div>

      {/* Icons (conditionally rendered based on sub_variant) */}
      {(atom.sub_variant === "leading_icon" ||
        atom.sub_variant === "icon_text_icon") && (
        <div>
          <label className="block text-sm font-medium text-text_main_high">
            Leading Icon
          </label>
          <input
            type="text"
            value={atom.leading_icon}
            onChange={(e) =>
              setAtom((prev) => ({ ...prev, leading_icon: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
            placeholder="Icon name or URL"
          />
        </div>
      )}

      {(atom.sub_variant === "trailing_icon" ||
        atom.sub_variant === "icon_text_icon") && (
        <div>
          <label className="block text-sm font-medium text-text_main_high">
            Trailing Icon
          </label>
          <input
            type="text"
            value={atom.trailing_icon}
            onChange={(e) =>
              setAtom((prev) => ({ ...prev, trailing_icon: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
            placeholder="Icon name or URL"
          />
        </div>
      )}
    </div>
  );

  const renderProperties = () => {
    switch (atom.atom_type) {
      case "button":
        return renderButtonProperties();
      case "text":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text_main_high">
                Variant
              </label>
              <select
                value={atom.properties.variant}
                onChange={(e) =>
                  handlePropertyChange("variant", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
              >
                {TEXT_VARIANTS.map((variant) => (
                  <option key={variant} value={variant}>
                    {variant}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text_main_high">
                Content
              </label>
              <textarea
                value={atom.properties.content}
                onChange={(e) =>
                  handlePropertyChange("content", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
                rows={3}
              />
            </div>
          </div>
        );
      case "image":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text_main_high">
                Source
              </label>
              <input
                type="text"
                value={atom.properties.src}
                onChange={(e) => handlePropertyChange("src", e.target.value)}
                className="mt-1 block w-full rounded-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
                placeholder="Image URL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text_main_high">
                Alt Text
              </label>
              <input
                type="text"
                value={atom.properties.alt}
                onChange={(e) => handlePropertyChange("alt", e.target.value)}
                className="mt-1 block w-full rounded-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
                placeholder="Alternative text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text_main_high">
                Width
              </label>
              <input
                type="text"
                value={atom.properties.width}
                onChange={(e) => handlePropertyChange("width", e.target.value)}
                className="mt-1 block w-full rounded-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
                placeholder="Width"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text_main_high">
                Height
              </label>
              <input
                type="text"
                value={atom.properties.height}
                onChange={(e) => handlePropertyChange("height", e.target.value)}
                className="mt-1 block w-full rounded-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
                placeholder="Height"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text_main_high">
                Fit
              </label>
              <select
                value={atom.properties.fit}
                onChange={(e) => handlePropertyChange("fit", e.target.value)}
                className="mt-1 block w-full rounded-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
                <option value="none">None</option>
                <option value="scale-down">Scale Down</option>
              </select>
            </div>
          </div>
        );
      case "badge":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text_main_high">
                Variant
              </label>
              <select
                value={atom.properties.variant}
                onChange={(e) =>
                  handlePropertyChange("variant", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
              >
                {BADGE_VARIANTS.map((variant) => (
                  <option key={variant} value={variant}>
                    {variant}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text_main_high">
                Content
              </label>
              <input
                type="text"
                value={atom.properties.content}
                onChange={(e) =>
                  handlePropertyChange("content", e.target.value)
                }
                className="mt-1 block w-full rounded-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text_main_high">
                Size
              </label>
              <select
                value={atom.properties.size}
                onChange={(e) => handlePropertyChange("size", e.target.value)}
                className="mt-1 block w-full rounded-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
              >
                {SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
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
        inline ? "" : "bg-background_main_surface rounded-lg shadow"
      }`}
    >
      <div className="p-6 border-b border-border_main_default">
        <h2 className="text-lg font-medium text-text_main_high">Create Atom</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <form className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text_main_high">
                    Name
                  </label>
                  <input
                    type="text"
                    value={atom.name}
                    onChange={(e) =>
                      setAtom((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="mt-1 block w-full rounded-md border-border_main_default shadow-sm focus:border-button_filled_style_1_surface_default focus:ring-button_filled_style_1_surface_default"
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
                  <h3 className="text-sm font-medium text-text_main_high">
                    Properties
                  </h3>
                  {renderProperties()}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() =>
                    setAtom({ id: "", name: "", atom_type: "", properties: {} })
                  }
                  className="px-4 py-2 text-sm font-medium text-text_main_high bg-background_main_surface border border-border_main_default rounded-md hover:bg-background_main_container"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-text_prim_high bg-button_filled_style_1_surface_default rounded-md hover:bg-button_filled_style_1_surface_hover"
                >
                  Save Atom
                </button>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="col-span-4">
            <div className="bg-background_main_container rounded-lg p-4">
              <h3 className="text-sm font-medium text-text_main_high mb-4">
                Preview
              </h3>
              <div className="flex items-center justify-center min-h-[200px] border-2 border-dashed border-border_main_default rounded-lg">
                {preview}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtomBuilder;
