import React from 'react';
import { useTokens } from '../../hooks/useTokens';

const TokenSelect = ({ 
  type, 
  value, 
  onChange, 
  label,
  allowEmpty = true,
  className = "" 
}) => {
  const tokens = useTokens();
  const options = tokens[type] || [];

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        {allowEmpty && <option value="">None</option>}
        {options.map(token => (
          <option key={token} value={token}>
            {token}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TokenSelect; 