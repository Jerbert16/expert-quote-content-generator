import React from 'react';

interface Expert {
  name: string;
  title?: string;
  expertise?: string;
  quote: string;
  context?: string;
}

interface Props {
  experts: Expert[];
  onRemove: (index: number) => void;
}

const ExpertList: React.FC<Props> = ({ experts, onRemove }) => {
  if (experts.length === 0) return null;

  return (
    <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-4">Added Experts ({experts.length}/10)</h3>
      <div className="space-y-3">
        {experts.map((expert, index) => (
          <div key={index} className="bg-white/10 rounded-xl p-4 flex justify-between items-start">
            <div className="flex-1">
              <div className="font-medium text-white">{expert.name}</div>
              {expert.title && <div className="text-sm text-gray-300">{expert.title}</div>}
              <div className="text-sm text-gray-200 mt-2 italic">"{expert.quote}"</div>
            </div>
            <button onClick={() => onRemove(index)} className="ml-4 text-red-400 hover:text-red-300 text-sm">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertList;
