import React, { useState } from 'react';

// Componente para preguntas de tipo ranking
const RankingQuestion = ({ id, prompt, required, items, value, onChange }) => {
    const [rankItems, setRankItems] = useState(items.map((item, index) => ({
      id: index,
      text: item,
      rank: index + 1
    })));
  
    const handleDragStart = (e, index) => {
      e.dataTransfer.setData('index', index);
    };
  
    const handleDragOver = (e) => {
      e.preventDefault();
    };
  
    const handleDrop = (e, targetIndex) => {
      e.preventDefault();
      const sourceIndex = e.dataTransfer.getData('index');
      
      const updatedItems = [...rankItems];
      const [removed] = updatedItems.splice(sourceIndex, 1);
      updatedItems.splice(targetIndex, 0, removed);
      
      // Actualizar los rankings
      const newRankItems = updatedItems.map((item, idx) => ({
        ...item,
        rank: idx + 1
      }));
      
      setRankItems(newRankItems);
      onChange(newRankItems.map(item => item.text));
    };
  
    return (
      <div>
        <p className="mb-2 text-sm text-gray-500">{prompt}</p>
        <ul className="space-y-2">
          {rankItems.map((item, index) => (
            <li
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              className="flex items-center p-2 border border-gray-300 rounded-md bg-white cursor-move"
            >
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 mr-3">
                {item.rank}
              </span>
              <span>{item.text}</span>
              <svg className="ml-auto w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default RankingQuestion;