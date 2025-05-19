import React, { useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import {
  RiErrorWarningLine,
  RiCheckLine,
  RiInformationLine,
  RiAlertLine,
  RiCloseLine,
  RiExternalLinkLine,
  RiMessageLine,
} from "react-icons/ri";

const Modal = ({ isOpen, onClose, children, variant }) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  // Nuevo ref para rastrear dónde se originó el mousedown
  const mouseDownInsideRef = useRef(false);
  const overlayRef = useRef(null);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "Tab") {
        // Manejo de foco circular dentro del modal
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (!focusableElements?.length) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [onClose]
  );

  // Nuevo manejador para rastrear mousedown
  const handleMouseDown = useCallback((e) => {
    // Verificar si el mousedown ocurrió dentro del contenido del modal
    mouseDownInsideRef.current = modalRef.current?.contains(e.target) || false;
  }, []);

  // Nuevo manejador para el overlay
  const handleOverlayClick = useCallback((e) => {
    // Solo cerrar el modal si tanto el mousedown como el click/mouseup ocurrieron en el overlay
    // Esto evita que el modal se cierre cuando el usuario arrastra desde dentro hacia afuera
    if (e.target === overlayRef.current && !mouseDownInsideRef.current) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      // Guardar el elemento actualmente enfocado
      previousFocusRef.current = document.activeElement;
      
      // Añadir listeners de eventos
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleMouseDown);
      
      // Enfocar el modal al abrirse
      setTimeout(() => {
        const focusableElement = modalRef.current?.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusableElement?.focus();
      }, 50);
      
      // Bloquear scroll del body
      document.body.style.overflow = "hidden";
    } else {
      // Eliminar listeners de eventos
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
      
      // Restaurar scroll del body
      document.body.style.overflow = "";
      
      // Restaurar el foco previo
      previousFocusRef.current?.focus();
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown, handleMouseDown]);

  if (!isOpen) return null;

  const variantColors = {
    info: "border-blue-500",
    error: "border-red-500",
    warning: "border-yellow-500",
    success: "border-green-500",
    message: "border-gray-300",
  };

  const variantOverlayFocus = {
    info: "focus-visible:ring-blue-500",
    error: "focus-visible:ring-red-500",
    warning: "focus-visible:ring-yellow-500",
    success: "focus-visible:ring-green-500",
    message: "focus-visible:ring-gray-400",
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-200"
      onClick={handleOverlayClick} // Reemplazamos el onClick directo con nuestro manejador personalizado
      role="dialog"
      aria-modal="true"
      tabIndex="-1"
    >
      <div
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md relative border-l-4 transform transition-transform duration-200 ease-out ${
          variant ? variantColors[variant] : "border-gray-500"
        } ${variant ? variantOverlayFocus[variant] : "focus-visible:ring-gray-500"}`}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={onClose}
          aria-label="Cerrar"
          type="button"
        >
          <RiCloseLine size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["info", "error", "warning", "success", "message"]),
};

const iconStyles = "w-6 h-6 mr-2 flex-shrink-0";

const variantIcons = {
  info: <RiInformationLine className={iconStyles} />,
  error: <RiErrorWarningLine className={iconStyles} />,
  warning: <RiAlertLine className={iconStyles} />,
  success: <RiCheckLine className={iconStyles} />,
  message: <RiMessageLine className={iconStyles} />,
};

// 📌 Modal de Alerta
export const AlertModal = ({ isOpen, onClose, message, variant = "info" }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant={variant}>
      <div className="flex items-center">
        {variantIcons[variant]}
        <h2 className="text-lg font-bold" id="alert-modal-title">{variant.charAt(0).toUpperCase() + variant.slice(1)}</h2>
      </div>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
      <div className="flex justify-end mt-4">
        <button
          className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          onClick={onClose}
          type="button"
        >
          Aceptar
        </button>
      </div>
    </Modal>
  );
};

AlertModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["info", "error", "warning", "success", "message"]),
};

// 📌 Modal de Mensaje (Solo con botón de cierre)
export const MessageModal = ({ isOpen, onClose, title, children, variant = "message" }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant={variant}>
      <div className="flex items-center">
        {variantIcons[variant]}
        <h2 className="text-lg font-bold" id="message-modal-title">{title}</h2>
      </div>
      <div className="mt-2 text-gray-600 dark:text-gray-400">
        {children}
      </div>
    </Modal>
  );
};

MessageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["info", "error", "warning", "success", "message"]),
};

// 📌 Modal de Confirmación
export const ConfirmModal = ({ isOpen, onClose, onConfirm, message, title }) => {
  const modalTitle = title || "Confirmación";

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="warning">
      <div className="flex items-center">
        {variantIcons["warning"]}
        <h2 className="text-lg font-bold" id="confirm-modal-title">{modalTitle}</h2>
      </div>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          onClick={onClose}
          type="button"
        >
          Cancelar
        </button>
        <button
          className="py-2 px-4 bg-red-600 dark:bg-red-700 text-white font-semibold rounded-lg hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          type="button"
        >
          Confirmar
        </button>
      </div>
    </Modal>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
};

// 📌 Modal de Multimedia
export const MediaModal = ({ isOpen, onClose, title, mediaSrc }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="info">
      <h2 className="text-lg font-bold mb-4" id="media-modal-title">{title}</h2>
      <div className="max-h-[70vh] overflow-auto">
        <img 
          src={mediaSrc} 
          alt={title} 
          className="w-full rounded-lg shadow-md" 
          loading="lazy"
        />
      </div>
    </Modal>
  );
};

MediaModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  mediaSrc: PropTypes.string.isRequired,
};

// 📌 Modal de Enlace Externo
export const ExternalLinkModal = ({ isOpen, onClose, message, url }) => {
  const openLink = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="info">
      <div className="flex items-center">
        <RiExternalLinkLine className={iconStyles} />
        <h2 className="text-lg font-bold" id="external-link-modal-title">Enlace Externo</h2>
      </div>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
      <div className="flex justify-end mt-4 space-x-2">
        <button
          className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          onClick={onClose}
          type="button"
        >
          Cancelar
        </button>
        <button
          className="py-2 px-4 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors inline-flex items-center"
          onClick={() => {
            openLink();
            onClose();
          }}
          type="button"
        >
          <span>Abrir Enlace</span>
          <RiExternalLinkLine className="ml-2 w-4 h-4" />
        </button>
      </div>
    </Modal>
  );
};

ExternalLinkModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

// 📌 Modal de Formulario
export const FormModal = ({ isOpen, onClose, onSubmit, title, children }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Detener la propagación para evitar cierres inesperados
    event.stopPropagation();
    onSubmit(event);
    // Solo cerramos después de procesar el submit
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} variant="info">
      <h2 className="text-lg font-bold mb-4" id="form-modal-title">{title}</h2>
      <form onSubmit={handleSubmit}>
        {children}
        <div className="flex justify-end mt-4 space-x-2">
          <button
            type="button"
            className="py-2 px-4 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    </Modal>
  );
};

FormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;