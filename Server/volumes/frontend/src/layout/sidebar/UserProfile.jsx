import React from 'react';
import { useLayoutStore } from '../../store/layoutStore';

/**
 * UserProfile - Componente para mostrar el perfil del usuario en el sidebar
 */
const UserProfile = () => {
  const { collapsed, currentUser } = useLayoutStore();
  
  if (!currentUser) return null;
  
  return (
    <div className={`p-4 flex items-center gap-3 border-b border-border-sidebar transition-all duration-300 ${
      collapsed ? 'justify-center p-4' : ''
    }`}>
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
        {currentUser.avatar ? (
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          currentUser.name.charAt(0)
        )}
      </div>
      
      <div className={`flex flex-col transition-opacity duration-300 ${
        collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
      }`}>
        <div className="font-bold text-[0.9rem]">{currentUser.name}</div>
        <div className="text-[0.8rem] text-white/60">{currentUser.role}</div>
      </div>
    </div>
  );
};

export default UserProfile;