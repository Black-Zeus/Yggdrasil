import React from 'react';

const EvaluationHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-primary-dark dark:text-text-dark">
        {title}
      </h1>
      <p className="text-text-muted dark:text-text-dark mt-2">
        {subtitle}
      </p>
    </div>
  );
};

export default EvaluationHeader;