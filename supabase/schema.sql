-- =============================================================================
-- Kampas - University of Eastern Africa, Baraton (UEAB) Database Schema
-- Compatible with PostgreSQL 15+ / Supabase
-- Uses text user_id referencing Clerk auth sub (auth.jwt()->>'sub')
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY, -- Clerk User ID (sub)
  student_id TEXT UNIQUE, -- e.g. S21/04589
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'lecturer', 'class_rep', 'club_officer', 'alumnus', 'employer', 'staff', 'admin')),
  course TEXT, -- e.g. BSc Software Engineering
  department TEXT, -- e.g. School of Science & Technology
  year_of_study INTEGER DEFAULT 1,
  semester INTEGER DEFAULT 1,
  interests TEXT[] DEFAULT '{}',
  skills TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_approval', 'suspended')),
  visibility_settings JSONB DEFAULT '{"email": true, "phone": false, "course": true, "interests": true}'::jsonb,
  notification_preferences JSONB DEFAULT '{"timetable": true, "deadlines": true, "social": true, "quiet_hours_enabled": false, "quiet_start": "22:00", "quiet_end": "06:00"}'::jsonb,
  is_onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COURSES & ACADEMICS
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE, -- e.g. BSSE
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  duration_years INTEGER DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS units (
  code TEXT PRIMARY KEY, -- e.g. COSC 311
  name TEXT NOT NULL, -- e.g. Compiler Design
  lecturer_name TEXT NOT NULL,
  lecturer_id TEXT, -- References profiles(id)
  department TEXT NOT NULL,
  credits INTEGER DEFAULT 3,
  description TEXT,
  semester TEXT DEFAULT '1st Trimester 2026/2027',
  color_tag TEXT DEFAULT '#0B2A6F',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  unit_code TEXT NOT NULL REFERENCES units(code) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, unit_code)
);

-- 3. VENUES & MAP
CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY, -- e.g. VENUE_HALL_A
  name TEXT NOT NULL, -- e.g. Administration Amphitheatre
  code TEXT NOT NULL UNIQUE,
  building TEXT NOT NULL, -- e.g. Main Administration Complex
  floor TEXT NOT NULL, -- e.g. Ground Floor
  capacity INTEGER NOT NULL DEFAULT 80,
  has_projector BOOLEAN DEFAULT TRUE,
  has_power_sockets BOOLEAN DEFAULT TRUE,
  has_wifi BOOLEAN DEFAULT TRUE,
  is_accessible BOOLEAN DEFAULT TRUE,
  indoor_hints TEXT, -- e.g. Entrance on the east veranda behind the clock tower
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  category TEXT DEFAULT 'lecture_hall' CHECK (category IN ('lecture_hall', 'lab', 'library', 'auditorium', 'sports', 'admin', 'service')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS timetable_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_code TEXT NOT NULL REFERENCES units(code) ON DELETE CASCADE,
  unit_name TEXT NOT NULL,
  lecturer_name TEXT NOT NULL,
  venue_id TEXT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  venue_name TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday, 7=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  recurrence TEXT DEFAULT 'weekly',
  original_venue_id TEXT REFERENCES venues(id),
  is_venue_changed BOOLEAN DEFAULT FALSE,
  venue_change_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS venue_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timetable_entry_id UUID NOT NULL REFERENCES timetable_entries(id) ON DELETE CASCADE,
  old_venue_id TEXT NOT NULL REFERENCES venues(id),
  new_venue_id TEXT NOT NULL REFERENCES venues(id),
  reason TEXT NOT NULL,
  changed_by_user_id TEXT NOT NULL,
  changed_by_name TEXT NOT NULL,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DEADLINES & CLEARANCE
CREATE TABLE IF NOT EXISTS deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_code TEXT REFERENCES units(code) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('assignment', 'project', 'exam', 'clearance', 'finance', 'registration')),
  priority TEXT NOT NULL DEFAULT 'important' CHECK (priority IN ('normal', 'important', 'urgent')),
  created_by_user_id TEXT NOT NULL,
  is_official BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deadline_id UUID NOT NULL REFERENCES deadlines(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(deadline_id, user_id)
);

-- 5. SHARE HUB (Documents, Reviews, Study Groups)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  unit_code TEXT NOT NULL REFERENCES units(code) ON DELETE CASCADE,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- e.g. pdf, docx, pptx
  file_size_bytes BIGINT NOT NULL,
  uploaded_by_user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  uploader_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('lecture_notes', 'past_paper', 'assignment_solution', 'summary', 'lab_manual')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by_user_id TEXT,
  approval_notes TEXT,
  download_count INTEGER DEFAULT 0,
  average_rating NUMERIC(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,
  is_exam_paper BOOLEAN DEFAULT FALSE,
  is_restricted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS document_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_id, user_id)
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, document_id)
);

CREATE TABLE IF NOT EXISTS study_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  unit_code TEXT NOT NULL REFERENCES units(code) ON DELETE CASCADE,
  description TEXT,
  created_by_user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  creator_name TEXT NOT NULL,
  max_members INTEGER DEFAULT 8,
  preferred_venue_id TEXT REFERENCES venues(id),
  is_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE TABLE IF NOT EXISTS group_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES study_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  venue_id TEXT NOT NULL REFERENCES venues(id),
  venue_name TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes TEXT,
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COMMUNITY (Clubs, Events, Mentorship, Alumni, Opportunities)
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('academic', 'spiritual', 'recreational', 'service', 'cultural')),
  description TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  leader_user_id TEXT,
  meeting_venue_id TEXT REFERENCES venues(id),
  meeting_schedule TEXT,
  avatar_url TEXT,
  member_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS club_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('president', 'officer', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(club_id, user_id)
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
  organizer_name TEXT NOT NULL,
  venue_id TEXT NOT NULL REFERENCES venues(id),
  venue_name TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('academic', 'chapel', 'sports', 'social', 'career')),
  description TEXT NOT NULL,
  poster_url TEXT,
  max_capacity INTEGER,
  current_rsvps INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  qr_code_secret TEXT DEFAULT uuid_generate_v4()::text,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlist', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  verified_by TEXT,
  UNIQUE(event_id, user_id)
);

CREATE TABLE IF NOT EXISTS alumni_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  graduation_year INTEGER NOT NULL,
  degree TEXT NOT NULL,
  current_company TEXT NOT NULL,
  current_role TEXT NOT NULL,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  bio TEXT,
  linkedin_url TEXT,
  is_willing_to_refer BOOLEAN DEFAULT TRUE,
  is_mentor BOOLEAN DEFAULT TRUE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referral_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumnus_id UUID NOT NULL REFERENCES alumni_profiles(id) ON DELETE CASCADE,
  student_user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  target_company TEXT NOT NULL,
  target_role TEXT NOT NULL,
  pitch_statement TEXT NOT NULL,
  resume_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'declined')),
  alumnus_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mentor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumnus_id UUID NOT NULL REFERENCES alumni_profiles(id) ON DELETE CASCADE,
  specialties TEXT[] DEFAULT '{}',
  max_mentees INTEGER DEFAULT 3,
  current_mentees INTEGER DEFAULT 0,
  availability_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mentor_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentor_id UUID NOT NULL REFERENCES mentor_profiles(id) ON DELETE CASCADE,
  mentee_user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mentee_name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  goals TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mentor_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES mentor_matches(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  topic TEXT NOT NULL,
  meeting_link TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'conducted', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_logo_url TEXT,
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('internship', 'attachment', 'graduate_trainee', 'entry_level')),
  description TEXT NOT NULL,
  requirements TEXT[] DEFAULT '{}',
  posted_by_user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_approved BOOLEAN DEFAULT FALSE,
  deadline DATE NOT NULL,
  apply_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  cover_note TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'shortlisted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(opportunity_id, user_id)
);

-- 7. LOST AND FOUND
CREATE TABLE IF NOT EXISTS lost_found_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('electronics', 'documents_id', 'keys', 'bags', 'clothing', 'books', 'other')),
  description TEXT NOT NULL,
  photo_url TEXT,
  location_found TEXT NOT NULL, -- e.g. Library 2nd floor cubicle
  venue_id TEXT REFERENCES venues(id),
  verification_question TEXT NOT NULL, -- e.g. What color is the lanyard? Or what sticker is on the laptop lid?
  verification_answer_hash TEXT, -- Hidden or staff-verified
  handover_point TEXT NOT NULL DEFAULT 'Main Security Desk', -- e.g. Security Post A, Library Reception, Student Affairs
  reported_by_user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reporter_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'matched', 'claimed', 'escalated_security')),
  escalated_at TIMESTAMPTZ, -- Auto-escalated after 14 days
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lost_found_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lost_item_id UUID NOT NULL REFERENCES lost_found_items(id) ON DELETE CASCADE,
  found_item_id UUID NOT NULL REFERENCES lost_found_items(id) ON DELETE CASCADE,
  match_confidence NUMERIC(3,2) DEFAULT 0.85,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed_match', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES lost_found_items(id) ON DELETE CASCADE,
  claimant_user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  claimant_name TEXT NOT NULL,
  claimant_answer TEXT NOT NULL,
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved_for_collection', 'collected', 'rejected')),
  verified_by_user_id TEXT,
  collected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. NOTICES & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('academic', 'chapel', 'clearance', 'general', 'emergency')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'urgent')),
  posted_by_user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  poster_name TEXT NOT NULL,
  requires_acknowledgement BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notice_audiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notice_id UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
  audience_type TEXT NOT NULL CHECK (audience_type IN ('all', 'course', 'year', 'role', 'unit')),
  target_value TEXT NOT NULL -- e.g. 'all', 'BSSE', '3', 'student', 'COSC 311'
);

CREATE TABLE IF NOT EXISTS read_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notice_id UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  acknowledged_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(notice_id, user_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'venue_change', 'deadline_approaching', 'document_approved', 'referral_accepted', 'lost_item_matched', etc.
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link TEXT,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'important', 'urgent')),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  keys JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDIT LOG & REPORTS
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_user_id TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('document', 'event', 'club', 'lost_item', 'user')),
  content_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
  resolved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. POSTGRES FULL-TEXT SEARCH INDEXES
CREATE INDEX IF NOT EXISTS idx_units_fts ON units USING gin(to_tsvector('english', code || ' ' || name || ' ' || lecturer_name || ' ' || department));
CREATE INDEX IF NOT EXISTS idx_venues_fts ON venues USING gin(to_tsvector('english', name || ' ' || code || ' ' || building || ' ' || indoor_hints));
CREATE INDEX IF NOT EXISTS idx_events_fts ON events USING gin(to_tsvector('english', title || ' ' || description || ' ' || organizer_name || ' ' || venue_name));
CREATE INDEX IF NOT EXISTS idx_documents_fts ON documents USING gin(to_tsvector('english', title || ' ' || unit_code || ' ' || description || ' ' || category));
CREATE INDEX IF NOT EXISTS idx_clubs_fts ON clubs USING gin(to_tsvector('english', name || ' ' || code || ' ' || description || ' ' || category));
CREATE INDEX IF NOT EXISTS idx_lost_items_fts ON lost_found_items USING gin(to_tsvector('english', title || ' ' || description || ' ' || location_found || ' ' || category));
CREATE INDEX IF NOT EXISTS idx_profiles_fts ON profiles USING gin(to_tsvector('english', full_name || ' ' || email || ' ' || coalesce(course, '') || ' ' || coalesce(student_id, '')));
