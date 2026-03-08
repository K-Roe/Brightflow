import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({ title, subtitle, buttonText, buttonPath }) {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-2xl font-bold text-blue-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      {/* Only render the button if buttonText and buttonPath are provided */}
      {buttonText && buttonPath && (
        <button 
          onClick={() => navigate(buttonPath)} 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 font-semibold shadow-sm transition-all active:scale-95"
        >
          {buttonText}
        </button>
      )}
    </header>
  );
}