import { useContext } from 'react';
import { TokenContext } from '../contexts/TokenContext';

export const useTokens = () => {
  const tokens = useContext(TokenContext);
  return {
    colors: Object.keys(tokens?.colors || {}),
    typography: Object.keys(tokens?.typography || {}),
    spacing: Object.keys(tokens?.spacing || {}),
    gradients: Object.keys(tokens?.gradients || {}),
    radius: Object.keys(tokens?.radius || {}),
    borders: Object.keys(tokens?.border || {})
  };
}; 