import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function FormArchitect() {
  const navigate = useNavigate();
  const [appName, setAppName] = useState("");
  const [fields, setFields] = useState([
    { name: "title", label: "RFC Title", type: "text", required: true, options: "", subtitle: "" }
  ]);

  const addField = () => {
    setFields([
      ...fields,
      {
        name: "",
        label: "",
        type: "text",
        required: false,
        options: "",
        subtitle: "",
        placeholder: "",
      },
    ]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;

    if (key === "label" && updated[index].type !== "section") {
      updated[index].name = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "_");
    }

    if (key === "type") {
      if (value === "section") {
        updated[index].required = false;
        updated[index].options = "";
        updated[index].name = "";
      }

      if (value !== "select" && value !== "radio") {
        updated[index].options = "";
      }
    }

    setFields(updated);
  };

  const handleSave = async () => {
    if (!appName.trim()) {
      alert("Give the application a name first!");
      return;
    }

    const formData = {
      app_name: appName,
      fields: fields.map((field) => ({
        name: field.type === "section" ? null : field.name,
        label: field.label,
        subtitle: field.subtitle || null,
        type: field.type,
        required: field.type === "section" ? false : field.required ?? false,
        placeholder: field.placeholder || null,
        options:
          field.type === "select" || field.type === "radio"
            ? (field.options || "")
                .split(",")
                .map((opt) => opt.trim())
                .filter(Boolean)
            : null,
      })),
    };

    try {
      const response = await fetch("/api/form-templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save template");
      }

      alert(`${appName} form has been saved!`);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    }
  };

  const renderPreviewField = (field, index) => {
    if (field.type === "section") {
      return (
        <div key={index} className="pt-6 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {field.label || "Untitled Section"}
          </h2>
          {field.subtitle && (
            <p className="text-sm text-gray-500 mt-1">{field.subtitle}</p>
          )}
        </div>
      );
    }

    return (
      <div key={index}>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          {field.label || "Untitled Field"}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {field.type === "select" ? (
          <select className="w-full border-2 border-gray-100 rounded-lg p-3 bg-gray-50">
            <option>-- Select Option --</option>
            {(field.options || "")
              .split(",")
              .map((opt) => opt.trim())
              .filter(Boolean)
              .map((opt, idx) => (
                <option key={idx}>{opt}</option>
              ))}
          </select>
        ) : field.type === "radio" ? (
          <div className="space-y-2">
            {(field.options || "")
              .split(",")
              .map((opt) => opt.trim())
              .filter(Boolean)
              .map((opt, idx) => (
                <label key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="radio" name={`preview-${index}`} />
                  {opt}
                </label>
              ))}
          </div>
        ) : field.type === "textarea" ? (
          <textarea
            className="w-full h-24 border-2 border-gray-100 rounded-lg bg-gray-50 p-3"
            placeholder={field.placeholder || ""}
            disabled
          />
        ) : field.type === "image-upload" || field.type === "file-upload" ? (
          <div className="h-20 w-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 font-bold">
            {field.type === "image-upload" ? "Photo Upload Zone" : "File Upload Zone"}
          </div>
        ) : field.type === "checkbox" ? (
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" />
            {field.placeholder || "Checkbox option"}
          </label>
        ) : (
          <input
            type={field.type}
            className="w-full border-2 border-gray-100 rounded-lg bg-gray-50 p-3"
            placeholder={field.placeholder || ""}
            disabled
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <PageHeader title="Form Architect" subtitle="Building new RFC templates" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">
            1. Build Your Form
          </h2>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider">
              Application Name
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="e.g. Bright Flow"
              className="mt-2 block w-full border-2 border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 bg-gray-50 rounded-xl relative group"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">
                      {field.type === "section" ? "Section Title" : "Label"}
                    </label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(index, "label", e.target.value)}
                      className="w-full p-2 border rounded mt-1 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Type</label>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(index, "type", e.target.value)}
                      className="w-full p-2 border rounded mt-1 shadow-sm bg-white"
                    >
                      <option value="text">Short Text</option>
                      <option value="textarea">Paragraph</option>
                      <option value="select">Dropdown Menu</option>
                      <option value="radio">Radio Buttons</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="datetime-local">Date & Time</option>
                      <option value="email">Email</option>
                      <option value="image-upload">Photo Gallery</option>
                      <option value="file-upload">File Upload</option>
                      <option value="section">Section Header</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">
                      {field.type === "section" ? "Subtitle" : "Placeholder"}
                    </label>
                    <input
                      type="text"
                      value={field.type === "section" ? field.subtitle || "" : field.placeholder || ""}
                      onChange={(e) =>
                        updateField(
                          index,
                          field.type === "section" ? "subtitle" : "placeholder",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded mt-1 shadow-sm"
                    />
                  </div>

                  {field.type !== "section" && field.type !== "checkbox" && (
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={field.required || false}
                          onChange={(e) => updateField(index, "required", e.target.checked)}
                        />
                        Required
                      </label>
                    </div>
                  )}
                </div>

                {(field.type === "select" || field.type === "radio") && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-blue-100">
                    <label className="text-xs font-bold text-blue-500 uppercase">
                      Menu Items (Separate with commas)
                    </label>
                    <input
                      type="text"
                      placeholder="Low, Medium, High"
                      value={field.options || ""}
                      onChange={(e) => updateField(index, "options", e.target.value)}
                      className="w-full p-2 border-b-2 border-blue-200 outline-none mt-1"
                    />
                  </div>
                )}

                {field.type !== "section" && (
                  <div className="mt-3 text-xs text-gray-400">
                    Machine name: <span className="font-mono">{field.name || "not set"}</span>
                  </div>
                )}

                <button
                  onClick={() => removeField(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addField}
            className="mt-8 w-full border-2 border-dashed border-gray-300 text-gray-500 py-3 rounded-lg font-bold hover:border-blue-400 hover:text-blue-500 transition"
          >
            + Add Another Field
          </button>

          <button
            onClick={handleSave}
            className="mt-4 w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 shadow-xl active:scale-95 transition"
          >
            Save Template
          </button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-6 text-gray-300">2. Staff Preview</h2>
          <div className="border-t-8 border-blue-600 pt-6">
            <h1 className="text-3xl font-black text-gray-900">{appName || "Unnamed App"}</h1>
            <p className="text-gray-400 mb-8 font-medium">Draft Change Request</p>

            <div className="space-y-6">
              {fields.map((field, index) => renderPreviewField(field, index))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}