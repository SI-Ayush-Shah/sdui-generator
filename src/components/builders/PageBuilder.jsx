import React, { useState } from 'react';
import { generateUUID } from '../../utils/uuid';

const PageBuilder = ({ onAdd, existingPages, existingTemplates, onUpdate, selectedPage }) => {
  const [page, setPage] = useState(selectedPage || {
    id: '',
    page_type: '',
    device: 'mobile',
    screen_name: '',
    force_back: '',
    theme: {
      main_theme: '',
      micro_theme: ''
    },
    meta: {
      language: 'en',
      keywords: '',
      meta_desc: '',
      browser_title: '',
      canonical_url: '',
      // ... other meta fields
    },
    templates: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPage) {
      onUpdate(selectedPage.id, page);
    } else {
      onAdd({
        ...page,
        id: generateUUID()
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          {selectedPage ? 'Edit Page' : 'Create New Page'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Screen Name</label>
            <input
              type="text"
              value={page.screen_name}
              onChange={(e) => setPage(prev => ({ ...prev, screen_name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Page Type</label>
            <input
              type="text"
              value={page.page_type}
              onChange={(e) => setPage(prev => ({ ...prev, page_type: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Meta Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Meta Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Browser Title</label>
              <input
                type="text"
                value={page.meta.browser_title}
                onChange={(e) => setPage(prev => ({
                  ...prev,
                  meta: { ...prev.meta, browser_title: e.target.value }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            {/* Add other meta fields */}
          </div>
        </div>

        {/* Templates Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900">Templates</h3>
            <button
              type="button"
              onClick={() => {/* Show template selection modal */}}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Add Template
            </button>
          </div>
          
          <div className="space-y-2">
            {page.templates?.map((template, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{template.template_type}</span>
                <button
                  type="button"
                  onClick={() => {/* Remove template */}}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {/* Reset form */}}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {selectedPage ? 'Update Page' : 'Create Page'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageBuilder; 