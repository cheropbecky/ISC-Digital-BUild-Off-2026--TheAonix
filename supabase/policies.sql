-- =============================================================================
-- Kampas - Supabase Row-Level Security (RLS) Policies
-- Enforces role-based access control and tenant isolation
-- Sub claim: (auth.jwt()->>'sub')
-- =============================================================================

-- Helper function to extract user ID from Clerk JWT
CREATE OR REPLACE FUNCTION current_clerk_user_id() RETURNS TEXT AS $$
  SELECT COALESCE(auth.jwt()->>'sub', '');
$$ LANGUAGE sql STABLE;

-- Helper function to check if current user is admin/staff
CREATE OR REPLACE FUNCTION is_staff_or_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = current_clerk_user_id() 
    AND role IN ('admin', 'staff', 'lecturer')
  );
$$ LANGUAGE sql STABLE;

-- ENABLE RLS ON ALL TABLES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_found_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE notice_audiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE read_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON profiles FOR SELECT USING (status = 'active' OR id = current_clerk_user_id() OR is_staff_or_admin());

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (id = current_clerk_user_id());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (id = current_clerk_user_id());

-- 2. COURSES & UNITS
CREATE POLICY "Anyone can view courses and units"
  ON courses FOR SELECT USING (true);
CREATE POLICY "Anyone can view units"
  ON units FOR SELECT USING (true);

CREATE POLICY "Staff and admin can modify units"
  ON units FOR ALL USING (is_staff_or_admin());

-- 3. REGISTRATIONS
CREATE POLICY "Students see own registrations"
  ON registrations FOR SELECT USING (user_id = current_clerk_user_id() OR is_staff_or_admin());

CREATE POLICY "Students register units"
  ON registrations FOR INSERT WITH CHECK (user_id = current_clerk_user_id());

CREATE POLICY "Students drop units"
  ON registrations FOR DELETE USING (user_id = current_clerk_user_id());

-- 4. VENUES & TIMETABLE
CREATE POLICY "Anyone can view venues"
  ON venues FOR SELECT USING (true);

CREATE POLICY "Staff/admin manage venues"
  ON venues FOR ALL USING (is_staff_or_admin());

CREATE POLICY "Anyone can view timetable"
  ON timetable_entries FOR SELECT USING (true);

CREATE POLICY "Staff/lecturer/admin update timetable"
  ON timetable_entries FOR ALL USING (is_staff_or_admin());

CREATE POLICY "Anyone can view venue changes"
  ON venue_changes FOR SELECT USING (true);

CREATE POLICY "Staff and lecturers record venue changes"
  ON venue_changes FOR INSERT WITH CHECK (is_staff_or_admin());

-- 5. DEADLINES
CREATE POLICY "Anyone can view official deadlines"
  ON deadlines FOR SELECT USING (true);

CREATE POLICY "Staff/lecturer/class_rep create deadlines"
  ON deadlines FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = current_clerk_user_id() AND role IN ('admin', 'staff', 'lecturer', 'class_rep'))
  );

CREATE POLICY "Users view and manage their deadline checkboxes"
  ON user_deadlines FOR ALL USING (user_id = current_clerk_user_id());

-- 6. DOCUMENTS & REVIEWS
CREATE POLICY "Users view approved documents"
  ON documents FOR SELECT USING (
    status = 'approved' OR uploaded_by_user_id = current_clerk_user_id() OR is_staff_or_admin()
  );

CREATE POLICY "Students upload documents"
  ON documents FOR INSERT WITH CHECK (
    uploaded_by_user_id = current_clerk_user_id() AND is_restricted = false
  );

CREATE POLICY "Class reps and lecturers approve documents"
  ON documents FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = current_clerk_user_id() AND role IN ('admin', 'lecturer', 'class_rep'))
  );

CREATE POLICY "Document reviews viewable by all"
  ON document_reviews FOR SELECT USING (true);

CREATE POLICY "Users review documents"
  ON document_reviews FOR ALL USING (user_id = current_clerk_user_id());

CREATE POLICY "Bookmarks managed by owner"
  ON bookmarks FOR ALL USING (user_id = current_clerk_user_id());

-- 7. STUDY GROUPS
CREATE POLICY "Anyone can view open study groups"
  ON study_groups FOR SELECT USING (true);

CREATE POLICY "Users create study groups"
  ON study_groups FOR INSERT WITH CHECK (created_by_user_id = current_clerk_user_id());

CREATE POLICY "Members view group details"
  ON group_members FOR SELECT USING (true);

CREATE POLICY "Users join study groups"
  ON group_members FOR ALL USING (user_id = current_clerk_user_id());

CREATE POLICY "Group sessions viewable by all"
  ON group_sessions FOR SELECT USING (true);

CREATE POLICY "Leaders schedule sessions"
  ON group_sessions FOR INSERT WITH CHECK (created_by_user_id = current_clerk_user_id());

-- 8. CLUBS & EVENTS
CREATE POLICY "Anyone can view clubs and events"
  ON clubs FOR SELECT USING (true);
CREATE POLICY "Anyone can view published events"
  ON events FOR SELECT USING (is_published = true OR is_staff_or_admin());

CREATE POLICY "Club officers and staff create events"
  ON events FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = current_clerk_user_id() AND role IN ('admin', 'staff', 'club_officer'))
  );

CREATE POLICY "Users manage RSVPs"
  ON rsvps FOR ALL USING (user_id = current_clerk_user_id());

CREATE POLICY "Users record check-in"
  ON checkins FOR ALL USING (user_id = current_clerk_user_id() OR is_staff_or_admin());

-- 9. ALUMNI, REFERRALS & MENTORSHIP
CREATE POLICY "Approved alumni are public"
  ON alumni_profiles FOR SELECT USING (
    is_approved = true OR user_id = current_clerk_user_id() OR is_staff_or_admin()
  );

CREATE POLICY "Alumni can create their profile"
  ON alumni_profiles FOR INSERT WITH CHECK (user_id = current_clerk_user_id());

CREATE POLICY "Alumni and requester view referral requests"
  ON referral_requests FOR SELECT USING (
    student_user_id = current_clerk_user_id() OR 
    EXISTS (SELECT 1 FROM alumni_profiles WHERE id = referral_requests.alumnus_id AND user_id = current_clerk_user_id()) OR
    is_staff_or_admin()
  );

CREATE POLICY "Students send referrals"
  ON referral_requests FOR INSERT WITH CHECK (student_user_id = current_clerk_user_id());

CREATE POLICY "Alumni update referral status"
  ON referral_requests FOR UPDATE USING (
    EXISTS (SELECT 1 FROM alumni_profiles WHERE id = referral_requests.alumnus_id AND user_id = current_clerk_user_id())
  );

-- 10. LOST AND FOUND
CREATE POLICY "Anyone can view lost and found items"
  ON lost_found_items FOR SELECT USING (true);

CREATE POLICY "Users report lost and found items"
  ON lost_found_items FOR INSERT WITH CHECK (reported_by_user_id = current_clerk_user_id());

CREATE POLICY "Reporters and staff update item status"
  ON lost_found_items FOR UPDATE USING (
    reported_by_user_id = current_clerk_user_id() OR is_staff_or_admin()
  );

CREATE POLICY "Users view and submit claims"
  ON claims FOR ALL USING (claimant_user_id = current_clerk_user_id() OR is_staff_or_admin());

-- 11. NOTIFICATIONS & INBOX
CREATE POLICY "Users view only their notifications"
  ON notifications FOR ALL USING (user_id = current_clerk_user_id());

CREATE POLICY "Anyone can view notices"
  ON notices FOR SELECT USING (true);

CREATE POLICY "Staff and admin manage notices"
  ON notices FOR ALL USING (is_staff_or_admin());

CREATE POLICY "Users view receipts"
  ON read_receipts FOR ALL USING (user_id = current_clerk_user_id());

-- 12. AUDIT LOG
CREATE POLICY "Staff and admin can view audit logs"
  ON audit_log FOR SELECT USING (is_staff_or_admin());

CREATE POLICY "System and users record audit actions"
  ON audit_log FOR INSERT WITH CHECK (true);
