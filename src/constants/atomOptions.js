export const ATOM_TYPES = [
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
  // ... other atom types
];

export const BUTTON_SUB_VARIANTS = [
  { value: "only_text", label: "Only Text" },
  { value: "leading_icon", label: "Leading Icon" },
  { value: "trailing_icon", label: "Trailing Icon" },
  { value: "icon_text_icon", label: "Icon Text Icon" },
  { value: "only_icon", label: "Only Icon" },
];

export const RADIUS_OPTIONS = [
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

export const TYPOGRAPHY_OPTIONS = [
  { value: "dp_1_black", label: "dp_1_black" },
  { value: "dp_1_bold", label: "dp_1_bold" },
  // ... other typography options
];

export const SIZES = ["small", "medium", "large"]; 