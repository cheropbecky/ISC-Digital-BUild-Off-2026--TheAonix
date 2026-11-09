/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Career Opportunities & Attachments (/community/opportunities)
 */

import React, { useState } from 'react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Briefcase, Building, MapPin, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'internship' | 'attachment' | 'graduate_trainee';
  deadline: string;
  description: string;
  skills: string[];
}

const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Cloud Infrastructure & DevOps Intern',
    company: 'Safaricom PLC',
    location: 'Nairobi HQ / Hybrid',
    type: 'internship',
    deadline: '2026-11-30',
    description: 'Work with the M-PESA cloud reliability engineering squad. Hands-on Docker, Kubernetes and Golang service telemetry.',
    skills: ['Docker', 'Linux', 'Go', 'Kubernetes'],
  },
  {
    id: 'opp-2',
    title: 'Cybersecurity SOC Analyst Attachment',
    company: 'Equity Group Holdings',
    location: 'Nairobi Operations Center',
    type: 'attachment',
    deadline: '2026-12-15',
    description: 'Mandatory 3-month industrial attachment for Computer Networks & SE students. Log analysis, SIEM probers, incident triage.',
    skills: ['Network Security', 'Wireshark', 'Python', 'SOC'],
  },
  {
    id: 'opp-3',
    title: 'Graduate Software Engineer 2027 Cohort',
    company: 'Microsoft Africa Development Center (ADC)',
    location: 'Dunhill Towers, Nairobi',
    type: 'graduate_trainee',
    deadline: '2026-12-31',
    description: 'Full-time graduate trainee program for graduating 4th years. Competitive compensation, health insurance and international relocation assistance.',
    skills: ['Algorithms', 'C# / Java', 'System Design', 'React'],
  },
];

export const OpportunitiesPage: React.FC = () => {
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const handleApply = (id: string) => {
    setAppliedIds((prev) => [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
              Career & Internship Opportunities
            </h1>
            <Badge variant="academic">Vetted Partners</Badge>
          </div>
          <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
            Industrial attachments, tech internships, and graduate programs verified for UEAB Baraton students.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAMPLE_OPPORTUNITIES.map((opp) => {
          const isApplied = appliedIds.includes(opp.id);

          return (
            <Card key={opp.id} padding="lg" className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Badge variant="academic" className="capitalize">
                    {opp.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-[11px] font-mono text-slate-500">
                    Deadline: {opp.deadline}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#071B4A] dark:text-white mb-1">
                  {opp.title}
                </h3>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#0B2A6F] dark:text-[#93C5FD] mb-3">
                  <Building className="w-3.5 h-3.5" />
                  <span>{opp.company}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 font-normal">{opp.location}</span>
                </div>

                <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed mb-4">
                  {opp.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {opp.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  variant={isApplied ? 'secondary' : 'primary'}
                  onClick={() => handleApply(opp.id)}
                  className="w-full text-xs"
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Application Submitted ✓
                    </>
                  ) : (
                    <>
                      One-Click Fast Apply
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
