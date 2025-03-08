import React, { useState } from "react";
import AtomForm from "../forms/AtomForm";
import { useNavigate } from "react-router-dom";

// Import createEmptyAtom from AtomForm
import { createEmptyAtom } from "../forms/AtomForm";

const AtomBuilder = ({ onAdd, onSubmit, onCancel, existingAtoms, inline = false }) => {
  const [atomData, setAtomData] = useState(createEmptyAtom());
  const navigate = useNavigate();

  const handleClearForm = () => {
    setAtomData(createEmptyAtom());
  };

  // Use onAdd if provided, otherwise fall back to onSubmit
  const handleFormSubmit = (data) => {
    try {
      // Create a copy of the data to avoid mutating the original
      const atomData = { ...data };
      
      // Set a flag to indicate this update should not trigger a refresh
      const shouldRefresh = false;
      
      // First call the appropriate handler with the shouldRefresh flag
      if (onAdd) {
        onAdd(atomData, shouldRefresh);
      } else if (onSubmit) {
        onSubmit(atomData, shouldRefresh);
      } else {
        console.warn("Neither onAdd nor onSubmit prop provided to AtomBuilder");
        return; // Don't navigate if no handler was called
      }
      
      // Only navigate if we're not in inline mode and a handler was successfully called
      if (!inline) {
        // Use setTimeout to ensure this runs after any other synchronous code
        setTimeout(() => {
          navigate("/atoms");
        }, 0);
      }
    } catch (error) {
      console.error("Error in handleFormSubmit:", error);
    }
    
    // Return false to prevent any default behavior
    return false;
  };

  return (
    <div
      className={`${
        inline ? "" : "bg-background_main_container rounded-lg p-6"
      }`}
    >
      <div
        className={`${inline ? "" : "mb-6 flex items-center justify-between"}`}
      >
        {!inline && (
          <>
            <h2 className="text-xl font-semibold text-text_main_high">
              Atom Builder
            </h2>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleClearForm}
                className="px-3 py-2 text-sm text-text_main_medium hover:text-text_main_high border border-border_main_default rounded-md bg-background_main_surface hover:bg-background_main_card transition-colors"
              >
                Clear Form
              </button>
            </div>
          </>
        )}
      </div>

      <div
        className={`${
          inline
            ? ""
            : "bg-background_main_surface rounded-lg shadow-sm border border-border_main_default overflow-hidden"
        }`}
      >
        {!inline && (
          <div className="border-b border-border_main_default bg-background_main_card px-6 py-3">
            <h3 className="text-sm font-medium text-text_main_high">
              Atom Details
            </h3>
          </div>
        )}

        <div className={`${inline ? "" : "p-6"}`}>
          <AtomForm
            onSubmit={handleFormSubmit}
            onCancel={onCancel}
            mode="create"
            inline={inline}
            initialData={atomData}
            onReset={handleClearForm}
          />
        </div>
      </div>
    </div>
  );
};

export default AtomBuilder;
