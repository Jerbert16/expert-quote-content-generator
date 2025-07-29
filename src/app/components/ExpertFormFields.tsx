import React from 'react';
import { ExpertForm as ExpertFormType } from '@/app/types';

interface Props {
  form: ExpertFormType;
  errors: Partial<ExpertFormType>;
  handleInputChange: (field: keyof ExpertFormType) => (e: React.ChangeEvent<any>) => void;
  handleAddExpert: (e: React.FormEvent) => void;
}

const ExpertFormFields: React.FC<Props> = ({ form, errors, handleInputChange, handleAddExpert }) => (
  <form onSubmit={handleAddExpert} className="space-y-6 bg-white/15 backdrop-blur-md rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
    {/* Repeat similar structure for name, title, expertise, quote, context */}
    {/* Only showing one input for brevity here */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-100 mb-2">Expert Name *</label>
      <input
        type="text"
        value={form.name}
        onChange={handleInputChange("name")}
        className={`w-full px-4 py-3.5 bg-transparent border rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:border-blue-400 bg-white/15 ${
          errors.name ? 'border-red-400 focus:ring-red-500/70' : 'border-white/30'
        }`}
        placeholder="Enter your full name"
        required
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
    </div>
    {/* Repeat for other fields */}
    <div className="pt-4">
      <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:ring-offset-2 shadow-sm hover:shadow-md">
        Add Expert Quote
      </button>
    </div>
  </form>
);

export default ExpertFormFields;
