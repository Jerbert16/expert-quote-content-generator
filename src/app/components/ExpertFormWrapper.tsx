'use client';

import React, { useState } from 'react';
import { ExpertForm as ExpertFormType } from '@/app/types';
import { validateExpertForm } from '@/app/lib/utils';
import TopicInput from './TopicInput';
import ExpertFormFields from './ExpertFormFields';
import ExpertList from './ExpertList';
import GeneratedContent from './GeneratedContent';

interface Expert {
  name: string;
  title?: string;
  expertise?: string;
  quote: string;
  context?: string;
}

const ExpertFormWrapper = () => {
  const [form, setForm] = useState<ExpertFormType>({
    name: '', title: '', expertise: '', quote: '', context: ''
  });
  const [errors, setErrors] = useState<Partial<ExpertFormType>>({});
  const [experts, setExperts] = useState<Expert[]>([]);
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [apiError, setApiError] = useState('');

  const handleInputChange = (field: keyof ExpertFormType) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

  const handleAddExpert = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<ExpertFormType> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.quote.trim()) newErrors.quote = 'Quote is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (validateExpertForm(form)) {
      const newExpert: Expert = { ...form };
      setExperts((prev) => [...prev, newExpert]);
      setForm({ name: '', title: '', expertise: '', quote: '', context: '' });
      setErrors({});
      setApiError('');
    }
  };

  const handleRemoveExpert = (index: number) => {
    setExperts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateBlog = async () => {
    if (!topic.trim()) {
      setApiError('Please enter a topic for the blog post');
      return;
    }
    if (experts.length === 0) {
      setApiError('Please add at least one expert quote');
      return;
    }

    setIsGenerating(true);
    setApiError('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, experts })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to generate content');
      setGeneratedContent(data.content);
    } catch (error) {
      console.error(error);
      setApiError(error instanceof Error ? error.message : 'Failed to generate blog post');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative rounded-3xl p-8 overflow-hidden space-y-8">
      <div className="relative z-10">
        <TopicInput topic={topic} setTopic={setTopic} />
        <ExpertFormFields
          form={form}
          errors={errors}
          handleInputChange={handleInputChange}
          handleAddExpert={handleAddExpert}
        />
        <ExpertList experts={experts} onRemove={handleRemoveExpert} />
        {experts.length > 0 && (
          <div className="mt-6">
            <button
              onClick={handleGenerateBlog}
              disabled={isGenerating || !topic.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:ring-offset-2 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating Blog Post...' : 'Generate Blog Post'}
            </button>
          </div>
        )}
        {apiError && (
          <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-xl p-4">
            <p className="text-red-200">{apiError}</p>
          </div>
        )}
        {generatedContent && <GeneratedContent content={generatedContent} />}
      </div>
    </div>
  );
};

export default ExpertFormWrapper;
