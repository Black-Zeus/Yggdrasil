import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import EvaluationHeader from './LoadEvaluation/EvaluationHeader';
import FiltersSection from './LoadEvaluation/FiltersSection';
import EvaluationTable from './LoadEvaluation/EvaluationTable';
import { ConfirmModal, AlertModal } from '../../components/ui/Modal/Modal';
import LoadingSpinner from '../../components/ui/spinners/LoadingSpinner';
import formEngineService from '../../services/formEngineService';
import logger from '../../utils/logger';

const LoadEvaluation = () => {
  const navigate = useNavigate();
  
  // Estados principales
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Estados para filtros y paginación
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    search: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  // Estados para modales
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, formId: null });
  const [cloneModal, setCloneModal] = useState({ isOpen: false, formId: null, formTitle: '' });
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', variant: 'info', onConfirm: null });
  const [cancelModal, setCancelModal] = useState({ isOpen: false, formId: null });
  const [actionInProgress, setActionInProgress] = useState(false);
  
  // Función para cargar formularios (memoizada para evitar recreaciones)
  const loadForms = useCallback(async () => {
    // Evita cargar si ya estamos cargando
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      logger.info('LoadEvaluation', 'Cargando formularios con filtros:', filters);
      logger.info('LoadEvaluation', `Página: ${page}, Límite: ${limit}`);
      
      const response = await formEngineService.getForms(filters, page, limit);
      
      // La respuesta ya viene procesada desde el servicio
      const formItems = response.data || [];
      const pagination = response.pagination || { total_pages: 1 };
      
      // Actualizar el estado con los resultados
      setForms(formItems);
      setTotalPages(pagination.total_pages || 1);
      
      // Marcar que ya se realizó una búsqueda
      setSearchPerformed(true);
      
      logger.info('LoadEvaluation', `Formularios cargados: ${formItems.length}`);
    } catch (error) {
      const errorMessage = error.message || 'Error desconocido al cargar formularios';
      setError(errorMessage);
      logger.error('LoadEvaluation', 'Error al cargar formularios:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, limit, isLoading]);
  
  // Efecto para cargar formularios cuando cambian dependencias clave
  useEffect(() => {
    // No cargar automáticamente al montar, esperar a que el usuario haga clic en buscar
    if (searchPerformed) {
      loadForms();
    }
  }, [page, searchPerformed, loadForms]);
  
  // Manejadores de eventos (memoizados para evitar recreaciones)
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    
    logger.info('LoadEvaluation', `Filtro "${filterType}" actualizado a: ${value}`);
  }, []);
  
  const handleSearch = useCallback(() => {
    // Reset a la primera página cuando se busca
    setPage(1);
    // Marcar que se ha realizado una búsqueda si es la primera vez
    setSearchPerformed(true);
    // La carga se iniciará mediante el useEffect debido al cambio en searchPerformed
    loadForms();
  }, [loadForms]);
  
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
    logger.info('LoadEvaluation', `Página cambiada a: ${newPage}`);
    // La carga se iniciará mediante el useEffect
  }, []);
  
  const handleClearFilters = useCallback(() => {
    setFilters({ category: '', subcategory: '', search: '' });
    setPage(1);
    // La limpieza de filtros no debe reiniciar la bandera searchPerformed
    // para mantener el estado de "ya se ha realizado una búsqueda"
    loadForms();
  }, [loadForms]);
  
  // Manejador de acciones para formularios
  const handleAction = useCallback((action, formId, formData = {}) => {
    logger.info('LoadEvaluation', `Acción: ${action} para formulario ${formId}`);
    
    switch (action) {
      case 'edit':
        navigate(`/FormEngine/CreateEvaluation/${formId}`);
        break;
        
      case 'clone':
        setCloneModal({
          isOpen: true,
          formId,
          formTitle: formData.name || formData.title || 'formulario'
        });
        break;
        
      case 'delete':
        setDeleteModal({
          isOpen: true,
          formId
        });
        break;
        
      case 'cancel':
        setCancelModal({
          isOpen: true,
          formId
        });
        break;
        
      case 'view':
        navigate(`/FormEngine/ViewEvaluation/${formId}`);
        break;
        
      default:
        logger.warn('LoadEvaluation', `Acción desconocida: ${action}`);
    }
  }, [navigate]);
  
  // Manejadores para confirmaciones de acciones
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteModal.formId) return;
    
    try {
      setActionInProgress(true);
      
      await formEngineService.deleteForm(deleteModal.formId);
      
      setAlertModal({
        isOpen: true,
        message: 'El formulario ha sido eliminado correctamente.',
        variant: 'success'
      });
      
      // Recargar los datos después de eliminar
      loadForms();
    } catch (error) {
      const errorMessage = error.message || 'Error desconocido';
      
      setAlertModal({
        isOpen: true,
        message: `Error al eliminar el formulario: ${errorMessage}`,
        variant: 'error'
      });
      
      logger.error('LoadEvaluation', 'Error al eliminar formulario:', error);
    } finally {
      setActionInProgress(false);
      setDeleteModal({ isOpen: false, formId: null });
    }
  }, [deleteModal.formId, loadForms]);
  
  const handleCloneConfirm = useCallback(async () => {
    if (!cloneModal.formId) return;
    
    try {
      setActionInProgress(true);
      
      // Opciones para clonar
      const cloneOptions = {
        newTitle: `Copia de ${cloneModal.formTitle}`,
        setAsDraft: true
      };
      
      const response = await formEngineService.cloneForm(cloneModal.formId, cloneOptions);
      const newFormData = response.data || {};
      const newFormId = newFormData.uuid || newFormData.form_id || newFormData.id;
      
      setAlertModal({
        isOpen: true,
        message: 'El formulario ha sido clonado correctamente. ¿Desea editar la copia?',
        variant: 'success',
        onConfirm: () => navigate(`/FormEngine/CreateEvaluation/${newFormId}`)
      });
      
      // Recargar los datos después de clonar
      loadForms();
    } catch (error) {
      const errorMessage = error.message || 'Error desconocido';
      
      setAlertModal({
        isOpen: true,
        message: `Error al clonar el formulario: ${errorMessage}`,
        variant: 'error'
      });
      
      logger.error('LoadEvaluation', 'Error al clonar formulario:', error);
    } finally {
      setActionInProgress(false);
      setCloneModal({ isOpen: false, formId: null, formTitle: '' });
    }
  }, [cloneModal.formId, cloneModal.formTitle, loadForms, navigate]);
  
  const handleCancelConfirm = useCallback(async () => {
    if (!cancelModal.formId) return;
    
    try {
      setActionInProgress(true);
      
      await formEngineService.changeFormStatus(cancelModal.formId, 'cancelled');
      
      setAlertModal({
        isOpen: true,
        message: 'El formulario ha sido anulado correctamente.',
        variant: 'success'
      });
      
      // Recargar los datos después de anular
      loadForms();
    } catch (error) {
      const errorMessage = error.message || 'Error desconocido';
      
      setAlertModal({
        isOpen: true,
        message: `Error al anular el formulario: ${errorMessage}`,
        variant: 'error'
      });
      
      logger.error('LoadEvaluation', 'Error al anular formulario:', error);
    } finally {
      setActionInProgress(false);
      setCancelModal({ isOpen: false, formId: null });
    }
  }, [cancelModal.formId, loadForms]);
  
  // Contenido condicional memoizado para evitar cálculos redundantes
  const contentElement = useMemo(() => {
    if (isLoading) {
      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingSpinner
            size="xl"
            message="Cargando formularios..."
          />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="bg-danger-light dark:bg-danger-dark/30 border border-danger rounded-lg p-4 my-4 text-center">
          <p className="text-danger dark:text-danger-light">{error}</p>
          <button
            onClick={loadForms}
            className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Reintentar
          </button>
        </div>
      );
    }
    
    // Si se ha realizado una búsqueda pero no hay resultados
    if (searchPerformed && forms.length === 0) {
      return (
        <div className="bg-background-light dark:bg-background-dark rounded-lg shadow-subtle p-8 my-4 text-center">
          <p className="text-text-muted dark:text-text-dark mb-4">
            No se encontraron formularios con los filtros seleccionados.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-secondary text-text-light rounded-md hover:bg-secondary-light"
          >
            Limpiar filtros
          </button>
        </div>
      );
    }
    
    // Si no se ha realizado ninguna búsqueda aún
    if (!searchPerformed) {
      return (
        <div className="bg-background-light dark:bg-background-dark rounded-lg shadow-subtle p-8 my-4 text-center">
          <p className="text-text-muted dark:text-text-dark mb-4">
            Use los filtros y pulse 'Buscar' para encontrar formularios.
          </p>
        </div>
      );
    }
    
    // Si hay formularios para mostrar
    return (
      <EvaluationTable
        forms={forms}
        onAction={handleAction}
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    );
  }, [isLoading, error, searchPerformed, forms, totalPages, page, loadForms, handleClearFilters, handleAction, handlePageChange]);
  
  return (
    <div className="max-w-7xl mx-auto p-5">
      <EvaluationHeader
        title="Formularios de Evaluación"
        subtitle="Administra y edita los formularios disponibles en el sistema"
      />

      <FiltersSection
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Área de contenido principal */}
      <div className="relative">
        {contentElement}

        {/* Overlay durante acciones */}
        {actionInProgress && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm z-10 rounded-lg">
            <LoadingSpinner size="xl" message="Procesando..." />
          </div>
        )}
      </div>

      {/* Modales de confirmación */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, formId: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Formulario"
        message="¿Está seguro que desea eliminar este formulario? Esta acción no puede deshacerse."
      />

      <ConfirmModal
        isOpen={cloneModal.isOpen}
        onClose={() => setCloneModal({ isOpen: false, formId: null, formTitle: '' })}
        onConfirm={handleCloneConfirm}
        title="Clonar Formulario"
        message={`¿Desea crear una copia de "${cloneModal.formTitle}"? El formulario se creará como borrador.`}
      />

      <ConfirmModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, formId: null })}
        onConfirm={handleCancelConfirm}
        title="Anular Formulario"
        message="¿Está seguro que desea anular este formulario? Ya no estará disponible para respuestas."
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, message: '', variant: 'info', onConfirm: null })}
        message={alertModal.message}
        variant={alertModal.variant}
        onConfirm={alertModal.onConfirm}
      />
    </div>
  );
};

export default LoadEvaluation;