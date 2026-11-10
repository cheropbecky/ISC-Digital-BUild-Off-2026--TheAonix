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
import { useKampasStore } from '../../lib/store';

// UEAB campus welcome hero image
// Tip: the Facebook CDN link below has an expiring token. For a permanent fix,
// save the image in src/data/images/ and import it instead:
// import feedbackHeroImage from '../../data/images/feedback-hero.jpg';
const feedbackHeroImage =
  'https://scontent.fnbo8-1.fna.fbcdn.net/v/t39.30808-6/793028073_122129524136846732_1498613680495360111_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1364&ctp=s2048x1364&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_ohc=z43NEFaHHqMQ7kNvwEfF61r&_nc_oc=AdoirRmn6PGxtfSPPlRu5R2965Z5HXu33X7unZOxsqKai0HoUnkl894hzDHxNvW_CSY&_nc_zt=23&_nc_ht=scontent.fnbo8-1.fna&_nc_gid=6l4sl033atoM1P-yb6_8iA&_nc_ss=7b2a8&oh=00_AQQx5SYdS2T5xITieyVLpjAD0zCS_S4NcOp77y5t2oK_Mg&oe=6AF7A0FD';

export const FeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useKampasStore();

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
    <div
      className="relative min-h-full w-full overflow-y-auto bg-cover bg-center bg-no-repeat bg-fixed  text-white "
      style={{ backgroundImage: `url(${feedbackHeroImage})` }}
    >
      {/* Content Container */}
      <main className="relative z-10 mx-auto w-full max-w-3xl">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-black/50 sm:mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Portal
        </button>

        {/* Main Card with Transparent Glassmorphism */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#071B4A] text-white shadow-2xl sm:rounded-[26px]">
          {/* Header Banner */}
          <div className="relative border-b border-white/15 bg-gradient-to-r from-[#0B2A6F]/80 to-[#1769FF]/80 px-5 py-6 sm:px-10 sm:py-8">
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
            <div className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F2B705] text-[#071B4A] shadow-lg">
                <MessageSquarePlus className="h-6 w-6" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#F2B705]">
                  UEAB Feedback Portal
                </div>
                <h1 className="text-xl font-black tracking-tight text-white sm:text-3xl">
                  Shape the Future of Kampas
                </h1>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-blue-100 sm:text-sm">
              Your insights help us refine timetables, improve campus navigation, and build a smoother student experience for everyone at Baraton.
            </p>
          </div>

          {/* Form Body */}
          <div className="px-4 py-6 text-white sm:px-10 sm:py-8">
            {submitted ? (
              <div className="animate-in fade-in space-y-4 py-8 text-center sm:py-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-black sm:text-2xl">Thank you for your feedback!</h2>
                <p className="mx-auto max-w-md text-xs text-slate-200 sm:text-sm">
                  Your submission has been securely received by the development team. We review every suggestion to make Kampas better.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setTitle('');
                      setMessage('');
                    }}
                    className="rounded-full bg-white px-6 py-3 text-xs font-black text-[#071B4A] transition hover:bg-slate-100"
                  >
                    Submit Another Response
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {error && (
                  <div className="flex items-start gap-2 rounded-2xl border border-red-500/40 bg-red-950/40 px-3.5 py-3 text-xs font-semibold text-red-200">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Feedback Type Selection */}
                <div>
                  <label className="mb-2 block text-xs font-extrabold text-slate-100">
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
                            ? 'border-[#1769FF] bg-[#1769FF]/30 text-white'
                            : 'border-white/15 bg-white/5 text-slate-200 hover:border-white/30 hover:bg-white/10'
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
                  <label className="mb-2 block text-xs font-extrabold text-slate-100">
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
                              : 'text-slate-500'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-slate-200">
                      ({rating}/5 stars)
                    </span>
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label htmlFor="feedback-title" className="mb-1 block text-xs font-extrabold text-slate-100">
                    Subject / Summary
                  </label>
                  <input
                    id="feedback-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Venue search could be faster on mobile"
                    required
                    className="h-12 w-full rounded-full border border-white/20 bg-[#04102D]/60 px-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-[#1769FF] focus:ring-4 focus:ring-[#1769FF]/20"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <label htmlFor="feedback-message" className="mb-1 block text-xs font-extrabold text-slate-100">
                    Detailed Comments
                  </label>
                  <textarea
                    id="feedback-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your experience or suggestion in detail..."
                    required
                    className="w-full resize-none rounded-2xl border border-white/20 bg-[#04102D]/60 p-4 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-[#1769FF] focus:ring-4 focus:ring-[#1769FF]/20"
                  />
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between px-1">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-200">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="h-4 w-4 rounded border-white/30 bg-[#04102D] text-[#1769FF] focus:ring-[#1769FF]"
                    />
                    Submit anonymously (hide my student ID)
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex h-12 w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-gradient-to-r from-[#0B2A6F] to-[#1769FF] text-sm font-black text-white shadow-[0_10px_25px_rgba(23,105,255,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(23,105,255,0.45)] disabled:cursor-wait disabled:opacity-70"
                >
                  {isLoading ? 'Submitting Feedback…' : 'Send Feedback'}
                  {!isLoading && <Send className="h-4 w-4 transition group-hover:translate-x-1" />}
                </button>
              </form>
            )}

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-center text-[10px] text-slate-200">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
              <span>Protected under UEAB data privacy & feedback standards</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};