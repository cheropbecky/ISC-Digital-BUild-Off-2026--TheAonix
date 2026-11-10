/**
- 
@license
- SPDX-License-Identifier: Apache-2.0
- Kampas React Router Configuration (Student-Side Prototype)
- Strictly student-side: No admin/staff management screens or employer portals.
- Free rooms feature/layer completely removed.
- Includes House Find (/housing, /housing/:id) and Campus GIS Map (/campus/map).
 */

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useKampasStore } from '../lib/store';
import { Layout } from './Layout';
import { LandingPage } from '../features/core/LandingPage';
import { LoginPage } from '../features/core/LoginPage';
import { OnboardingWizard } from '../features/core/OnboardingWizard';
import { HomePage } from '../features/core/HomePage';
import { TimetablePage } from '../features/navigate/TimetablePage';
import { CampusMapPage } from '../features/navigate/CampusMapPage';
import { VenuesDirectoryPage } from '../features/navigate/VenuesDirectoryPage';
import { DeadlinesPage } from '../features/navigate/DeadlinesPage';
import { UnitDetailPage } from '../features/navigate/UnitDetailPage';
import { HouseFindPage } from '../features/housing/HouseFindPage';
import { HouseDetailPage } from '../features/housing/HouseDetailPage';
import { ShareLibraryPage } from '../features/share/ShareLibraryPage';
import { UploadNotesPage } from '../features/share/UploadNotesPage';
import { StudyGroupsPage } from '../features/share/StudyGroupsPage';
import { EventsPage } from '../features/community/EventsPage';
import { ClubsPage } from '../features/community/ClubsPage';
import { AlumniDirectoryPage } from '../features/community/AlumniDirectoryPage';
import { OpportunitiesPage } from '../features/community/OpportunitiesPage';
import { CommunityEventsPage } from '../features/community/CommunityEventsPage';
import { LostFoundPage } from '../features/found/LostFoundPage';
import { NotificationsPage } from '../features/core/NotificationsPage';
import { SearchResultsPage } from '../features/core/SearchResultsPage';
import { ProfilePage } from '../features/core/ProfilePage';
import { FeedbackPage } from '../features/core/FeedbackPage';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useKampasStore();
  const location = useLocation();

  if (!isAuthenticated) {
    const destination = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(destination)}`} replace />;
  }

  return <Layout />;
};

const ProtectedOnboarding: React.FC = () => {
  const { isAuthenticated } = useKampasStore();
  return isAuthenticated ? <OnboardingWizard /> : <Navigate to="/login" replace />;
};

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Institutional Landing & Auth */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/onboarding" element={<ProtectedOnboarding />} />

      {/* Main Authenticated Application Shell */}
      <Route element={<ProtectedLayout />}>
        <Route path="/home" element={<HomePage />} />

        {/* 1. Navigate Module (GIS Map, Timetable, Deadlines, Units - NO Free Rooms) */}
        <Route path="/campus/map" element={<CampusMapPage />} />
        <Route path="/campus/timetable" element={<TimetablePage />} />
        <Route path="/campus/venues/:id" element={<VenuesDirectoryPage />} />
        <Route path="/campus/deadlines" element={<DeadlinesPage />} />
        <Route path="/campus/units/:code" element={<UnitDetailPage />} />

        {/* 2. House Find Module (Off-Campus Student Housing & Roommates) */}
        <Route path="/housing" element={<HouseFindPage />} />
        <Route path="/housing/:id" element={<HouseDetailPage />} />

        {/* 3. Share Hub Module (Notes Library, Upload, Study Groups) */}
        <Route path="/share" element={<ShareLibraryPage />} />
        <Route path="/share/upload" element={<UploadNotesPage />} />
        <Route path="/share/groups" element={<StudyGroupsPage />} />
        <Route path="/share/groups/:id" element={<StudyGroupsPage />} />

        {/* 4. Community Module (Events, Clubs, Alumni Network, Opportunities) */}
        <Route path="/community" element={<CommunityEventsPage />} />
        <Route path="/community/events" element={<EventsPage />} />
        <Route path="/community/events/:id" element={<EventsPage />} />
        <Route path="/community/clubs" element={<ClubsPage />} />
        <Route path="/community/alumni" element={<AlumniDirectoryPage />} />
        <Route path="/community/referral/:id" element={<AlumniDirectoryPage />} />
        <Route path="/community/opportunities" element={<OpportunitiesPage />} />

        {/* 5. Lost & Found Module */}
        <Route path="/found" element={<LostFoundPage />} />

        {/* 6. Core Student Utilities & Feedback */}
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/feedback" element={<FeedbackPage />} />

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
};