import React from 'react';

interface Props {
  topic: string;
  setTopic: (val: string) => void;
}

const TopicInput: React.FC<Props> = ({ topic, setTopic }) => (
  <div className="mb-6 bg-white/10 backdrop-blur-md rounded-2xl p-6">
    <label className="block text-sm font-medium text-gray-100 mb-2">Blog Topic *</label>
    <input
      type="text"
      placeholder="Enter the topic for your blog post..."
      value={topic}
      onChange={(e) => setTopic(e.target.value)}
      className="w-full px-4 py-3.5 bg-transparent border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:border-blue-400 transition-colors duration-200 bg-white/15"
    />
  </div>
);

export default TopicInput;
