import React, { useState } from "react";
import AtomForm from "../forms/AtomForm";

const defaultAtomData = {
  id: crypto.randomUUID(),
  name: "",
  atom_type: "button",
  typography: "",
  size: "medium",
  variant: "primary",
  sub_variant: "only_text",
  background_color: "",
  text_color: "",
  border_width: "",
  border_radius: {
    top_left: "",
    top_right: "",
    bottom_left: "",
    bottom_right: "",
  },
  border_color: "",
  gradient: "",
};

const AtomBuilder = ({ onSubmit, onCancel, existingAtoms, inline = false }) => {
  const [atomData, setAtomData] = useState(defaultAtomData);

  const handleClearForm = () => {
    setAtomData(defaultAtomData);
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
            onSubmit={onSubmit}
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
