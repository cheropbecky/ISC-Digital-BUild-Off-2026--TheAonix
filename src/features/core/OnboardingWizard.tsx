/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas 3-Step Onboarding Wizard (Demo Flow 1)
 * Step 1: Course and Year
 * Step 2: Interests and Skills
 * Step 3: Notification Preferences & Quiet Hours
 * Saves to Supabase profiles and lands on Home campus map.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  GraduationCap,
  Sparkles,
  Bell,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Sliders,
  Shield,
} from 'lucide-react';

const COURSES = [
  'BSc Software Engineering',
  'BSc Computer Networks & Cyber Defense',
  'Bachelor of Science in Nursing',
  'Bachelor of Business Administration',
  'BSc Applied Statistics & Computing',
  'BSc Public Health & Epidemiology',
  'Bachelor of Education (Science)',
  'BSc Medical Laboratory Sciences',
  'BSc Agribusiness & Agri-Tech',
];

const INTERESTS_LIST = [
  'Cloud Architecture',
  'Mobile PWAs',
  'Cybersecurity',
  'Choral Singing',
  'IoT & Robotics',
  'Machine Learning',
  'Hiking & Trekking',
  'Biomedical Research',
  'Public Speaking',
  'Financial Markets',
  'Football & Athletics',
  'Adventist Youth Ministry',
];

const SKILLS_LIST = [
  'TypeScript',
  'React',
  'Python',
  'PostgreSQL',
  'Docker',
  'Git / GitHub',
  'Figma',
  'Clinical Triage',
  'Financial Accounting',
  'Data Analysis',
];

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser } = useKampasStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states
  const [course, setCourse] = useState(user.course || 'BSc Software Engineering');
  const [yearOfStudy, setYearOfStudy] = useState(user.yearOfStudy || 3);
  const [semester, setSemester] = useState(user.semester || 1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user.interests.length > 0 ? user.interests : ['Cloud Architecture', 'Mobile PWAs']
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    user.skills.length > 0 ? user.skills : ['TypeScript', 'React']
  );
  const [notifyTimetable, setNotifyTimetable] = useState(true);
  const [notifyDeadlines, setNotifyDeadlines] = useState(true);
  const [notifySocial, setNotifySocial] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('06:00');

  const toggleInterest = (tag: string) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleSkill = (tag: string) => {
    setSelectedSkills((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleFinish = () => {
    setUser((prev) => ({
      ...prev,
      course,
      yearOfStudy,
      semester,
      interests: selectedInterests,
      skills: selectedSkills,
      isOnboarded: true,
      notificationPreferences: {
        timetable: notifyTimetable,
        deadlines: notifyDeadlines,
        social: notifySocial,
        quietHoursEnabled: quietHours,
        quietStart,
        quietEnd,
      },
    }));

    // Lands on the Home campus map!
    navigate('/home');
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      {/* Wizard Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-[#5B6475] dark:text-slate-400 mb-2">
          <span>STEP {step} OF 3</span>
          <span>
            {step === 1 ? 'Academic Program' : step === 2 ? 'Interests & Skills' : 'Notification Settings'}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0B2A6F] dark:bg-[#F2B705] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <Card padding="lg" className="shadow-xl">
        {/* STEP 1: Academic Program & Year */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0B2A6F]/10 text-[#0B2A6F] dark:text-[#F2B705] flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-[#071B4A] dark:text-white">
                Confirm Your Degree Program
              </h2>
              <p className="text-xs text-[#5B6475] dark:text-slate-300 mt-1">
                This configures your default timetable units, exam clearances, and class group channels.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-1">
                  Enrolled Degree Program
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-[#F7F9FC] dark:bg-slate-900 border border-[#E3E8F0] dark:border-[#1E3158] text-sm text-[#0F172A] dark:text-white focus:outline-none focus:border-[#0B2A6F] focus:ring-2 focus:ring-[#F2B705]"
                >
                  {COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-1">
                    Year of Study
                  </label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-lg bg-[#F7F9FC] dark:bg-slate-900 border border-[#E3E8F0] dark:border-[#1E3158] text-sm text-[#0F172A] dark:text-white focus:outline-none focus:border-[#0B2A6F] focus:ring-2 focus:ring-[#F2B705]"
                  >
                    {[1, 2, 3, 4, 5].map((y) => (
                      <option key={y} value={y}>
                        Year {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-1">
                    Current Trimester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full h-11 px-3 rounded-lg bg-[#F7F9FC] dark:bg-slate-900 border border-[#E3E8F0] dark:border-[#1E3158] text-sm text-[#0F172A] dark:text-white focus:outline-none focus:border-[#0B2A6F] focus:ring-2 focus:ring-[#F2B705]"
                  >
                    <option value={1}>1st Trimester</option>
                    <option value={2}>2nd Trimester</option>
                    <option value={3}>3rd Trimester</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button onClick={() => setStep(2)}>
                Continue
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Interests & Skills */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0B2A6F]/10 text-[#0B2A6F] dark:text-[#F2B705] flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-[#071B4A] dark:text-white">
                Pick Your Interests & Skills
              </h2>
              <p className="text-xs text-[#5B6475] dark:text-slate-300 mt-1">
                Helps match you with campus study groups, hackathons, clubs, and alumni mentors.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-2">
                Campus Interests ({selectedInterests.length} selected)
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS_LIST.map((tag) => {
                  const isSelected = selectedInterests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleInterest(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-[#0B2A6F] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#071B4A] dark:text-slate-200 mb-2">
                Core Competencies & Tools
              </label>
              <div className="flex flex-wrap gap-2">
                {SKILLS_LIST.map((tag) => {
                  const isSelected = selectedSkills.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleSkill(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-[#F2B705] text-[#071B4A] font-bold shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back
              </Button>
              <Button onClick={() => setStep(3)}>
                Continue
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Notification Preferences & Quiet Hours */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0B2A6F]/10 text-[#0B2A6F] dark:text-[#F2B705] flex items-center justify-center mb-3">
                <Bell className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-[#071B4A] dark:text-white">
                Notification Preferences
              </h2>
              <p className="text-xs text-[#5B6475] dark:text-slate-300 mt-1">
                Customize what alerts you receive. Urgent alerts (venue shifts) always bypass quiet hours.
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 bg-[#F7F9FC] dark:bg-slate-800 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyTimetable}
                  onChange={(e) => setNotifyTimetable(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#0B2A6F] rounded"
                />
                <div>
                  <div className="text-xs font-bold text-[#071B4A] dark:text-white">
                    Timetable & Urgent Venue Shifts
                  </div>
                  <div className="text-[11px] text-[#5B6475] dark:text-slate-400">
                    Get alerted when a lecturer moves a lecture hall or cancels class.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-[#F7F9FC] dark:bg-slate-800 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyDeadlines}
                  onChange={(e) => setNotifyDeadlines(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#0B2A6F] rounded"
                />
                <div>
                  <div className="text-xs font-bold text-[#071B4A] dark:text-white">
                    Assignment & Fee Clearance Reminders
                  </div>
                  <div className="text-[11px] text-[#5B6475] dark:text-slate-400">
                    Automated alerts at 7 days, 3 days, and 24 hours prior to deadline.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-[#F7F9FC] dark:bg-slate-800 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifySocial}
                  onChange={(e) => setNotifySocial(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#0B2A6F] rounded"
                />
                <div>
                  <div className="text-xs font-bold text-[#071B4A] dark:text-white">
                    Study Groups, Events & Alumni Referrals
                  </div>
                  <div className="text-[11px] text-[#5B6475] dark:text-slate-400">
                    Notifies you when an alumnus accepts your job pitch or study group meets.
                  </div>
                </div>
              </label>

              {/* Quiet Hours */}
              <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-[#071B4A] dark:text-white">
                      Enable Night Quiet Hours
                    </span>
                    <p className="text-[10px] text-slate-500">
                      Mutes non-urgent notifications during sleep or study hours.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={quietHours}
                    onChange={(e) => setQuietHours(e.target.checked)}
                    className="w-4 h-4 text-[#0B2A6F] rounded"
                  />
                </label>

                {quietHours && (
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500">Quiet Starts:</span>
                      <input
                        type="time"
                        value={quietStart}
                        onChange={(e) => setQuietStart(e.target.value)}
                        className="w-full text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500">Quiet Ends:</span>
                      <input
                        type="time"
                        value={quietEnd}
                        onChange={(e) => setQuietEnd(e.target.value)}
                        className="w-full text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <Button variant="ghost" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back
              </Button>
              <Button variant="gold" onClick={handleFinish} className="font-bold">
                Finish & Open Campus Map
                <CheckCircle2 className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
