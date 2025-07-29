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
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [apiError, setApiError] = useState("");

  // Question of the Day data
  const questionOfTheDay = {
    question: "How do you use AI when it comes to content creation?",
    date: new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    responses: experts.length,
  };

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
    if (!topic.trim()) {
      setApiError("Please enter a topic for the blog post");
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
        body: JSON.stringify({ topic: topic.trim(), experts }),
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Two Column Section: Question Form + Expert Responses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        {/* Left Column: Question of the Day + Answer Form */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-xs sm:text-sm font-medium uppercase tracking-wider">
                Live Discussion
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-white mb-3 sm:mb-4 leading-tight">
              Hey Marketing Experts! 👋
            </h2>
            <p className="text-white/70 text-sm">
              Share your expertise by answering today&apos;s question.
            </p>
          </div>

          {/* Question of the Day + Answer Form */}
          <div className="bg-white/15 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow hover:shadow-lg transition-all duration-300">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-bold">?</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm sm:text-base">Question of the Day</h3>
                  <p className="text-white/60 text-xs">{questionOfTheDay.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-xs sm:text-sm">
                <div className="w-1.5 h-1.5 bg-white-400 rounded-full"></div>
                <span>{questionOfTheDay.responses} responses</span>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white/80 rounded-lg sm:rounded-xl p-3 sm:p-4 border-l-4 sm:border-l-6 border-teal-400 mb-4 sm:mb-6">
              <p className="text-gray-800 text-sm sm:text-base leading-relaxed italic font-medium">
                &quot;{questionOfTheDay.question}&quot;
              </p>
            </div>

            {/* Answer Form */}
            <form onSubmit={handleAddExpert} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-100">Your Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleInputChange("name")}
                    placeholder="First Name / Last Name"
                    className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-transparent border rounded-lg sm:rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${
                      errors.name
                        ? "border-red-400 focus:ring-red-500/70"
                        : "border-white/30 focus:ring-blue-400/70"
                    } bg-white/15 transition-colors text-sm sm:text-base`}
                    required
                  />
                  {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-100">Title & Company</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={handleInputChange("title")}
                    placeholder="CMO at Company..."
                    className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-transparent border border-white/30 rounded-lg sm:rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/70 bg-white/15 transition-colors text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-100">Area of Expertise</label>
                <input
                  type="text"
                  value={form.expertise}
                  onChange={handleInputChange("expertise")}
                  placeholder="Digital Marketing, SEO, Content Strategy..."
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-transparent border border-white/30 rounded-lg sm:rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/70 bg-white/15 transition-colors text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-100">Your Answer *</label>
                <textarea
                  rows={4}
                  value={form.quote}
                  onChange={handleInputChange("quote")}
                  placeholder="Share your thoughts on the most effective marketing strategy you&apos;ve implemented this year..."
                  className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-transparent border rounded-lg sm:rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${
                    errors.quote
                      ? "border-red-400 focus:ring-red-500/70"
                      : "border-white/30 focus:ring-blue-400/70"
                  } bg-white/15 transition-colors resize-none text-sm sm:text-base`}
                  required
                />
                {errors.quote && <p className="text-red-400 text-sm">{errors.quote}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-100">Additional Context</label>
                <textarea
                  rows={2}
                  value={form.context}
                  onChange={handleInputChange("context")}
                  placeholder="Any additional insights, examples, or background info..."
                  className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-transparent border border-white/30 rounded-lg sm:rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/70 bg-white/15 transition-colors resize-none text-sm sm:text-base"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500/70 shadow-sm hover:shadow-md text-sm sm:text-base"
              >
                Submit Your Answer
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Expert Responses */}
        <div className="space-y-4 sm:space-y-6">
          {/* Expert Responses */}
          {experts.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">
                Expert Responses ({experts.length})
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {experts.map((expert, index) => (
                  <div
                    key={index}
                    className="bg-white/15 backdrop-blur-sm border border-white/25 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:bg-white/20 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm sm:text-base truncate">{expert.name}</div>
                        {expert.title && (
                          <div className="text-xs sm:text-sm text-emerald-300 truncate">{expert.title}</div>
                        )}
                        {expert.expertise && (
                          <div className="text-xs text-blue-300 mt-1 truncate">{expert.expertise}</div>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveExpert(index)}
                        className="text-red-400 hover:text-red-300 text-xs sm:text-sm transition-colors ml-2 flex-shrink-0"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm text-gray-100 italic leading-relaxed">
                        <span className="text-white/60 text-xs uppercase tracking-wide block mb-1">Answer:</span>
                        <div className="break-words">&quot;{expert.quote}&quot;</div>
                      </div>

                      {expert.context && expert.context.trim() && (
                        <div className="text-xs sm:text-sm text-gray-200 leading-relaxed bg-white/5 rounded-lg p-3 border-l-2 border-blue-400">
                          <span className="text-white/60 text-xs uppercase tracking-wide block mb-1">Additional Context:</span>
                          <div className="break-words">{expert.context}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Placeholder when no experts */}
          {experts.length === 0 && (
            <div className="bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-dashed border-white/20">
              <div className="text-center text-white/60">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg sm:text-xl">💬</span>
                </div>
                <h3 className="font-medium mb-2 text-sm sm:text-base">No responses yet</h3>
                <p className="text-xs sm:text-sm">Expert responses will appear here after submission</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Blog Generation Section - Below Two Columns */}
      {experts.length > 0 && (
        <div className="space-y-4 sm:space-y-6">
          {/* Blog Topic */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <label className="block text-sm font-medium text-gray-100 mb-2">Blog Direction *</label>
            <input
              type="text"
              placeholder="Describe the blog you&apos;d like me to create with these responses..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 sm:px-4 py-3 sm:py-3.5 bg-transparent border border-white/30 rounded-lg sm:rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:border-blue-400 bg-white/15 transition-colors text-sm sm:text-base"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateBlog}
            disabled={isGenerating || !topic.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500/70 shadow-sm hover:shadow-md disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isGenerating ? "Generating Blog Post..." : "Generate Blog Post"}
          </button>

          {/* Error */}
          {apiError && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <p className="text-red-200 text-sm">{apiError}</p>
            </div>
          )}

          {/* Generated Content */}
          {generatedContent && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Generated Blog Post</h3>
              <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 max-h-80 sm:max-h-96 overflow-y-auto">
                <pre className="text-gray-200 text-xs sm:text-sm whitespace-pre-wrap break-words">{generatedContent}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpertForm;
