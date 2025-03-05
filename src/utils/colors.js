import schema from "../sdui-schema.json";

export const extractColors = () => {
  const tokens = schema.data.tokens;
  const tokenId = Object.keys(tokens)[0];
  const tokenSet = tokens[tokenId].color.light;
  // console.log("tokenset", Object.keys(tokenSet));
  return Object.keys(tokenSet)
    .filter(
      (key) =>
        key.startsWith("color_") ||
        key.startsWith("background_") ||
        key.startsWith("button_")
    )
    .map((key) => ({
      value: key, // Use the key as the value
      label: key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
      category: key.split("_")[0].toUpperCase(),
    }))
    .sort((a, b) => {
      if (a.category === b.category) {
        return a.label.localeCompare(b.label);
      }
      return a.category.localeCompare(b.category);
    });
};

// Helper function to group colors by their main categories
export const getColorsByCategory = () => {
  const colors = extractColors();
  return colors.reduce((acc, color) => {
    const category = color.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(color);
    return acc;
  }, {});
};

// Helper function to get color value by token name
export const getColorByToken = (tokenName) => {
  const tokens = schema.data.tokens;
  const tokenId = Object.keys(tokens)[0];
  const tokenSet = tokens[tokenId];
  return tokenSet[tokenName] || null;
};
