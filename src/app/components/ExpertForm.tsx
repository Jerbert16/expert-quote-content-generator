"use client";

import React, { useState } from "react";
import { ExpertForm as ExpertFormType } from "@/app/types";
import { validateExpertForm } from "@/app/lib/utils";

interface Expert {
  name: string;
  title?: string;
  expertise?: string;
  quote: string;
  context?: string;
}

interface ExpertFormProps {
  onAddExpert?: (expert: ExpertFormType) => void;
}

const ExpertForm: React.FC<ExpertFormProps> = ({ onAddExpert }) => {
  const [form, setForm] = useState<ExpertFormType>({
    name: "",
    title: "",
    expertise: "",
    quote: "",
    context: "",
  });

  const [errors, setErrors] = useState<Partial<ExpertFormType>>({});
  const [experts, setExperts] = useState<Expert[]>([]);
  const [questionOfTheDay, setQuestionOfTheDay] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [apiError, setApiError] = useState("");

  const handleInputChange =
    (field: keyof ExpertFormType) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const handleAddExpert = (e: React.FormEvent): void => {
    e.preventDefault();
    const newErrors: Partial<ExpertFormType> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.quote.trim()) newErrors.quote = "Quote is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (validateExpertForm(form)) {
      const newExpert: Expert = { ...form };
      setExperts((prev) => [...prev, newExpert]);
      if (onAddExpert) onAddExpert(form);
      setForm({ name: "", title: "", expertise: "", quote: "", context: "" });
      setErrors({});
      setApiError("");
    }
  };

  const handleRemoveExpert = (index: number) => {
    setExperts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateBlog = async () => {
    if (!questionOfTheDay.trim()) {
      setApiError("Please enter a question of the day for the blog post");
      return;
    }
    if (experts.length === 0) {
      setApiError("Please add at least one expert quote");
      return;
    }

    setIsGenerating(true);
    setApiError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: questionOfTheDay.trim(), experts }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to generate content");
      setGeneratedContent(data.content);
    } catch (error) {
      console.error("Error generating blog post:", error);
      setApiError(error instanceof Error ? error.message : "Failed to generate blog post");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-5">
      {/* Left Column: Intro + Form */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">
              Live Discussion
            </span>
          </div>
          <h2 className="text-[32px] font-bold text-white mb-4 leading-tight">
            Hey Marketing Experts! 👋
          </h2>
          <p className="text-white/70 text-sm">
            Add your quote and join the blog creation process.
          </p>
        </div>

        {/* Expert Form */}
        <form
          onSubmit={handleAddExpert}
          className="space-y-6 bg-white/15 backdrop-blur-md rounded-2xl p-6 shadow hover:shadow-lg transition-all duration-300"
        >
          {[
            { label: "Expert Name *", field: "name", required: true },
            { label: "Title / Position & Company", field: "title" },
            { label: "Area of Expertise", field: "expertise" },
          ].map(({ label, field, required }) => (
            <div key={field} className="space-y-2">
              <label className="block text-sm font-medium text-gray-100">{label}</label>
              <input
                type="text"
                value={form[field as keyof ExpertFormType]}
                onChange={handleInputChange(field as keyof ExpertFormType)}
                placeholder={label}
                className={`w-full px-4 py-3.5 bg-transparent border rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${
                  errors[field as keyof ExpertFormType]
                    ? "border-red-400 focus:ring-red-500/70"
                    : "border-white/30 focus:ring-blue-400/70"
                } bg-white/15 transition-colors`}
                required={required}
              />
              {errors[field as keyof ExpertFormType] && (
                <p className="text-red-400 text-sm">{errors[field as keyof ExpertFormType]}</p>
              )}
            </div>
          ))}

          {/* Quote */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-100">Expert Quote *</label>
            <textarea
              rows={3}
              value={form.quote}
              onChange={handleInputChange("quote")}
              placeholder="Share a quote..."
              className={`w-full px-4 py-3.5 bg-transparent border rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${
                errors.quote
                  ? "border-red-400 focus:ring-red-500/70"
                  : "border-white/30 focus:ring-blue-400/70"
              } bg-white/15 transition-colors resize-none`}
              required
            />
            {errors.quote && <p className="text-red-400 text-sm">{errors.quote}</p>}
          </div>

          {/* Context */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-100">Additional Context</label>
            <textarea
              rows={2}
              value={form.context}
              onChange={handleInputChange("context")}
              placeholder="Optional background info..."
              className="w-full px-4 py-3.5 bg-transparent border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/70 bg-white/15 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500/70 shadow-sm hover:shadow-md"
          >
            Add Expert Quote
          </button>
        </form>
      </div>

      {/* Right Column: Question of the Day + Expert List + Generation */}
      <div className="space-y-6">
        {/* Question of the Day */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <label className="block text-sm font-medium text-gray-100 mb-2">Question of the Day *</label>
          <input
            type="text"
            placeholder="What's today's burning question?"
            value={questionOfTheDay}
            onChange={(e) => setQuestionOfTheDay(e.target.value)}
            className="w-full px-4 py-3.5 bg-transparent border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:border-blue-400 bg-white/15 transition-colors"
          />
        </div>

        {/* Expert List */}
        {experts.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Added Experts ({experts.length}/10)</h3>
            <div className="space-y-3">
              {experts.map((expert, index) => (
                <div
                  key={index}
                  className="bg-white/10 rounded-xl p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <div className="font-medium text-white">{expert.name}</div>
                    {expert.title && <div className="text-sm text-gray-300">{expert.title}</div>}
                    <div className="text-sm text-gray-200 mt-2 italic">"{expert.quote}"</div>
                  </div>
                  <button
                    onClick={() => handleRemoveExpert(index)}
                    className="ml-4 text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generate Button */}
        {experts.length > 0 && (
          <button
            onClick={handleGenerateBlog}
            disabled={isGenerating || !questionOfTheDay.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/70 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating Blog Post..." : "Generate Blog Post"}
          </button>
        )}

        {/* Error */}
        {apiError && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
            <p className="text-red-200">{apiError}</p>
          </div>
        )}

        {/* Generated Content */}
        {generatedContent && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4">Generated Blog Post</h3>
            <div className="bg-white/5 rounded-xl p-4 max-h-96 overflow-y-auto">
              <pre className="text-gray-200 text-sm whitespace-pre-wrap">{generatedContent}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertForm;