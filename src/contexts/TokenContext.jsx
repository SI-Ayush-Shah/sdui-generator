import React, { createContext } from 'react';

export const TokenContext = createContext(null);

export const TokenProvider = ({ children, tokens }) => {
  return (
    <TokenContext.Provider value={tokens}>
      {children}
    </TokenContext.Provider>
  );
}; 