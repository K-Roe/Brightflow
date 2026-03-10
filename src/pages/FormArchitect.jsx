import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function FormArchitect() {
  const navigate = useNavigate();
  const [appName, setAppName] = useState("");
  const [fields, setFields] = useState([
    { name: "title", label: "RFC Title", type: "text", required: true }
  ]);

  // Adds a blank row to our "blueprint"
  const addField = () => {
    setFields([...fields, { name: "", label: "", type: "text", required: false, options: "" }]);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index, key, value) => {
    const updated = [...fields];
    updated[index][key] = value;
    
    // Auto-generate a machine name for the database (e.g., "User Impact" -> "user_impact")
    if (key === "label") {
      updated[index].name = value.toLowerCase().replace(/\s+/g, "_");
    }
    setFields(updated);
  };

  const handleSave = () => {
    if (!appName) return alert("Give the application a name first!");
    
    // This console log represents the JSON you'd send to your database
    console.log("SENDING TO DB:", { appName, fields });
    alert(`${appName} form has been saved!`);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <PageHeader title="Form Architect" subtitle="Building new RFC templates" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        
        {/* LEFT: THE EDITOR */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">1. Build Your Form</h2>
          
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-600 uppercase tracking-wider">Application Name</label>
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
              <div key={index} className="p-4 border border-gray-200 bg-gray-50 rounded-xl relative group">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Label</label>
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
                      <option value="image-upload">Photo Gallery</option>
                    </select>
                  </div>
                </div>

                {/* Dropdown Options Config */}
                {field.type === "select" && (
                  <div className="mt-4 p-3 bg-white rounded-lg border border-blue-100">
                    <label className="text-xs font-bold text-blue-500 uppercase">Menu Items (Separate with commas)</label>
                    <input 
                      type="text" 
                      placeholder="Low, Medium, High"
                      value={field.options || ""}
                      onChange={(e) => updateField(index, "options", e.target.value)}
                      className="w-full p-2 border-b-2 border-blue-200 outline-none mt-1"
                    />
                  </div>
                )}
                
                <button 
                  onClick={() => removeField(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600"
                >✕</button>
              </div>
            ))}
          </div>

          <button onClick={addField} className="mt-8 w-full border-2 border-dashed border-gray-300 text-gray-500 py-3 rounded-lg font-bold hover:border-blue-400 hover:text-blue-500 transition">
            + Add Another Field
          </button>

          <button onClick={handleSave} className="mt-4 w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 shadow-xl active:scale-95 transition">
            Save Template
          </button>
        </div>

        {/* RIGHT: THE PREVIEW */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 h-fit sticky top-8">
          <h2 className="text-xl font-bold mb-6 text-gray-300">2. Staff Preview</h2>
          <div className="border-t-8 border-blue-600 pt-6">
            <h1 className="text-3xl font-black text-gray-900">{appName || "Unnamed App"}</h1>
            <p className="text-gray-400 mb-8 font-medium">Draft Change Request</p>
            
            <div className="space-y-6">
              {fields.map((f, i) => (
                <div key={i}>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{f.label || "Untitled Field"}</label>
                  
                  {f.type === "select" ? (
                    <select className="w-full border-2 border-gray-100 rounded-lg p-2 bg-gray-50">
                      <option>-- Select Option --</option>
                      {f.options?.split(',').map((opt, idx) => (
                        <option key={idx}>{opt.trim()}</option>
                      ))}
                    </select>
                  ) : f.type === "textarea" ? (
                    <div className="h-24 w-full border-2 border-gray-100 rounded-lg bg-gray-50" />
                  ) : f.type === "image-upload" ? (
                    <div className="h-20 w-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 font-bold">Photo Upload Zone</div>
                  ) : (
                    <div className="h-11 w-full border-2 border-gray-100 rounded-lg bg-gray-50" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}