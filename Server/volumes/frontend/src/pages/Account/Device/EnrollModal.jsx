import React, { useState } from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';
import QRGenerator from '../../../components/CodeGenerators/QRGenerator';
import { MessageModal } from '../../../components/ui/Modal/Modal'; // Importamos el MessageModal
import LoadingSpinner from '../../../components/ui/spinners/LoadingSpinner';
import logger from '../../../utils/logger';

const EnrollModal = ({ isOpen, onClose }) => {
  const [qrData, setQrData] = useState({
    registerCode: "ExampleCodeNoValidStructure",
    RegisterUrl: "http://sistema.cl/api/servicios/device/registerDevice",
    userId: 25
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    // Activar el spinner y deshabilitar el botón
    setIsLoading(true);

    try {
      logger.info('EnrollModal', 'Solicitando nuevo código QR');

      // Simulación de delay y nueva respuesta desde "API"
      const fetchResponse = await new Promise(resolve =>
        setTimeout(() => {
          resolve({
            registerCode: `Code_${Date.now()}`,
            RegisterUrl: "http://sistema.cl/api/servicios/device/registerDevice",
            userId: Math.floor(Math.random() * 100) + 1
          });
        }, 1000)
      );

      setQrData(fetchResponse);
      logger.info('EnrollModal', 'Código QR actualizado correctamente');
    } catch (error) {
      logger.error('EnrollModal', 'Error al refrescar el código QR', error);
      logger.toast('Error al generar el código QR. Intente nuevamente.', 'error');
    } finally {
      // Desactivar el spinner y habilitar el botón nuevamente
      setIsLoading(false);
    }
  };

  return (
    <MessageModal
      isOpen={isOpen}
      onClose={onClose}
      title="Enrolar Nuevo Dispositivo"
      variant="info"
    >
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Escanea este código QR desde la aplicación
        </p>

        <div className="bg-gray-50 p-6 rounded-lg mx-auto w-48 h-48 flex items-center justify-center mb-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <LoadingSpinner
                size="lg"
                message="Generando QR"
              />
            </div>
          ) : (
            <QRGenerator
              width={190}
              height={190}
              jsonData={qrData}
            />
          )}
        </div>

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={`flex items-center mt-2 gap-2 text-sm px-3 py-2 bg-white border border-blue-600 rounded-md transition-colors mb-6 mx-auto
            ${isLoading
              ? 'opacity-60 cursor-not-allowed text-gray-500 border-gray-400'
              : 'text-blue-600 hover:bg-blue-50'}`}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="xs" className="text-gray-500" />
              <span className="ml-1">Refrescando...</span>
            </>
          ) : (
            <>
              <IconResolve_RI name="RiRefreshLine" className="w-4 h-4" />
              <span>Refrescar QR</span>
            </>
          )}
        </button>

        <div className="flex items-start gap-2 text-sm text-gray-500 bg-blue-50 p-4 rounded-lg">
          <IconResolve_RI name="RiErrorWarningLine" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-left space-y-2">
            <p>Debe tener instalada:</p>
            <div>
              <p><span className="font-bold">SupportApp</span> (≥0.0.1, tablets)</p>
              <p><span className="font-bold">PersonalApp</span> (≥0.0.1, celulares)</p>
            </div>
            <p className="text-sm text-gray-600">Solicite instalación al administrador si no la tiene.</p>
          </div>
        </div>
      </div>
    </MessageModal>
  );
};

export default EnrollModal;