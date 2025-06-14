
import React from 'react';

const MetricCard = ({ title, value, icon, trend, bgColor, iconColor }) => (
  <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {trend && (
          <div className="flex items-center mt-2 text-sm">
            {trend}
          </div>
        )}
      </div>
      <div className={`${bgColor} p-3 rounded-full`}>
        {React.cloneElement(icon, { className: iconColor })}
      </div>
    </div>
  </div>
);

export default MetricCard;