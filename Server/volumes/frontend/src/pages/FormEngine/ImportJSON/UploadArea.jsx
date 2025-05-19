// ImportJSON/UploadArea.jsx
import React, { useState, useRef } from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const UploadArea = ({ onFileSelect, height = "250px", width = "100%" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      onFileSelect(file);
    } else {
      alert('Por favor, selecciona un archivo JSON válido');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
      onFileSelect(file);
    } else {
      alert('Por favor, selecciona un archivo JSON válido');
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer
        ${isDragging ? 'border-primary bg-highlight' : 'border-border'}`}
      style={{ height, width }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="flex flex-col items-center justify-center text-center h-full">
        <IconResolve_RI 
          name="RiUploadCloud2Line" 
          size={36} 
          className="text-primary mb-2"
        />
        <p className="text-base font-medium text-text mb-1">
          Arrastra y suelta tu archivo JSON aquí
        </p>
        <p className="text-text-muted mb-2 text-sm">o</p>
        <button 
          className="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Seleccionar archivo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadArea;