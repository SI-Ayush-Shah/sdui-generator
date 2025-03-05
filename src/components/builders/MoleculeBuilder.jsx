import React, { useState } from 'react';
import { emptyMolecule } from '../../constants/emptyStructures';
import { generateUUID } from '../../utils/uuid';
import TokenSelect from '../common/TokenSelect';
import ComponentSelectionModal from '../common/ComponentSelectionModal';
import AtomBuilder from './AtomBuilder';

const MOLECULE_TYPES = [
  { value: 'card', label: 'Card' },
  { value: 'button', label: 'Button' },
  { value: 'input', label: 'Input' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'media', label: 'Media' },
  { value: 'content', label: 'Content Block' }
];

const MoleculeBuilder = ({ onAdd, handleAddComponent, existingMolecules, existingAtoms, onUpdate, inline = false }) => {
  const [molecule, setMolecule] = useState(emptyMolecule);
  const [showAtomModal, setShowAtomModal] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...molecule,
      id: generateUUID()
    });
    setMolecule(emptyMolecule);
  };

  const handleAddAtom = (atomId) => {
    setMolecule(prev => ({
      ...prev,
      atoms: [...prev.atoms, atomId]
    }));
  };

  const handleStyleChange = (key, value, nestedKey = null) => {
    setMolecule(prev => ({
      ...prev,
      styles: {
        ...prev.styles,
        [key]: nestedKey 
          ? { ...prev.styles[key], [nestedKey]: value }
          : value
      }
    }));
  };

  const handleCreateAtom = (atom) => {
    handleAddComponent('atom', atom);
    handleAddAtom(atom.id);
    setShowAtomModal(false);
  };

  return (
    <div className="molecule-builder">
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setMolecule(emptyMolecule)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Clear Form
          </button>
          {existingMolecules.length > 0 && (
            <select
              onChange={(e) => {
                const selected = existingMolecules.find(m => m.id === e.target.value);
                if (selected) setMolecule(selected);
              }}
              className="text-sm border-gray-300 rounded-md"
            >
              <option value="">Load Molecule</option>
              {existingMolecules.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-lg shadow">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['basic', 'styles', 'atoms'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={molecule.name}
                    onChange={(e) => setMolecule({...molecule, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="e.g., profile_card, action_button"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Molecule Type</label>
                  <select
                    value={molecule.molecule_type}
                    onChange={(e) => setMolecule(prev => ({
                      ...prev,
                      molecule_type: e.target.value
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select Type</option>
                    {MOLECULE_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stack</label>
                  <select
                    value={molecule.properties?.stack}
                    onChange={(e) => setMolecule(prev => ({
                      ...prev,
                      properties: { ...prev.properties, stack: e.target.value }
                    }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select Stack</option>
                    <option value="h">Horizontal</option>
                    <option value="v">Vertical</option>
                    <option value="z">Z-Stack</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Interactive</label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={molecule.properties?.interactive}
                        onChange={(e) => setMolecule(prev => ({
                          ...prev,
                          properties: { ...prev.properties, interactive: e.target.checked }
                        }))}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Enable interactions</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'styles' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <TokenSelect
                  type="colors"
                  value={molecule.styles.background_color}
                  onChange={(value) => handleStyleChange('background_color', value)}
                  label="Background Color"
                />
                <TokenSelect
                  type="colors"
                  value={molecule.styles.text_color}
                  onChange={(value) => handleStyleChange('text_color', value)}
                  label="Text Color"
                />
                <TokenSelect
                  type="typography"
                  value={molecule.styles.font_family}
                  onChange={(value) => handleStyleChange('font_family', value)}
                  label="Font Family"
                />
                <TokenSelect
                  type="typography"
                  value={molecule.styles.font_size}
                  onChange={(value) => handleStyleChange('font_size', value)}
                  label="Font Size"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {['top', 'right', 'bottom', 'left'].map(direction => (
                  <TokenSelect
                    key={direction}
                    type="spacing"
                    value={molecule.styles.padding[direction]}
                    onChange={(value) => handleStyleChange('padding', value, direction)}
                    label={`Padding ${direction}`}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'atoms' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700">Atoms</h3>
                <button
                  type="button"
                  onClick={() => setShowAtomModal(true)}
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Atom
                </button>
              </div>

              <div className="space-y-2">
                {molecule.atoms?.map((atomId, index) => {
                  const atom = existingAtoms.find(a => a.id === atomId);
                  return (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full mr-2">
                          {atom?.atom_type || 'Atom'}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {atom?.name || 'Unknown Atom'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMolecule(prev => ({
                            ...prev,
                            atoms: prev.atoms.filter((_, i) => i !== index)
                          }));
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setMolecule(emptyMolecule)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Save Molecule
            </button>
          </div>
        </form>
      </div>

      {/* Atom Selection Modal */}
      {showAtomModal && (
        <ComponentSelectionModal
          title="Add Atom"
          existingComponents={existingAtoms}
          onSelect={(atomId) => {
            handleAddAtom(atomId);
            setShowAtomModal(false);
          }}
          onClose={() => setShowAtomModal(false)}
          componentType="atom"
          displayProperty="name"
          onCreateNew={
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Create New Atom</h4>
              <AtomBuilder
                onAdd={handleCreateAtom}
                existingAtoms={existingAtoms}
                inline={true}
              />
            </div>
          }
        />
      )}
    </div>
  );
};

export default MoleculeBuilder; 