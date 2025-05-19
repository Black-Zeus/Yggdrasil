import React from 'react';
import PropTypes from 'prop-types';

const ActivityTable = ({ activities }) => {
  const getStatusClasses = (status) => {
    return status.toLowerCase() === 'activa' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-medium text-gray-800 mb-5 pb-2 border-b border-gray-200">Actividad Reciente</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-3 px-4 bg-gray-50 text-gray-600 font-medium border-b-2 border-gray-200">Evaluación</th>
              <th className="text-left py-3 px-4 bg-gray-50 text-gray-600 font-medium border-b-2 border-gray-200">Categoría</th>
              <th className="text-left py-3 px-4 bg-gray-50 text-gray-600 font-medium border-b-2 border-gray-200">Modificado</th>
              <th className="text-left py-3 px-4 bg-gray-50 text-gray-600 font-medium border-b-2 border-gray-200">Estado</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td className="py-3 px-4 border-b border-gray-200 text-gray-700">{activity.name}</td>
                <td className="py-3 px-4 border-b border-gray-200">
                  <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                    {activity.category}
                  </span>
                </td>
                <td className="py-3 px-4 border-b border-gray-200 text-gray-700">{activity.modified}</td>
                <td className="py-3 px-4 border-b border-gray-200">
                  <span className={`${getStatusClasses(activity.status)} text-xs font-medium px-3 py-1 rounded-full inline-block text-center`}>
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ActivityTable.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      modified: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ActivityTable;