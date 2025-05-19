import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { RiMailLine, RiLockPasswordLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import useAuthStore from '../../store/authStore'
import logger from '../../utils/logger';

// Componentes
import Logo from "../../components/layout/header/Logo";
import LoadingSpinner from "../../components/ui/spinners/LoadingSpinner";

const Login = () => {
  // Estado del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState("");
  
  // Navegación y ubicación
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener funciones y estado del AuthStore
  const { 
    loginUser, 
    isAuthenticated, 
    isSessionChecking 
  } = useAuthStore();
  
  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (isAuthenticated) {
      // Verificar si hay una ruta de redirección guardada
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
      
      // Limpiar la ruta guardada
      localStorage.removeItem('redirectAfterLogin');
      
      // Redirigir al usuario
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate]);
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    
    // Validación básica
    if (!email.trim() || !password.trim()) {
      setFormError("Por favor, complete todos los campos");
      return;
    }
    
    try {
      logger.info('Login', 'Intentando iniciar sesión');
      
      const result = await loginUser(email, password);
      
      if (result.error) {
        setFormError(result.message || "Error al iniciar sesión. Verifique sus credenciales.");
      }
      // El redireccionamiento se maneja en el useEffect cuando isAuthenticated cambia
      
    } catch (error) {
      logger.error('Login', 'Error en inicio de sesión:', error);
      setFormError("Error inesperado. Por favor, intente nuevamente.");
    }
  };
  
  // Toggle para mostrar/ocultar contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary to-primary-dark p-4">
      <div className="w-full max-w-md bg-background-light dark:bg-background-dark rounded-lg shadow-lg overflow-hidden">
        {/* Encabezado con logo */}
        <div className="py-6 px-8 text-center border-b border-border-light dark:border-border-dark">
          <Logo />
          <h2 className="text-2xl font-bold text-primary mt-4">Iniciar Sesión</h2>
          <p className="text-text-muted dark:text-text-dark mt-1">
            Accede a tu cuenta para continuar
          </p>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="py-6 px-8">
          {/* Mensaje de error */}
          {formError && (
            <div className="mb-4 p-3 bg-danger-light text-danger rounded">
              {formError}
            </div>
          )}
          
          {/* Campo de email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-border-light dark:text-border-dark">
                <RiMailLine size={20} />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 pl-10 pr-3 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="usuario@example.com"
                required
              />
            </div>
          </div>
          
          {/* Campo de contraseña */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-border-light dark:text-border-dark">
                <RiLockPasswordLine size={20} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 pl-10 pr-10 rounded-md border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-border-light dark:text-border-dark"
              >
                {showPassword ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
              </button>
            </div>
          </div>
          
          {/* Opciones adicionales */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-primary border-border-light dark:border-border-dark rounded focus:ring-primary-light"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-text-light dark:text-text-dark"
              >
                Recordarme
              </label>
            </div>
            <div>
              <Link
                to="/recover"
                className="text-sm text-primary hover:text-primary-dark"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
          
          {/* Botón de iniciar sesión */}
          <button
            type="submit"
            disabled={isSessionChecking}
            className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-70"
          >
            {isSessionChecking ? <LoadingSpinner size="sm" light /> : "Iniciar Sesión"}
          </button>
        </form>
        
        {/* Footer */}
        <div className="py-4 px-8 bg-background-highlight dark:bg-background-dark-highlight text-center border-t border-border-light dark:border-border-dark">
          <p className="text-sm text-text-light dark:text-text-dark">
            ¿No tienes una cuenta?{" "}
            <a href="#" className="text-primary hover:text-primary-dark font-medium">
              Contacta con el administrador
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;