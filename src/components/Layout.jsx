import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { usePendingChanges } from '../contexts/PendingChangesContext';

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
  const { pendingChanges, applyChanges, discardChanges } = usePendingChanges();

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
    <div className="min-h-screen bg-background_main_default">
      {/* Top Navigation with title and Apply Changes button */}
      <nav className="bg-background_main_surface border-b border-border_main_default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-text_main_high">
              SDUI Schema Builder
            </h1>
            
            {/* Show Apply Changes and Discard buttons when there are pending changes */}
            {pendingChanges && (
              <div className="flex space-x-4">
                <button
                  onClick={discardChanges}
                  className="px-4 py-2 text-sm font-medium text-text_main_medium bg-background_main_surface border border-border_main_default rounded-md hover:bg-background_main_card transition-colors"
                >
                  Discard Changes
                </button>
                <button
                  onClick={applyChanges}
                  className="px-4 py-2 text-sm font-medium text-button_filled_style_2_text_icon_default bg-button_filled_style_2_surface_default rounded-md hover:bg-button_filled_style_2_surface_hover transition-colors"
                >
                  Apply Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation */}
        <div className="w-64 bg-background_main_surface border-r border-border_main_default">
          <div className="p-4 border-b border-border_main_default">
            <h2 className="text-lg font-medium text-text_main_high">Navigation</h2>
          </div>
          <nav className="space-y-1">
            {NAVIGATION_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium ${
                  currentSection === item.id
                    ? 'bg-button_filled_style_3_surface_default text-button_filled_style_3_text_default'
                    : 'text-text_main_medium hover:bg-background_main_hover hover:text-text_main_high'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3">
                    {/* Icon component based on item.icon */}
                  </span>
                  {item.label}
                </div>
                {getItemCount(item.id) > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-button_filled_style_1_surface_default text-button_filled_style_1_text_default">
                    {getItemCount(item.id)}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Section-specific sidebar content */}
          <div className="p-4 border-t border-border_main_default bg-background_main_container">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-text_main_high">
                {currentSection.charAt(0).toUpperCase() + currentSection.slice(1)}
              </h3>
              <button
                onClick={() => navigate(`/${currentSection}/new`)}
                className="w-full text-sm text-button_filled_style_3_text_default bg-button_filled_style_3_surface_default px-3 py-2 rounded-md hover:bg-button_filled_style_3_surface_hover"
              >
                + New {currentSection.slice(0, -1)}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-background_main_default p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout; 