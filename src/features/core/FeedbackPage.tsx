/**
 * SPDX-License-Identifier: Apache-2.0
 * Kampas User Feedback & Support Page with Content-Area Campus Background
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquarePlus,
  Star,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Bug,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import feedbackHeroImage from '../../assets/images/ueab_campus_hero_1794150142310.jpg';

export const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();

  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general' | 'ui'>('general');
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError('Please fill in both the subject and your feedback message.');
      return;
    }
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="relative min-h-full w-full overflow-y-auto rounded-3xl bg-[#F3F6FC] p-4 text-[#0F172A] dark:bg-[#050E24] dark:text-white sm:p-6 lg:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80 dark:opacity-50 [background-image:radial-gradient(#91A8D0_1px,transparent_1px)] [background-size:16px_16px] dark:[background-image:radial-gradient(#49689C_1px,transparent_1px)]"
      />
      {/* Content Container */}
      <main className="relative z-10 mx-auto w-full max-w-3xl">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DCE5F7] bg-white/90 px-4 py-2 text-xs font-bold text-[#173A88] shadow-sm transition hover:border-[#9EB4E4] hover:bg-white dark:border-slate-700 dark:bg-[#0C1D3D] dark:text-blue-100 sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Portal
        </button>

        {/* Main feedback panel */}
        <div className="overflow-hidden rounded-3xl border border-[#E0E7F4] bg-white shadow-[0_20px_60px_rgba(12,35,82,0.12)] dark:border-slate-700 dark:bg-[#0C1D3D]">
          {/* Header Banner */}
          <div className="relative overflow-hidden border-b border-[#D7E2F7] bg-[#071B4A] px-5 py-6 text-white sm:px-8 sm:py-7">
            <img
              src={feedbackHeroImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071B4A]/95 via-[#0B2A6F]/85 to-[#0B2A6F]/60" />
            <div className="pointer-events-none absolute -right-8 -top-14 h-52 w-52 rounded-full border-[28px] border-white/5" />
            <div className="pointer-events-none absolute bottom-0 right-24 h-28 w-28 rounded-full bg-[#F2B705]/10 blur-2xl" />
            <div className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F2B705] text-[#071B4A] shadow-lg shadow-black/15">
                <MessageSquarePlus className="h-6 w-6" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#F2B705]">
                  Kampas Help Desk
                </div>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Feedback &amp; Support
                </h1>
              </div>
            </div>
            <p className="relative z-10 mt-4 max-w-2xl text-sm leading-relaxed text-blue-100">
              Tell us what is working, report an issue, or share an idea. Your feedback helps us make Kampas more useful for the UEAB community.
            </p>
          </div>

          {/* Form Body */}
          <div className="px-4 py-5 text-[#071B4A] dark:text-white sm:px-8 sm:py-6">
            {submitted ? (
              <div className="animate-in fade-in space-y-4 py-8 text-center sm:py-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-black sm:text-2xl">Thank you for your feedback!</h2>
                <p className="mx-auto max-w-md text-xs text-slate-600 dark:text-slate-200 sm:text-sm">
                  Your submission has been securely received by the development team. We review every suggestion to make Kampas better.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setTitle('');
                      setMessage('');
                    }}
                    className="rounded-full bg-[#071B4A] px-6 py-3 text-xs font-black text-white transition hover:bg-[#0B2A6F]"
                  >
                    Submit Another Response
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {error && (
                  <div className="flex items-start gap-2 rounded-2xl border border-red-500/40 bg-red-950/40 px-3.5 py-3 text-xs font-semibold text-red-200">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Feedback Type Selection */}
                <div>
                  <label className="mb-2 block text-xs font-extrabold text-[#172746] dark:text-slate-100">
                    What type of feedback is this?
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                      { id: 'general', label: 'General', icon: HelpCircle },
                      { id: 'bug', label: 'Bug Report', icon: Bug },
                      { id: 'feature', label: 'Feature Idea', icon: Sparkles },
                      { id: 'ui', label: 'UI / Design', icon: Star },
                    ].map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setFeedbackType(id as any)}
                        className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                          feedbackType === id
                            ? 'border-[#0B2A6F] bg-[#0B2A6F] text-white shadow-md shadow-blue-900/15 dark:border-[#F2B705] dark:bg-[#102B62]'
                            : 'border-[#DCE4F2] bg-[#F8FAFE] text-[#42516D] hover:border-[#9EB4E4] hover:bg-[#F1F5FF] dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-slate-500'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-[#F2B705]" />
                        <span className="truncate">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Scale */}
                <div>
                  <label className="mb-2 block text-xs font-extrabold text-[#172746] dark:text-slate-100">
                    Overall Experience Rating
                  </label>
                  <div className="flex items-center gap-1 sm:gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 transition hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`h-5 w-5 sm:h-6 sm:w-6 ${
                            star <= rating
                              ? 'fill-[#F2B705] text-[#F2B705]'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-500 dark:text-slate-200">
                      ({rating}/5 stars)
                    </span>
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label htmlFor="feedback-title" className="mb-1 block text-xs font-extrabold text-[#172746] dark:text-slate-100">
                    Subject / Summary
                  </label>
                  <input
                    id="feedback-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Venue search could be faster on mobile"
                    required
                    className="h-12 w-full rounded-xl border border-[#DCE4F2] bg-[#F8FAFE] px-4 text-sm text-[#071B4A] outline-none transition placeholder:text-slate-400 focus:border-[#1769FF] focus:bg-white focus:ring-4 focus:ring-[#1769FF]/10 dark:border-[#2D4575] dark:bg-[#071B4A] dark:text-white"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label htmlFor="feedback-message" className="mb-1 block text-xs font-extrabold text-[#172746] dark:text-slate-100">
                    Detailed Comments
                  </label>
                  <textarea
                    id="feedback-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your experience or suggestion in detail..."
                    required
                    className="w-full resize-none rounded-xl border border-[#DCE4F2] bg-[#F8FAFE] p-4 text-sm text-[#071B4A] outline-none transition placeholder:text-slate-400 focus:border-[#1769FF] focus:bg-white focus:ring-4 focus:ring-[#1769FF]/10 dark:border-[#2D4575] dark:bg-[#071B4A] dark:text-white"
                  />
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between px-1">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 bg-white text-[#1769FF] focus:ring-[#1769FF] dark:border-slate-600 dark:bg-[#04102D]"
                    />
                    Submit anonymously (hide my student ID)
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#0B2A6F] to-[#1769FF] text-sm font-black text-white shadow-[0_10px_25px_rgba(23,105,255,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(23,105,255,0.32)] disabled:cursor-wait disabled:opacity-70"
                >
                  {isLoading ? 'Submitting Feedback…' : 'Send Feedback'}
                  {!isLoading && <Send className="h-4 w-4 transition group-hover:translate-x-1" />}
                </button>
              </form>
            )}

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-center text-[10px] text-slate-500 dark:text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500 dark:text-emerald-400" />
              <span>Protected under UEAB data privacy & feedback standards</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
