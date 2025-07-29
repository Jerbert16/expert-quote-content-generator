"use client";

import React from "react";
import { useExperts } from "@/app/hooks/useExperts";
import ExpertForm from "@/app/components/ExpertForm";
import ExpertList from "@/app/components/ExpertList";

export default function Home(): React.JSX.Element {
  const { experts, addExpert, removeExpert } = useExperts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' opacity='0.3'%3E%3Cpath d='M0 50h100M50 0v100'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="text-center my-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-white/80 text-sm font-medium">
                  AI-Powered Content Studio
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
                  Expert Insights
                  <br />
                  <span className="text-4xl md:text-5xl">
                    Content Generator
                  </span>
                </h1>

                <div className="flex items-center justify-center gap-4 text-white/70">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    <span className="text-sm font-medium">AI-Powered</span>
                  </div>
                  <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <span className="text-sm font-medium">Lightning Fast</span>
                  </div>
                  <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💫</span>
                    <span className="text-sm font-medium">Expert Driven</span>
                  </div>
                </div>

                <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
                  Create compelling content backed by real expert insights. Let
                  AI amplify authentic voices and build trust with your
                  audience.
                </p>
              </div>
            </header>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-violet-500 rounded-3xl blur opacity-20"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                    <ExpertForm onAddExpert={addExpert} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

  );
}
