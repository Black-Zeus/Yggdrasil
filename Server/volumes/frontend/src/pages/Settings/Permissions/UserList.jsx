// Permissions/UserList.jsx
import React, { useState } from 'react';
import IconResolve_RI from '../../../components/atoms/IconResolve_RI';

const UserList = ({ users, selectedUser, onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="relative p-4">
        <div className="relative">
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconResolve_RI name="RiSearchLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto px-4">
        {filteredUsers.map(user => (
          <li
            key={user.id}
            className={`flex items-center p-3 rounded-md cursor-pointer transition-colors mb-2 ${
              selectedUser?.id === user.id 
                ? 'bg-blue-50 border border-blue-200'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onUserSelect(user)}
          >
            <img
              src={user.avatar || "/api/placeholder/32/32"}
              alt={`Avatar de ${user.name}`}
              className="w-8 h-8 rounded-full mr-3"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </h4>
              <span className="text-xs text-gray-500">
                {user.role}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;