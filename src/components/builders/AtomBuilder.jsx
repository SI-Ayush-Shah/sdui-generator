import React, { useState } from 'react';
import { generateUUID } from '../../utils/uuid';
import { Button, Text, Image, Badge } from '@sikit/ui';

const ATOM_TYPES = [
  { 
    value: 'button', 
    label: 'Button',
    defaultProps: {
      variant: 'primary',
      size: 'medium',
      label: 'Button Text',
      isDisabled: false,
      isFullWidth: false
    }
  },
  { 
    value: 'text', 
    label: 'Text',
    defaultProps: {
      variant: 'body1',
      color: 'primary',
      content: 'Text content'
    }
  },
  { 
    value: 'image', 
    label: 'Image',
    defaultProps: {
      src: '',
      alt: '',
      width: 'auto',
      height: 'auto',
      fit: 'cover'
    }
  },
  { 
    value: 'badge', 
    label: 'Badge',
    defaultProps: {
      variant: 'default',
      content: 'Badge Text',
      size: 'medium'
    }
  }
];

const BUTTON_VARIANTS = ['primary', 'secondary', 'tertiary', 'ghost', 'danger'];
const TEXT_VARIANTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body1', 'body2', 'caption'];
const BADGE_VARIANTS = ['default', 'success', 'warning', 'error', 'info'];
const SIZES = ['small', 'medium', 'large'];

const AtomBuilder = ({ onAdd, existingAtoms, onUpdate, inline = false }) => {
  const [atom, setAtom] = useState({
    id: '',
    name: '',
    atom_type: '',
    properties: {}
  });
  const [activeTab, setActiveTab] = useState('basic');
  const [preview, setPreview] = useState(null);

  const handleAtomTypeChange = (type) => {
    const selectedType = ATOM_TYPES.find(t => t.value === type);
    setAtom(prev => ({
      ...prev,
      atom_type: type,
      properties: selectedType?.defaultProps || {}
    }));
    updatePreview(type, selectedType?.defaultProps || {});
  };

  const updatePreview = (type, props) => {
    switch (type) {
      case 'button':
        setPreview(
          <Button
            variant={props.variant}
            size={props.size}
            disabled={props.isDisabled}
            fullWidth={props.isFullWidth}
          >
            {props.label}
          </Button>
        );
        break;
      case 'text':
        setPreview(
          <Text variant={props.variant} color={props.color}>
            {props.content}
          </Text>
        );
        break;
      case 'image':
        setPreview(
          <Image
            src={props.src || 'https://via.placeholder.com/150'}
            alt={props.alt}
            width={props.width}
            height={props.height}
            objectFit={props.fit}
          />
        );
        break;
      case 'badge':
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
      [property]: value
    };
    setAtom(prev => ({
      ...prev,
      properties: newProperties
    }));
    updatePreview(atom.atom_type, newProperties);
  };

  const renderProperties = () => {
    switch (atom.atom_type) {
      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Variant</label>
              <select
                value={atom.properties.variant}
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {BUTTON_VARIANTS.map(variant => (
                  <option key={variant} value={variant}>{variant}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Label</label>
              <input
                type="text"
                value={atom.properties.label}
                onChange={(e) => handlePropertyChange('label', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <select
                value={atom.properties.size}
                onChange={(e) => handlePropertyChange('size', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {SIZES.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={atom.properties.isDisabled}
                  onChange={(e) => handlePropertyChange('isDisabled', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Disabled</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={atom.properties.isFullWidth}
                  onChange={(e) => handlePropertyChange('isFullWidth', e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-700">Full Width</span>
              </label>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Variant</label>
              <select
                value={atom.properties.variant}
                onChange={(e) => handlePropertyChange('variant', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {TEXT_VARIANTS.map(variant => (
                  <option key={variant} value={variant}>{variant}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={atom.properties.content}
                onChange={(e) => handlePropertyChange('content', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
              />
            </div>
          </div>
        );

      // ... similar sections for Image and Badge ...
    }
  };

  return (
    <div className={`atom-builder ${inline ? '' : 'bg-white rounded-lg shadow'}`}>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Create Atom</h2>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <form className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={atom.name}
                    onChange={(e) => setAtom(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., primary_button, header_text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Atom Type</label>
                  <select
                    value={atom.atom_type}
                    onChange={(e) => handleAtomTypeChange(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select Type</option>
                    {ATOM_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Properties */}
              {atom.atom_type && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Properties</h3>
                  {renderProperties()}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAtom({ id: '', name: '', atom_type: '', properties: {} })}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Save Atom
                </button>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="col-span-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Preview</h3>
              <div className="flex items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg">
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