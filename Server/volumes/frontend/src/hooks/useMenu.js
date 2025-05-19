// useMenu.js - Completamente rediseñado
import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import logger from '../utils/logger';

// Cache para almacenar el resultado de la API
let cachedMenuItems = null;
let isLoading = false;
let fetchPromise = null;

const useMenu = () => {
  const [menuItems, setMenuItems] = useState(cachedMenuItems);
  const [loading, setLoading] = useState(!cachedMenuItems);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si ya tenemos datos en caché, no hacemos nada
    if (cachedMenuItems) {
      setMenuItems(cachedMenuItems);
      setLoading(false);
      return;
    }

    // Si ya hay una petición en curso, esperamos a que termine
    if (isLoading && fetchPromise) {
      fetchPromise
        .then(items => {
          setMenuItems(items);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message || 'Error al cargar el menú');
          setLoading(false);
        });
      return;
    }

    // Función para obtener los menús
    const fetchMenu = async () => {
      if (isLoading) return cachedMenuItems;
      
      isLoading = true;
      try {
        logger.info('useMenu', 'Iniciando petición de menú');
        const response = await axiosInstance.get('/menus/');
        
        // Extraer los items del formato de respuesta
        let items = [];
        
        if (response && response.items && Array.isArray(response.items)) {
          items = response.items;
        } else {
          logger.warn('useMenu', 'Estructura de respuesta inesperada:', response);
        }
        
        logger.info('useMenu', `Menú obtenido con ${items.length} items principales`);
        
        // Guardar en caché
        cachedMenuItems = items;
        return items;
      } catch (err) {
        logger.error('useMenu', 'Error al obtener el menú', err);
        throw err;
      } finally {
        isLoading = false;
        fetchPromise = null;
      }
    };

    // Iniciar la petición
    setLoading(true);
    fetchPromise = fetchMenu();
    
    fetchPromise
      .then(items => {
        setMenuItems(items);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Error al cargar el menú');
        setLoading(false);
      });
  }, []);

  return { menuItems, loading, error };
};

export default useMenu;