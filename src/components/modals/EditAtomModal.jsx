import React from "react";
import { FiX } from "react-icons/fi";
import AtomForm from "../forms/AtomForm";
import { toast } from "react-hot-toast";

const EditAtomModal = ({ atom, onClose, onSave }) => {
  const handleSave = (updatedAtom) => {
    onSave(updatedAtom);
    toast.success("Atom updated successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#000]/50 flex items-center justify-center z-50">
      <div className="bg-background_main_surface rounded-lg shadow-xl w-[1000px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border_main_default flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text_main_high">
            Edit Atom: {atom.name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text_main_medium hover:text-text_main_high rounded-full hover:bg-background_main_hover"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <AtomForm
            initialData={atom}
            onSubmit={handleSave}
            onCancel={onClose}
            mode="edit"
          />
        </div>
      </div>
    </div>
  );
};

export default EditAtomModal;
