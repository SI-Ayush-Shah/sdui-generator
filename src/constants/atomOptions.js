import json from "../sdui-schema.json";
export const ATOM_TYPES = [
  {
    value: "button",
    label: "Button"
  },
  {
    value: "badge",
    label: "Badge"
  },
  {
    value: "img",
    label: "Img"
  },
  {
    value: "text",
    label: "Text"
  }
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

export const TYPOGRAPHY_OPTIONS = Object.keys(
  json.data.tokens["40b949f1-5800-4025-8395-ed22bd52ccc6"].typography_desktop
).map((key) => ({
  value: key,
  label: key,
}));

export const SIZES = ["small", "medium", "large"];
export const RATIO_OPTIONS = [
  "1:1",
  "16:9",
  "4:3",
  "3:4",
  "9:16",
  "1:2",
  "2:1",
];
export const GRADIENT_OPTIONS = Object.keys(
  json.data.tokens["40b949f1-5800-4025-8395-ed22bd52ccc6"].gradient.light
);
export const COLOR_OPTIONS = Object.keys(
  json.data.tokens["40b949f1-5800-4025-8395-ed22bd52ccc6"].color.light
);
export const SPACING_OPTIONS = Object.keys(
  json.data.tokens["40b949f1-5800-4025-8395-ed22bd52ccc6"].spacing
);
