import React from 'react';

const ComponentNode = ({ type, data, components, onEdit }) => {
  const getConnectedComponents = () => {
    if (type === 'template') {
      return data.composition?.map(item => 
        components.organism.find(org => org.id === item.id)
      ).filter(Boolean) || [];
    }
    if (type === 'organism') {
      return data.composition?.map(item => {
        if (item.component_type === 'organism') {
          return components.organism.find(org => org.id === item.id);
        }
        return components.molecule.find(mol => mol.id === item.id);
      }).filter(Boolean) || [];
    }
    if (type === 'molecule') {
      return data.atoms?.map(atomId => 
        components.atom.find(atom => atom.id === atomId)
      ).filter(Boolean) || [];
    }
    return [];
  };

  const connectedComponents = getConnectedComponents();

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{data.name || data.template_type || data.atom_type}</h3>
          <p className="text-sm text-gray-500">{type}</p>
        </div>
        <button
          onClick={() => onEdit(type, data)}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Edit
        </button>
      </div>

      {connectedComponents.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Connected Components</h4>
          <div className="pl-4 border-l-2 border-gray-200 space-y-3">
            {connectedComponents.map((component, index) => (
              <ComponentNode
                key={index}
                type={component.atom_type ? 'atom' : component.name?.includes('molecule') ? 'molecule' : 'organism'}
                data={component}
                components={components}
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const SchemaViewer = ({ schema, onEdit }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Schema Structure</h2>
        <div className="flex space-x-2">
          <button className="text-sm bg-white border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50">
            Expand All
          </button>
          <button className="text-sm bg-white border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50">
            Collapse All
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {schema.data.components.template.map((template, index) => (
          <ComponentNode
            key={index}
            type="template"
            data={template}
            components={schema.data.components}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default SchemaViewer; 