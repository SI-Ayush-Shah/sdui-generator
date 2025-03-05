import React from "react";
import AtomForm from "../forms/AtomForm";

const AtomBuilder = ({ onSubmit, onCancel }) => {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-text_main_high mb-6">
        Create New Atom
      </h2>
      <AtomForm onSubmit={onSubmit} onCancel={onCancel} mode="create" />
    </div>
  );
};

export default AtomBuilder;
