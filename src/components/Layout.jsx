import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const NAVIGATION_ITEMS = [
  { id: 'pages', label: 'Pages', icon: 'document', path: '/pages' },
  { id: 'templates', label: 'Templates', icon: 'template', path: '/templates' },
  { id: 'organisms', label: 'Organisms', icon: 'puzzle', path: '/organisms' },
  { id: 'molecules', label: 'Molecules', icon: 'cube', path: '/molecules' },
  { id: 'atoms', label: 'Atoms', icon: 'atom', path: '/atoms' },
];

const Layout = ({ jsonData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentSection = location.pathname.split('/')[1] || 'pages';

  const getItemCount = (section) => {
    switch (section) {
      case 'atoms':
        return jsonData?.data?.components?.atom?.length || 0;
      // ... other cases
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation with title */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              SDUI Schema Builder
            </h1>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-white border-r border-gray-200">
          <div className="p-4">
            <h2 className="text-lg font-medium text-gray-900">Navigation</h2>
          </div>
          <nav className="space-y-1">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium ${
                  currentSection === item.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3">
                    {/* Icon component based on item.icon */}
                  </span>
                  {item.label}
                </div>
                {getItemCount(item.id) > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {getItemCount(item.id)}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Section-specific sidebar content */}
          {currentSection === 'pages' && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-900">Pages</h3>
                <button
                  onClick={() => navigate('/pages/new')}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  + New Page
                </button>
              </div>
              {/* Page list will be managed by JsonBuilder */}
            </div>
          )}

          {currentSection === 'atoms' && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-900">Atoms</h3>
                <button
                  onClick={() => navigate('/atoms/new')}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  + New Atom
                </button>
              </div>
              {/* Atom list will be managed by JsonBuilder */}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout; 