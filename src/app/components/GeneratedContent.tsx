import React from 'react';

const GeneratedContent: React.FC<{ content: string }> = ({ content }) => (
  <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6">
    <h3 className="text-white font-semibold mb-4">Generated Blog Post</h3>
    <div className="bg-white/5 rounded-xl p-4 max-h-96 overflow-y-auto">
      <pre className="text-gray-200 text-sm whitespace-pre-wrap">{content}</pre>
    </div>
  </div>
);

export default GeneratedContent;
