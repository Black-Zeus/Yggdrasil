import React, { useState, useRef } from 'react';
import { ConfirmModal } from '../Modal/Modal';
import IconResolve_RI from '../../atoms/IconResolve_RI';

const AccordionMedia = ({
  title = 'Título',
  children,
  onDragStart,
  onDragEnd,
  onDelete,
  onEdit,
  onEditViaModal, // Nueva prop para edición avanzada vía modal
  isDraggable = false,
  isEditable = true,
  isDeleted = true,
  editData = {},
  editFields = [],
  isOpen = false,
  width = 'auto', // Nueva prop para el ancho
  height = 'auto', // Nueva prop para el alto
  contentHeight = 'auto' // Nueva prop para el alto del contenido
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(isOpen);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const accordionContentRef = useRef(null);

  const toggleAccordion = () => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditingData(editData);
  };

  const handleEditViaModal = () => {
    if (onEditViaModal) {
      onEditViaModal();
    }
  };

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit(editingData);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setIsDeleteModalOpen(false);
  };

  return (
    <div 
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800"
      style={{ 
        width: width === 'auto' ? 'auto' : width,
        height: height === 'auto' ? 'auto' : height
      }}
    >
      {/* Accordion Header */}
      <div className="flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
        {isDraggable && (
          <div
            className="mr-2 cursor-grab hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded"
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <IconResolve_RI name="RiDragMoveLine" className="h-4 w-4 text-gray-500 dark:text-gray-300" />
          </div>
        )}

        <div className="flex-grow font-medium" onClick={toggleAccordion}>
          {title}
        </div>

        <div className="flex items-center space-x-2">
          {isEditable && !isEditing && (
            <>
              {/* Botón para edición simple (inline) */}
              <button
                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded"
                onClick={handleEdit}
                title="Edición rápida"
              >
                <IconResolve_RI name="RiEditLine" className="h-4 w-4" />
              </button>
              
              {/* Botón para edición avanzada (modal) */}
              {onEditViaModal && (
                <button
                  className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded"
                  onClick={handleEditViaModal}
                  title="Edición avanzada"
                >
                  <IconResolve_RI name="RiSettings3Line" className="h-4 w-4" />
                </button>
              )}
            </>
          )}

          {isDeleted && !isEditing && (
            <button
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded"
              onClick={() => setIsDeleteModalOpen(true)}
              title="Eliminar"
            >
              <IconResolve_RI name="RiDeleteBin6Line" className="h-4 w-4" />
            </button>
          )}

          <button
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 rounded"
            onClick={toggleAccordion}
            title={isAccordionOpen ? "Cerrar" : "Abrir"}
          >
            <IconResolve_RI name="RiArrowDownSLine"
              className={`h-4 w-4 transform transition-transform duration-200 ${
                isAccordionOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Editing Form */}
      {isEditing && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          <div className="space-y-3">
            {editFields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label}
                </label>
                {field.type === 'text' && (
                  <input
                    type="text"
                    name={field.name}
                    value={editingData[field.name] || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                  />
                )}
                {field.type === 'textarea' && (
                  <textarea
                    name={field.name}
                    value={editingData[field.name] || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded"
                    rows="3"
                  />
                )}
                {field.type === 'checkbox' && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={
                        field.name.includes('.')
                          ? field.name.split('.').reduce((o, i) => o?.[i], editingData) || false
                          : editingData[field.name] || false
                      }
                      onChange={handleInputChange}
                      className="mr-2 h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {field.checkboxLabel || field.label}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Accordion Content */}
      {isAccordionOpen && !isEditing && (
        <div
          ref={accordionContentRef}
          className={`border-t border-gray-200 dark:border-gray-600 ${contentHeight !== 'auto' ? 'flex' : ''}`}
          style={{
            height: contentHeight === 'auto' ? 'auto' : contentHeight,
            overflowY: contentHeight === 'auto' ? 'visible' : 'auto'
          }}
        >
          {children}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message="¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default AccordionMedia;