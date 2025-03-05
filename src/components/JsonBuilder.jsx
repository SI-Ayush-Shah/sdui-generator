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
import { useNavigate, useParams } from "react-router-dom";

const NAVIGATION_ITEMS = [
  { id: "pages", label: "Pages", icon: "document" },
  { id: "templates", label: "Templates", icon: "template" },
  { id: "organisms", label: "Organisms", icon: "puzzle" },
  { id: "molecules", label: "Molecules", icon: "cube" },
  { id: "atoms", label: "Atoms", icon: "atom" },
];

const JsonBuilder = ({ defaultSection = "pages" }) => {
  const navigate = useNavigate();
  const { pageId, templateId, organismId, moleculeId, atomId } = useParams();
  const [mode, setMode] = useState("edit");
  const [jsonData, setJsonData] = useState({
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
  });

  const [selectedPage, setSelectedPage] = useState(null);

  useEffect(() => {
    if (!defaultSection) {
      const savedData = loadFromLocalStorage("sdui-schema");
      if (savedData) {
        setJsonData(savedData);
      }
    }
  }, [defaultSection]);

  useEffect(() => {
    saveToLocalStorage("sdui-schema", jsonData);
  }, [jsonData]);

  useEffect(() => {
    // Load specific item based on ID if provided
    if (pageId) {
      const page = jsonData.pages?.find((p) => p.id === pageId);
      if (page) setSelectedPage(page);
    }
    // Similar for other types...
  }, [pageId, templateId, organismId, moleculeId, atomId]);

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
    navigate(`/pages/${page.id}`);
  };

  const handleUpdatePage = (index, page) => {
    setJsonData((prev) => ({
      ...prev,
      pages: prev.pages.map((item, i) => (i === index ? page : item)),
    }));
  };

  const renderContent = () => {
    switch (defaultSection) {
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
      case "atoms":
        return (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              <AtomBuilder
                onAdd={(atom) => handleAddComponent("atom", atom)}
                existingAtoms={jsonData.data.components.atom || []}
                onUpdate={(index, atom) =>
                  handleUpdateComponent("atom", index, atom)
                }
              />
            </div>
            <div className="col-span-4">
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Atoms List</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {jsonData.data.components.atom.map((atom, index) => (
                      <div
                        key={atom.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {atom.name}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {atom.atom_type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit("atom", atom)}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setJsonData((prev) => ({
                                ...prev,
                                data: {
                                  ...prev.data,
                                  components: {
                                    ...prev.data.components,
                                    atom: prev.data.components.atom.filter(
                                      (a) => a.id !== atom.id
                                    ),
                                  },
                                },
                              }));
                            }}
                            className="text-sm text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
            <div className="flex justify-end h-16 items-center">
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
        <div className="p-8">{renderContent()}</div>
      </div>
    </TokenProvider>
  );
};

export default JsonBuilder;
