/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Employer Portal (/employer)
 */

import React, { useState } from 'react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Briefcase, Building, Plus, CheckCircle2 } from 'lucide-react';

export const EmployerPortalPage: React.FC = () => {
  const { user } = useKampasStore();
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState('internship');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
            Employer & Recruiter Portal
          </h1>
          <Badge variant="academic">Industry Partners</Badge>
        </div>
        <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
          Post approved attachments, internships, and graduate positions directly to University of Eastern Africa, Baraton students.
        </p>
      </div>

      <Card padding="lg">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-[#071B4A] dark:text-white">
              Opportunity Submitted for Review
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Our Academic Dean and Career Placement Office reviews all postings within 24 hours prior to listing in the student directory.
            </p>
            <Button variant="secondary" onClick={() => setSubmitted(false)}>
              Post Another Opportunity
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-1">
                Position Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Graduate Cloud Software Engineer"
                required
                className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-1">
                  Opportunity Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
                >
                  <option value="internship">Internship (Paid)</option>
                  <option value="attachment">Industrial Attachment</option>
                  <option value="graduate_trainee">Graduate Trainee</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-1">
                  Target School
                </label>
                <select className="w-full h-11 px-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm">
                  <option>School of Science & Technology</option>
                  <option>School of Business</option>
                  <option>School of Health Sciences</option>
                  <option>All UEAB Students</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-1">
                Requirements & How to Apply
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention required programming skills, GPA requirements, and portal URL..."
                required
                className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" className="w-full">
                Submit Opportunity for Clearance
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
