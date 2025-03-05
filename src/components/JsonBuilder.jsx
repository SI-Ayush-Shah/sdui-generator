import React, { useState, useEffect } from "react";
import {
  emptyTemplate,
  emptyOrganism,
  emptyMolecule,
  emptyAtom,
} from "../constants/emptyStructures";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/storage";
import { generateUUID } from "../utils/uuid";
import AtomBuilder from "./builders/AtomBuilder";
import MoleculeBuilder from "./builders/MoleculeBuilder";
import OrganismBuilder from "./builders/OrganismBuilder";
import TemplateBuilder from "./builders/TemplateBuilder";
import SchemaViewer from "./SchemaViewer";
import { TokenProvider } from "../contexts/TokenContext";
import json from "../sdui-schema.json";
import PageBuilder from "./builders/PageBuilder";

const NAVIGATION_ITEMS = [
  { id: "pages", label: "Pages", icon: "document" },
  { id: "templates", label: "Templates", icon: "template" },
  { id: "organisms", label: "Organisms", icon: "puzzle" },
  { id: "molecules", label: "Molecules", icon: "cube" },
  { id: "atoms", label: "Atoms", icon: "atom" },
];

const JsonBuilder = ({ existingJson }) => {
  const [mode, setMode] = useState("edit"); // 'edit' or 'view'
  const [jsonData, setJsonData] = useState(
    existingJson || {
      data: {
        components: {
          template: [],
          organism: json.data.components.organism,
          molecule: json.data.components.molecule,
          atom: json.data.components.atom,
        },
        tokens: json.data.tokens["40b949f1-5800-4025-8395-ed22bd52ccc6"],
        version: 1.01,
      },
      meta: {
        status: 200,
        timestamp: new Date().toISOString(),
        request_id: crypto.randomUUID(),
        execution_time_ms: 0,
        app_version: "1.0.0",
      },
    }
  );

  const [activeSection, setActiveSection] = useState("pages");
  const [selectedPage, setSelectedPage] = useState(null);

  useEffect(() => {
    if (!existingJson) {
      const savedData = loadFromLocalStorage("sdui-schema");
      if (savedData) {
        setJsonData(savedData);
      }
    }
  }, [existingJson]);

  useEffect(() => {
    saveToLocalStorage("sdui-schema", jsonData);
  }, [jsonData]);

  const handleAddComponent = (type, component) => {
    setJsonData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        components: {
          ...prev.data.components,
          [type]: [...prev.data.components[type], component],
        },
      },
    }));
  };

  const handleUpdateComponent = (type, index, component) => {
    setJsonData((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        components: {
          ...prev.data.components,
          [type]: prev.data.components[type].map((item, i) =>
            i === index ? component : item
          ),
        },
      },
    }));
  };

  const handleEdit = (type, component) => {
    const index = jsonData.data.components[type].findIndex(
      (item) => item.id === component.id
    );
    if (index !== -1) {
      // Switch to edit mode and scroll to the component
      setMode("edit");
      const element = document.querySelector(`#${type}-section`);
      element?.scrollIntoView({ behavior: "smooth" });
      // You might want to add some visual indication of which component is being edited
    }
  };

  const handleAddPage = (page) => {
    setJsonData((prev) => ({
      ...prev,
      pages: [...(prev.pages || []), page],
    }));
  };

  const handleUpdatePage = (index, page) => {
    setJsonData((prev) => ({
      ...prev,
      pages: prev.pages.map((item, i) => (i === index ? page : item)),
    }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case "pages":
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <PageBuilder
                onAdd={handleAddPage}
                existingPages={jsonData.pages || []}
                existingTemplates={jsonData.data.components.template}
                onUpdate={handleUpdatePage}
                selectedPage={selectedPage}
              />
            </div>
            <div className="col-span-4">
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Preview</h3>
                </div>
                <div className="p-4">
                  {selectedPage && <PagePreview page={selectedPage} />}
                </div>
              </div>
            </div>
          </div>
        );
      case "templates":
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <TemplateBuilder
                onAdd={(template) => handleAddComponent("template", template)}
                handleAddComponent={handleAddComponent}
                existingTemplates={jsonData.data.components.template || []}
                existingOrganisms={jsonData.data.components.organism || []}
                existingMolecules={jsonData.data.components.molecule || []}
                onUpdate={(index, template) =>
                  handleUpdateComponent("template", index, template)
                }
              />
            </div>
            <div className="col-span-4">{/* Template Preview */}</div>
          </div>
        );
      // ... cases for other sections
    }
  };

  return (
    <TokenProvider tokens={jsonData.data.tokens}>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                SDUI Schema Builder
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex rounded-md shadow-sm" role="group">
                  <button
                    onClick={() => setMode("edit")}
                    className={`px-4 py-2 text-sm font-medium ${
                      mode === "edit"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    } border border-gray-300 rounded-l-md`}
                  >
                    Edit Mode
                  </button>
                  <button
                    onClick={() => setMode("view")}
                    className={`px-4 py-2 text-sm font-medium ${
                      mode === "view"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    } border border-l-0 border-gray-300 rounded-r-md`}
                  >
                    View Mode
                  </button>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Import JSON
                </button>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                  Export JSON
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex h-[calc(100vh-4rem)]">
          <div className="w-64 bg-white border-r border-gray-200">
            <div className="p-4">
              <h2 className="text-lg font-medium text-gray-900">Navigation</h2>
            </div>
            <nav className="space-y-1">
              {NAVIGATION_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-4 py-2 text-sm font-medium ${
                    activeSection === item.id
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-3">
                    {/* Icon component based on item.icon */}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
            {activeSection === "pages" && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-900">Pages</h3>
                  <button
                    onClick={() => setSelectedPage(null)}
                    className="text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    + New Page
                  </button>
                </div>
                <div className="space-y-1">
                  {jsonData.pages?.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => setSelectedPage(page)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                        selectedPage?.id === page.id
                          ? "bg-indigo-50 text-indigo-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page.screen_name || page.id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto">
            <main className="p-8">{renderContent()}</main>
          </div>
        </div>
      </div>
    </TokenProvider>
  );
};

export default JsonBuilder;
