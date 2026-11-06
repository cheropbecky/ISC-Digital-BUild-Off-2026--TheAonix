/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas Campus Clubs & Student Societies (/community/clubs)
 */

import React from 'react';
import { useKampasStore } from '../../lib/store';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Users, Clock, Compass, Check, ArrowRight } from 'lucide-react';

export const ClubsPage: React.FC = () => {
  const { clubs, toggleClubMembership } = useKampasStore();

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-[#071B4A] dark:text-white">
            Student Guild Clubs & Societies
          </h1>
          <Badge variant="academic">Student Life</Badge>
        </div>
        <p className="text-xs text-[#5B6475] dark:text-slate-400 mt-1">
          Explore student-led academic, spiritual, recreational, and community service organizations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => (
          <Card key={club.id} padding="lg" className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-black text-[#0B2A6F] dark:text-[#93C5FD] tracking-wider uppercase">
                  {club.code}
                </span>
                <Badge variant="academic" className="capitalize">
                  {club.category}
                </Badge>
              </div>

              <h3 className="text-base font-bold text-[#071B4A] dark:text-white leading-snug mb-2">
                {club.name}
              </h3>

              <p className="text-xs text-[#5B6475] dark:text-slate-300 leading-relaxed mb-4">
                {club.description}
              </p>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#0B2A6F] dark:text-[#F2B705] shrink-0" />
                  <span>{club.meetingSchedule}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>Led by {club.leaderName} • {club.memberCount} active members</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                size="sm"
                variant={club.isJoined ? 'secondary' : 'primary'}
                onClick={() => toggleClubMembership(club.id)}
                className="w-full text-xs"
              >
                {club.isJoined ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Member (Tap to Leave)
                  </>
                ) : (
                  'Join Club Guild'
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
