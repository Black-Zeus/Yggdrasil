const MetricCard = ({ title, value, trend, trendType }) => {
    const getTrendClass = () => {
      switch (trendType) {
        case "up":
          return "bg-green-100 text-green-800";
        case "down":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };
  
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-sm text-gray-600 mb-2">{title}</div>
        <div className="text-3xl font-bold text-blue-900 mb-2">{value}</div>
        <div className={`inline-block px-2 py-1 rounded text-sm ${getTrendClass()}`}>
          {trend}
        </div>
      </div>
    );
  };

export default MetricCard;