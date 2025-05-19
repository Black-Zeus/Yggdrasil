import React from 'react';
import SvgIcon from '../../../components/atoms/SvgIcon';

const TechCategory = ({ title, technologies }) => (
  <div className="bg-background-light dark:bg-background-dark rounded-lg p-6">
    <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4 pb-2 border-b border-border-light dark:border-border-dark">
      {title}
    </h3>
    <div className="grid grid-cols-2 gap-4">
      {technologies.map((tech, index) => (
        <div
          key={index}
          className="flex items-center bg-background-light dark:bg-border-dark rounded-lg p-4 transition-all hover:-translate-y-1 hover:shadow-sm"
        >
          <div className="flex flex-col items-center justify-center space-y-2 w-full">
            <SvgIcon
              path={tech.icon}
              className="w-12 h-12"
              alt={tech.name}
            />
            <span className="text-text-light dark:text-text-dark font-medium text-center">
              {tech.name}
            </span>
            <span className="text-text-muted dark:text-text-dark text-sm text-center">
              {tech.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TechCategory;
