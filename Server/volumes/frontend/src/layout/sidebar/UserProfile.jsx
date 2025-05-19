// src/layout/sidebar/UserProfile.jsx
import React from 'react';
import { useSidebarStore, useUserStore } from '../../store';
import IconResolve_RI from '../../components/atoms/IconResolve_RI';

/**
 * UserProfile - Componente para mostrar el perfil del usuario en el sidebar
 * @param {Object} props
 * @param {boolean} props.textVisible - Si el texto debe estar visible
 */
const UserProfile = ({ textVisible = true }) => {
  const { collapsed } = useSidebarStore();
  const { currentUser } = useUserStore();
  
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
          <IconResolve_RI name="user" size={20} />
        )}
      </div>
      
      <div className={`flex flex-col transition-all duration-300 ${
        !textVisible ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
      }`}>
        <div className="font-bold text-[0.9rem]">{currentUser.name}</div>
        <div className="text-[0.8rem] text-white/60">{currentUser.role}</div>
      </div>
    </div>
  );
};

export default UserProfile;