import React, { createContext } from 'react';

export const TokenContext = createContext(null);

export const TokenProvider = ({ tokens, children }) => {
  const defaultTokens = {
    light: {
      background_main_surface: "#FFFFFF",
      background_main_container: "#F5F5F5",
      text_main_high: "#1A1A1A",
      text_main_medium: "#666666",
      text_main_low: "#999999",
      border_main_default: "#E5E5E5",
      button_filled_style_3_surface_default: "#0066CC",
      button_filled_style_3_text_default: "#FFFFFF",
      // ... add other necessary default tokens
    }
  };

  const mergedTokens = tokens || defaultTokens;

  return (
    <TokenContext.Provider value={mergedTokens}>
      {children}
    </TokenContext.Provider>
  );
}; 