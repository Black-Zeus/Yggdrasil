import React, { useState } from 'react';

const ToggleSwitch = ({ label, defaultChecked = false, onChange }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <div className="flex items-center">
      <label className="relative inline-block w-[50px] h-6 mr-3">
        <input 
          type="checkbox" 
          className="opacity-0 w-0 h-0"
          checked={isChecked} 
          onChange={handleToggle} 
        />
        <span className={`absolute cursor-pointer inset-0 rounded-full transition-all duration-300 ${isChecked ? 'bg-primary' : 'bg-gray-300'}`}>
          <span 
            className={`absolute h-4 w-4 bg-white rounded-full bottom-1 left-1 transition-all duration-300 ${isChecked ? 'transform translate-x-6' : ''}`}>
          </span>
        </span>
      </label>
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default ToggleSwitch;