import React, { useState } from 'react';

const BrandAndLogo = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/png, image/jpeg';
    fileInput.onchange = (e) => handleFileChange(e.target.files[0]);
    fileInput.click();
  };

  return (
    <div className="p-6 border-b border-border-light">
      <div className="flex items-center mb-5">
        <svg className="w-6 h-6 mr-3 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 2l10 5 -10 5 0 -10z"></path>
          <rect x="2" y="12" width="20" height="10" rx="2" ry="2"></rect>
        </svg>
        <h2 className="text-lg font-semibold text-primary m-0">Marca y Logo</h2>
      </div>

      <div className="flex justify-center items-center gap-10 flex-wrap mb-5">
        {/* Vista previa del logo */}
        <div className="flex flex-col items-center gap-2.5 w-[300px] h-[300px]">
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Vista previa del logo" 
              className="w-full h-full object-contain bg-background rounded-md p-2 shadow-subtle" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-background rounded-md p-2 shadow-subtle text-text-muted text-xs text-center">
              No hay imagen seleccionada
            </div>
          )}
          <p className="text-xs text-text-muted">Formatos aceptados: PNG, JPG. Tamaño máximo: 2MB.</p>
        </div>
        
        {/* Área Drag & Drop */}
        <div 
          className="w-[200px] h-[100px] bg-highlight border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-background hover:border-primary p-5 text-center"
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <svg className="w-10 h-10 text-text-muted mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <div className="text-sm text-text-muted mb-2">Arrastra y suelta una imagen aquí</div>
          <div className="text-xs text-text-muted">o haz clic para seleccionar un archivo</div>
        </div>
      </div>
    </div>
  );
};

export default BrandAndLogo;