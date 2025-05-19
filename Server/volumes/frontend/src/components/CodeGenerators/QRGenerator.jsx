// QRGenerator.jsx
import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../ui/spinners/LoadingSpinner';
// Necesitas instalar esta dependencia: npm install qrcode.react
import { QRCodeSVG } from 'qrcode.react';

const QRGenerator = ({ width = 256, height = 256, jsonData }) => {
  const [loading, setLoading] = useState(true);
  const [qrValue, setQrValue] = useState('');
  
  useEffect(() => {
    setLoading(true);
    
    const timer = setTimeout(() => {
      try {
        // Convertimos jsonData a string si no lo es ya
        const dataString = typeof jsonData === 'string' 
          ? jsonData 
          : JSON.stringify(jsonData);
        
        setQrValue(dataString);
        setLoading(false);
      } catch (error) {
        console.error('Error al procesar los datos para el QR:', error);
        setLoading(false);
      }
    }, 400); // Simular un breve tiempo de carga
    
    return () => clearTimeout(timer);
  }, [jsonData]);
  
  return (
    <div className="flex flex-col items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center justify-center p-4">
          <LoadingSpinner 
            size="lg" 
            message="Generando QR" 
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div 
            className="p-4 bg-white rounded-lg shadow-md flex items-center justify-center" 
            style={{ width: width + 32, height: height + 32 }}
          >
            <QRCodeSVG 
              value={qrValue}
              size={Math.min(width, height)}
              level="H" // Alto nivel de corrección de errores
              includeMargin={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QRGenerator;