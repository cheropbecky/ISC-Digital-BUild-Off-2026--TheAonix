/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Kampas React Router Configuration
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { LandingPage } from '../features/core/LandingPage';
import { LoginPage } from '../features/core/LoginPage';
import { OnboardingWizard } from '../features/core/OnboardingWizard';
import { HomePage } from '../features/core/HomePage';
import { TimetablePage } from '../features/navigate/TimetablePage';
import { VenuesDirectoryPage } from '../features/navigate/VenuesDirectoryPage';
import { FreeRoomsPage } from '../features/navigate/FreeRoomsPage';
import { DeadlinesPage } from '../features/navigate/DeadlinesPage';
import { UnitDetailPage } from '../features/navigate/UnitDetailPage';
import { ShareLibraryPage } from '../features/share/ShareLibraryPage';
import { UploadNotesPage } from '../features/share/UploadNotesPage';
import { StudyGroupsPage } from '../features/share/StudyGroupsPage';
import { EventsPage } from '../features/community/EventsPage';
import { ClubsPage } from '../features/community/ClubsPage';
import { AlumniDirectoryPage } from '../features/community/AlumniDirectoryPage';
import { OpportunitiesPage } from '../features/community/OpportunitiesPage';
import { EmployerPortalPage } from '../features/community/EmployerPortalPage';
import { LostFoundPage } from '../features/found/LostFoundPage';
import { NotificationsPage } from '../features/core/NotificationsPage';
import { SearchResultsPage } from '../features/core/SearchResultsPage';
import { ProfilePage } from '../features/core/ProfilePage';
import { ManagePage } from '../features/manage/ManagePage';
import { RequireRole } from '../components/shared/RequireRole';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing & Auth */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<OnboardingWizard />} />

      {/* Main Authenticated Application Shell */}
      <Route element={<Layout />}>
        <Route path="/home" element={<HomePage />} />

        {/* 1. Navigate Module */}
        <Route path="/campus/timetable" element={<TimetablePage />} />
        <Route path="/campus/venues/:id" element={<VenuesDirectoryPage />} />
        <Route path="/campus/free-rooms" element={<FreeRoomsPage />} />
        <Route path="/campus/deadlines" element={<DeadlinesPage />} />
        <Route path="/campus/units/:code" element={<UnitDetailPage />} />

        {/* 2. Share Hub Module */}
        <Route path="/share" element={<ShareLibraryPage />} />
        <Route path="/share/upload" element={<UploadNotesPage />} />
        <Route path="/share/groups" element={<StudyGroupsPage />} />
        <Route path="/share/groups/:id" element={<StudyGroupsPage />} />

        {/* 3. Community Module */}
        <Route path="/community/events" element={<EventsPage />} />
        <Route path="/community/events/:id" element={<EventsPage />} />
        <Route path="/community/clubs" element={<ClubsPage />} />
        <Route path="/community/alumni" element={<AlumniDirectoryPage />} />
        <Route path="/community/referral/:id" element={<AlumniDirectoryPage />} />
        <Route path="/community/opportunities" element={<OpportunitiesPage />} />
        <Route path="/employer" element={<EmployerPortalPage />} />

        {/* 4. Lost & Found Module */}
        <Route path="/found" element={<LostFoundPage />} />

        {/* 5. Core Utilities */}
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* 6. Manage Module (Staff and Admin Only - Students Never See /manage) */}
        <Route
          path="/manage"
          element={
            <RequireRole allowedRoles={['admin', 'staff', 'lecturer']}>
              <ManagePage />
            </RequireRole>
          }
        />

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
};
