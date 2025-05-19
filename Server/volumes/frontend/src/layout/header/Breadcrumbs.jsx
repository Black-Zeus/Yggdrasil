import React, { useState, useEffect } from 'react';

/**
 * Breadcrumbs - Componente para la navegación de migas de pan
 */
const Breadcrumbs = () => {
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { text: 'Home', link: '#', active: false },
    { text: 'Dashboard', link: '#', active: false },
    { text: 'Analytics', link: '#', active: true }
  ]);
  
  return (
    <div className="h-10 px-8 flex items-center bg-background dark:bg-background-dark border-t border-border dark:border-border-dark transition-colors duration-300">
      <ul className="flex items-center list-none text-[0.85rem]">
        {breadcrumbItems.map((item, index) => (
          <li 
            key={index} 
            className={`flex items-center ${
              index < breadcrumbItems.length - 1 ? 'mr-2' : ''
            }`}
          >
            {item.active ? (
              <span className="text-text dark:text-text-dark font-semibold">
                {item.text}
              </span>
            ) : (
              <>
                <a 
                  href={item.link} 
                  className="text-text-secondary dark:text-text-dark-secondary hover:text-sidebar dark:hover:text-sidebar-dark hover:underline no-underline transition-colors duration-200"
                >
                  {item.text}
                </a>
                {index < breadcrumbItems.length - 1 && (
                  <span className="mx-2 text-text-secondary dark:text-text-dark-secondary">
                    ›
                  </span>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Breadcrumbs;