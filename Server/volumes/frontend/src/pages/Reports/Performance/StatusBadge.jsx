import React from "react";

const StatusBadge = ({ status, label }) => {
    const getStatusClass = () => {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "error":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };
  
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass()}`}>
        {label}
      </span>
    );
  };

export default StatusBadge;