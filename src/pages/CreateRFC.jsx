import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function CreateRFC({ onSubmit }) {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [formData, setFormData] = useState({});
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [templatesError, setTemplatesError] = useState("");

  // Pull templates from the backend when the page loads
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true);
        setTemplatesError("");

        const response = await fetch("/api/form-templates");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load templates");
        }

        setTemplates(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error(error);
        setTemplatesError(error.message || "Something went wrong while loading templates");
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  const selectedTemplate = useMemo(() => {
    return templates.find((template) => String(template.id) === String(selectedTemplateId)) || null;
  }, [templates, selectedTemplateId]);

  // When the selected template changes, build a fresh form state
  useEffect(() => {
    if (!selectedTemplate) {
      setFormData({});
      return;
    }

    const initialFields = {
      template_id: selectedTemplate.id,
      application: selectedTemplate.app_name,
    };

    (selectedTemplate.fields || []).forEach((field) => {
      if (!field?.name && field?.type !== "section") {
        return;
      }

      if (field.type === "image-upload" || field.type === "file-upload") {
        initialFields[field.name] = [];
      } else if (field.type === "checkbox") {
        initialFields[field.name] = false;
      } else {
        initialFields[field.name] = field.defaultValue ?? "";
      }
    });

    setFormData(initialFields);
  }, [selectedTemplate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const renderField = (field, index) => {
    const baseClass =
      "mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500";

    if (field.type === "section") {
      return (
        <div key={`section-${index}`} className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">{field.label || "Untitled Section"}</h3>
          {field.subtitle && (
            <p className="text-sm text-gray-500 mt-1">{field.subtitle}</p>
          )}
        </div>
      );
    }

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            rows="4"
            className={baseClass}
            placeholder={field.placeholder || ""}
            required={field.required}
          />
        );

      case "select":
        return (
          <select
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            className={baseClass}
            required={field.required}
          >
            <option value="">Select an option...</option>
            {(field.options || []).map((opt, idx) => {
              const value = typeof opt === "string" ? opt : opt.value;
              const label = typeof opt === "string" ? opt : opt.label;

              return (
                <option key={`${field.name}-${idx}`} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        );

      case "radio":
        return (
          <div className="mt-2 space-y-2">
            {(field.options || []).map((opt, idx) => {
              const value = typeof opt === "string" ? opt : opt.value;
              const label = typeof opt === "string" ? opt : opt.label;

              return (
                <label
                  key={`${field.name}-${idx}`}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={value}
                    checked={formData[field.name] === value}
                    onChange={handleChange}
                  />
                  {label}
                </label>
              );
            })}
          </div>
        );

      case "checkbox":
        return (
          <label className="mt-2 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name={field.name}
              checked={!!formData[field.name]}
              onChange={handleChange}
            />
            {field.placeholder || field.label || "Tick this option"}
          </label>
        );

      case "image-upload":
      case "file-upload": {
        const currentFiles = formData[field.name] || [];
        const isImageUpload = field.type === "image-upload";

        return (
          <div className="mt-1 space-y-3">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 font-semibold text-center px-4">
                    Click to add {field.multiple ? "files" : "a file"}
                  </p>
                </div>

                <input
                  type="file"
                  className="hidden"
                  accept={isImageUpload ? "image/*" : undefined}
                  multiple={!!field.multiple}
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || []);

                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: field.multiple
                        ? [...(prev[field.name] || []), ...newFiles]
                        : newFiles,
                    }));
                  }}
                />
              </label>
            </div>

            {currentFiles.length > 0 && (
              <div className={isImageUpload ? "grid grid-cols-3 gap-2 mt-3" : "space-y-2 mt-3"}>
                {currentFiles.map((file, fileIndex) => (
                  <div
                    key={fileIndex}
                    className={
                      isImageUpload
                        ? "relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-gray-100"
                        : "relative group rounded-lg border border-gray-200 bg-gray-50 p-3 flex items-center justify-between"
                    }
                  >
                    {isImageUpload ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm text-gray-700 truncate pr-8">{file.name}</span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const filtered = currentFiles.filter((_, i) => i !== fileIndex);
                        setFormData((prev) => ({
                          ...prev,
                          [field.name]: filtered,
                        }));
                      }}
                      className={
                        isImageUpload
                          ? "absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          : "ml-3 bg-red-500 text-white rounded-full p-1"
                      }
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      default:
        return (
          <input
            type={field.type || "text"}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            className={baseClass}
            placeholder={field.placeholder || ""}
            required={field.required}
          />
        );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTemplate) {
      alert("Please select a template first");
      return;
    }

    try {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        console.log("Submitting RFC data:", formData);
      }

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to submit RFC");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <PageHeader title="RFC Builder" subtitle="Create RFC" />

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700">1. Select Application</label>

          {loadingTemplates ? (
            <div className="mt-2 p-3 border rounded-lg bg-gray-50 text-gray-500">
              Loading templates...
            </div>
          ) : templatesError ? (
            <div className="mt-2 p-3 border border-red-200 rounded-lg bg-red-50 text-red-600">
              {templatesError}
            </div>
          ) : (
            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="mt-2 block w-full border-2 border-blue-500 rounded-lg p-3 bg-white font-medium"
            >
              <option value="">-- Choose Application --</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.app_name}
                </option>
              ))}
            </select>
          )}
        </div>

        {selectedTemplate && (
          <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-500">
            <h3 className="text-lg font-bold text-blue-600 border-b pb-2">
              {selectedTemplate.app_name} Configuration
            </h3>

            {(selectedTemplate.fields || []).map((field, index) => (
              <div key={field.name || `field-${index}`}>
                {field.type !== "section" && (
                  <label className="block text-sm font-semibold text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                {renderField(field, index)}
              </div>
            ))}

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 active:scale-95 transition"
              >
                Submit RFC
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
