import json from "../sdui-schema.json";

export const extractColors = () => {
  try {
    // Get all tokens
    const tokens = json.data.tokens;
    
    // If tokens is directly an object with light property
    if (tokens?.light) {
      return processTokens(tokens.light);
    }
    
    // If tokens is nested under an ID
    const tokenId = Object.keys(tokens || {})[0];
    if (tokens?.[tokenId]?.light) {
      return processTokens(tokens[tokenId].light);
    }

    // If no valid tokens found, return default colors
    return getDefaultColors();
  } catch (error) {
    console.error('Error extracting colors:', error);
    return getDefaultColors();
  }
};

const processTokens = (tokenSet) => {
  return Object.entries(tokenSet)
    .filter(([key]) => 
      key.includes('color') || 
      key.includes('background') || 
      key.includes('button') || 
      key.includes('text') || 
      key.includes('border')
    )
    .map(([key]) => ({
      value: key,
      label: key.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      category: key.split('_')[0].toUpperCase(),
    }))
    .sort((a, b) => {
      if (a.category === b.category) {
        return a.label.localeCompare(b.label);
      }
      return a.category.localeCompare(b.category);
    });
};

const getDefaultColors = () => [
  { value: 'background_main_surface', label: 'Background Main Surface', category: 'BACKGROUND' },
  { value: 'background_main_container', label: 'Background Main Container', category: 'BACKGROUND' },
  { value: 'text_main_high', label: 'Text Main High', category: 'TEXT' },
  { value: 'text_main_medium', label: 'Text Main Medium', category: 'TEXT' },
  { value: 'text_main_low', label: 'Text Main Low', category: 'TEXT' },
  { value: 'border_main_default', label: 'Border Main Default', category: 'BORDER' },
  { value: 'button_filled_style_3_surface_default', label: 'Button Filled Style 3 Surface Default', category: 'BUTTON' },
  { value: 'button_filled_style_3_text_default', label: 'Button Filled Style 3 Text Default', category: 'BUTTON' },
];

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
  try {
    const tokens = json.data.tokens;
    
    // If tokens is directly an object with light property
    if (tokens?.light?.[tokenName]) {
      return tokens.light[tokenName];
    }
    
    // If tokens is nested under an ID
    const tokenId = Object.keys(tokens || {})[0];
    if (tokens?.[tokenId]?.light?.[tokenName]) {
      return tokens[tokenId].light[tokenName];
    }
    
    return null;
  } catch (error) {
    console.error('Error getting color by token:', error);
    return null;
  }
};
