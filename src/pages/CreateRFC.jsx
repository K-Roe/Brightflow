import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

// This is our source of truth. Later on update to an api call from the backend
// for a fetch() call to pull these configs from the database.
const FORM_SCHEMAS = {
  "Bright Speak": [
    { name: "title", label: "RFC Title", type: "text", placeholder: "e.g. Update Audio API", required: true },
    { name: "priority", label: "Urgency", type: "select", options: ["Low", "Normal", "Emergency"] },
    { name: "impact", label: "User Impact", type: "select", options: ["None", "Minor", "Critical"] },
    { name: "description", label: "RFC Description", type: "textarea" },
    { name: "areaImage", label: "Photo of the Area/Issue", type: "image-upload", multiple: true },
  ],
  "Bright Flow": [
    { name: "title", label: "RFC Title", type: "text", placeholder: "e.g. DB Migration", required: true },
    { name: "priority", label: "Urgency", type: "select", options: ["Low", "Normal", "Emergency"] },
    { name: "impact", label: "User Impact", type: "select", options: ["None", "Minor", "Critical"] },
    { name: "description", label: "RFC Description", type: "textarea" },
    { name: "areaImage", label: "Photo of the Area/Issue", type: "image-upload", multiple: false },
  ],
};

export default function CreateRFC({ onSubmit }) {
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState("");
  const [formData, setFormData] = useState({});

  // When the app changes, we need to wipe the old form data and 
  // setup the keys for the new application's fields.
  useEffect(() => {
    if (selectedApp) {
      const initialFields = { application: selectedApp };
      FORM_SCHEMAS[selectedApp].forEach((field) => {
        initialFields[field.name] = field.defaultValue || (field.type === 'image-upload' ? [] : "");
      });
      setFormData(initialFields);
    }
  }, [selectedApp]);

  // Generic handler so we don't have to write 50 different functions.
  // It just grabs the name of the input and updates that key in our state object.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // This is the engine that actually builds the UI. 
  // It looks at the "type" in our schema and spits out the right React component.
  const renderField = (field) => {
    const baseClass = "mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            rows="4"
            className={baseClass}
          />
        );

      case "select":
        return (
          <select
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            className={baseClass}
          >
            <option value="">Select an option...</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case "image-upload":
        const currentFiles = formData[field.name] || [];

        return (
          <div className="mt-1 space-y-3">
            {/* The actual "Click to Upload" box */}
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 font-semibold text-center px-4">
                    Click to add {field.multiple ? "photos" : "a photo"}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple={field.multiple}
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files);
                    setFormData((prev) => ({
                      ...prev,
                      // If it's a multi-upload, we append to the array. 
                      // If not, we just replace the whole array with the single new file.
                      [field.name]: field.multiple ? [...(prev[field.name] || []), ...newFiles] : newFiles,
                    }));
                  }}
                />
              </label>
            </div>

            {/* Gallery view: Shows small previews of what staff just uploaded */}
            {currentFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-3">
                {currentFiles.map((file, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-100">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    {/* Trash button to remove specific photos if they uploaded the wrong one */}
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = currentFiles.filter((_, i) => i !== index);
                        setFormData((prev) => ({ ...prev, [field.name]: filtered }));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        // Basic inputs (text, date, etc.) all use this default render
        return (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            className={baseClass}
            placeholder={field.placeholder}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PageHeader title="RFC Builder" subtitle="Dynamic request generator" />

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        {/* Step 1: Picking the App. Everything else stays hidden until this is picked. */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700">1. Select Application</label>
          <select
            value={selectedApp}
            onChange={(e) => setSelectedApp(e.target.value)}
            className="mt-2 block w-full border-2 border-blue-500 rounded-lg p-3 bg-white font-medium"
          >
            <option value="">-- Choose Application --</option>
            {Object.keys(FORM_SCHEMAS).map((app) => (
              <option key={app} value={app}>{app}</option>
            ))}
          </select>
        </div>

        {/* Step 2: The actual form generated from the schema above */}
        {selectedApp && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(formData);
              navigate("/");
            }}
            className="space-y-4 animate-in fade-in duration-500"
          >
            <h3 className="text-lg font-bold text-blue-600 border-b pb-2">
              {selectedApp} Configuration
            </h3>

            {FORM_SCHEMAS[selectedApp].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-700">
                  {field.label}
                </label>
                {renderField(field)}
              </div>
            ))}

            <div className="flex gap-4 pt-6">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 active:scale-95 transition">
                Submit RFC
              </button>
              <button type="button" onClick={() => navigate("/")} className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}