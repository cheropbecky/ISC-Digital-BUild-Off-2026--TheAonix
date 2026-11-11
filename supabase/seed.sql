-- =============================================================================
-- Kampas - University of Eastern Africa, Baraton (UEAB) Realistic Seed Data
-- 12 Units, 10 Venues with indoor hints, 20 Students, 8 Alumni, 6 Events, 5 Clubs
-- =============================================================================

-- 1. VENUES (10 Venues with exact GPS coordinates & indoor directions)
INSERT INTO venues (id, name, code, building, floor, capacity, has_projector, has_power_sockets, has_wifi, is_accessible, indoor_hints, latitude, longitude, category) VALUES
('venue-amphi', 'Administration Amphitheatre', 'AMPHI-01', 'Main Administration Complex', 'Ground Floor', 220, true, true, true, true, 'Walk through main archway, first double mahogany doors on your left before the clock tower stairs.', 0.2312, 35.0872, 'auditorium'),
('venue-sciaud', 'Science Complex Auditorium', 'SCA-101', 'Faculty of Science & Technology', '1st Floor', 140, true, true, true, true, 'Take the central spiral glass staircase to Floor 1, room is immediately adjacent to the dean''s office.', 0.2325, 35.0880, 'lecture_hall'),
('venue-compmb', 'Main Computing Lab B', 'CLB-204', 'Library Learning Commons', '2nd Floor East', 65, true, true, true, true, 'Take eastern library stairs, turn right at the quiet study foyer. Lab is behind the glass double doors.', 0.2308, 35.0865, 'lab'),
('venue-nurslab', 'Nursing Simulation Lab 1', 'NSL-01', 'Health Sciences Pavilion', 'Ground Floor', 45, true, true, true, true, 'Enter Health Sciences wing from the south walkway. Follow yellow floor line to clinical ward simulator.', 0.2330, 35.0858, 'lab'),
('venue-biz204', 'Business Seminar Room 204', 'BUS-204', 'School of Business Block', '2nd Floor', 50, true, true, true, false, 'Climb stairs behind cafeteria veranda, second room on north corridor.', 0.2301, 35.0879, 'lecture_hall'),
('venue-chapel', 'Baraton University Church Hall', 'UCH-01', 'University Church Sanctuary', 'Ground Floor', 850, true, false, true, true, 'Main campus sanctuary; use west portico entrance near the prayer garden fountain.', 0.2318, 35.0869, 'auditorium'),
('venue-poly12', 'Polytechnic Engineering Workshop 12', 'PEW-12', 'Engineering & Polytechnic Annex', 'Ground Floor', 55, true, true, true, true, 'Pass through security barrier gate 2; workshop door has blue mechanical safety signage.', 0.2340, 35.0890, 'lab'),
('venue-scmp', 'Student Centre Multipurpose Hall', 'SC-MPH', 'Student Life Centre', 'Ground Floor', 180, true, true, true, true, 'Directly opposite the Campus Guild offices and postal counter.', 0.2295, 35.0870, 'service'),
('venue-botany', 'Botany & Agri Research Lab', 'AGR-BOT', 'Agricultural Sciences Pavilion', 'Ground Floor', 35, false, true, false, true, 'Path heading toward farm greenhouses; entrance through botany herbarium reception.', 0.2345, 35.0850, 'lab'),
('venue-sports', 'Baraton Gymnasium & Pavilion', 'GYM-01', 'Athletic Complex', 'Ground Floor', 350, false, false, true, true, 'Alongside the championship athletics track and basketball courts.', 0.2285, 35.0888, 'sports')
ON CONFLICT (id) DO NOTHING;

-- 2. UNITS (12 realistic UEAB courses)
INSERT INTO units (code, name, lecturer_name, department, credits, description, semester, color_tag) VALUES
('COSC 311', 'Compiler Design & Formal Automata', 'Dr. Evans Kiprop', 'School of Science & Technology', 3, 'Lexical analysis, parsing grammar, syntax-directed translation, symbol tables, code generation.', '1st Trimester 2026/2027', '#0B2A6F'),
('COSC 330', 'Advanced Database Management Systems', 'Prof. Mary Achieng', 'School of Science & Technology', 3, 'Relational calculus, query optimization, concurrency control, distributed databases, transaction isolation.', '1st Trimester 2026/2027', '#1E40AF'),
('COSC 420', 'Software Architecture & Cloud Systems', 'Eng. Dennis Cheruiyot', 'School of Science & Technology', 3, 'Microservices, DDD, continuous integration, cloud infrastructure, secure API gateways.', '1st Trimester 2026/2027', '#0369A1'),
('ENGR 210', 'Digital Logic & Microprocessors', 'Dr. Paul Mutua', 'School of Science & Technology', 4, 'Boolean algebra, sequential circuits, register transfer logic, ARM architecture assembly.', '1st Trimester 2026/2027', '#4338CA'),
('NURS 215', 'Human Anatomy & Physiology II', 'Dr. Grace Kemboi', 'School of Health Sciences', 4, 'Cardiovascular dynamics, renal physiology, endocrine regulation, clinical histology.', '1st Trimester 2026/2027', '#0D9488'),
('BBA 302', 'Strategic Management & Global Leadership', 'Prof. Samuel Njoroge', 'School of Business', 3, 'Corporate strategy, competitive market analysis, ethics, mergers, multinational governance.', '1st Trimester 2026/2027', '#0284C7'),
('COMM 111', 'Scholarly Writing & Academic Oratory', 'Dr. Sarah Rotich', 'School of Humanities', 2, 'Research citation frameworks, argumentative rhetoric, academic paper peer review.', '1st Trimester 2026/2027', '#7C3AED'),
('RELT 220', 'Christian Ethics & Social Responsibility', 'Pastor Jonathan Bett', 'Faculty of Theology', 2, 'Biblical moral philosophy, social justice, bioethics, Adventist heritage in modern healthcare.', '1st Trimester 2026/2027', '#D97706'),
('MATH 201', 'Linear Algebra with Vector Computation', 'Dr. Benson Wafula', 'School of Science & Technology', 3, 'Vector spaces, eigenvalues, matrix decompositions, discrete transforms, geometric applications.', '1st Trimester 2026/2027', '#2563EB'),
('ECON 102', 'Macroeconomic Theory & African Markets', 'Dr. Alice Kemei', 'School of Business', 3, 'National income accounting, monetary policy, inflation regimes, trade integration in EAC.', '1st Trimester 2026/2027', '#059669'),
('STAT 301', 'Applied Probability & Inferential Stats', 'Dr. Kevin Omondi', 'School of Science & Technology', 3, 'Hypothesis testing, maximum likelihood estimation, regression models, Bayesian fundamentals.', '1st Trimester 2026/2027', '#4F46E5'),
('CHEM 112', 'Organic Chemistry for Clinical Sciences', 'Dr. Esther Tanui', 'School of Health Sciences', 4, 'Stereochemistry, reaction mechanisms, biomolecules, functional group kinetics.', '1st Trimester 2026/2027', '#B91C1C')
ON CONFLICT (code) DO NOTHING;

-- 3. TIMETABLE ENTRIES
INSERT INTO timetable_entries (id, unit_code, unit_name, lecturer_name, venue_id, venue_name, day_of_week, start_time, end_time, is_venue_changed, venue_change_note) VALUES
('b3010001-0000-0000-0000-000000000001', 'COSC 311', 'Compiler Design & Formal Automata', 'Dr. Evans Kiprop', 'venue-sciaud', 'Science Complex Auditorium', 1, '08:00:00', '10:00:00', false, NULL),
('b3010001-0000-0000-0000-000000000002', 'COSC 330', 'Advanced Database Management Systems', 'Prof. Mary Achieng', 'venue-compmb', 'Main Computing Lab B', 1, '11:00:00', '13:00:00', true, 'Moved to Computing Lab B for practical SQL indexing session'),
('b3010001-0000-0000-0000-000000000003', 'RELT 220', 'Christian Ethics & Social Responsibility', 'Pastor Jonathan Bett', 'venue-chapel', 'Baraton University Church Hall', 2, '07:30:00', '09:00:00', false, NULL),
('b3010001-0000-0000-0000-000000000004', 'COSC 420', 'Software Architecture & Cloud Systems', 'Eng. Dennis Cheruiyot', 'venue-amphi', 'Administration Amphitheatre', 2, '10:00:00', '12:00:00', false, NULL),
('b3010001-0000-0000-0000-000000000005', 'MATH 201', 'Linear Algebra with Vector Computation', 'Dr. Benson Wafula', 'venue-sciaud', 'Science Complex Auditorium', 3, '09:00:00', '11:00:00', false, NULL),
('b3010001-0000-0000-0000-000000000006', 'NURS 215', 'Human Anatomy & Physiology II', 'Dr. Grace Kemboi', 'venue-nurslab', 'Nursing Simulation Lab 1', 3, '14:00:00', '17:00:00', false, NULL),
('b3010001-0000-0000-0000-000000000007', 'BBA 302', 'Strategic Management & Global Leadership', 'Prof. Samuel Njoroge', 'venue-biz204', 'Business Seminar Room 204', 4, '08:00:00', '10:00:00', false, NULL),
('b3010001-0000-0000-0000-000000000008', 'STAT 301', 'Applied Probability & Inferential Stats', 'Dr. Kevin Omondi', 'venue-sciaud', 'Science Complex Auditorium', 4, '11:00:00', '13:00:00', false, NULL),
('b3010001-0000-0000-0000-000000000009', 'ENGR 210', 'Digital Logic & Microprocessors', 'Dr. Paul Mutua', 'venue-poly12', 'Polytechnic Engineering Workshop 12', 5, '08:00:00', '11:00:00', false, NULL),
('b3010001-0000-0000-0000-000000000010', 'COMM 111', 'Scholarly Writing & Academic Oratory', 'Dr. Sarah Rotich', 'venue-scmp', 'Student Centre Multipurpose Hall', 5, '14:00:00', '16:00:00', false, NULL)
ON CONFLICT (id) DO NOTHING;

-- 4. DEADLINES
INSERT INTO deadlines (id, unit_code, title, description, due_date, category, priority, created_by_user_id, is_official) VALUES
('d1000001-0000-0000-0000-000000000001', 'COSC 311', 'Lexer & AST Parser Implementation', 'Submit your ANTLR/Flex grammar and source code repo on GitHub Classroom.', NOW() + INTERVAL '2 days', 'assignment', 'urgent', 'staff_dr_kiprop', true),
('d1000001-0000-0000-0000-000000000002', 'COSC 330', 'Postgres B-Tree Performance Benchmark', 'Comparative study of query plans with and without partial indexing.', NOW() + INTERVAL '4 days', 'project', 'important', 'staff_prof_achieng', true),
('d1000001-0000-0000-0000-000000000003', NULL, 'Trimester 1 Fee Balance Clearance 75%', 'Mandatory clearance required by the Finance office prior to exam card issuance.', NOW() + INTERVAL '6 days', 'finance', 'urgent', 'staff_finance', true),
('d1000001-0000-0000-0000-000000000004', 'NURS 215', 'Clinical Case Study on Renal Failure', '5-page typed analysis of electrolyte disturbance clinical cases.', NOW() + INTERVAL '8 days', 'assignment', 'important', 'staff_dr_kemboi', true),
('d1000001-0000-0000-0000-000000000005', NULL, 'Course Add/Drop Online Verification Deadline', 'Final sign-off by Faculty Dean and Academic Registrar.', NOW() + INTERVAL '12 days', 'registration', 'normal', 'staff_registrar', true)
ON CONFLICT (id) DO NOTHING;

-- 5. CLUBS
INSERT INTO clubs (id, name, code, category, description, leader_name, meeting_schedule, member_count) VALUES
('c1000001-0000-0000-0000-000000000001', 'Baraton Software Engineering Guild', 'BSEG', 'academic', 'Community of student developers, open-source contributors, competitive coders and cloud builders.', 'Brian Kipruto', 'Wednesdays 5:00 PM - Computing Lab B', 142),
('c1000001-0000-0000-0000-000000000002', 'Adventist Youth Ministry & Chorale', 'AYMC', 'spiritual', 'Youth ministry, choir performances, community outreach and weekly Sabbath vespers reflections.', 'Faith Jerotich', 'Fridays 6:30 PM - University Sanctuary', 230),
('c1000001-0000-0000-0000-000000000003', 'Baraton Innovation & Robotics Circle', 'BIRC', 'academic', 'Hardware hacking, IoT sensor deployments for farming, and renewable energy prototypes.', 'Dennis Cheruiyot', 'Thursdays 4:30 PM - Polytechnic Lab 12', 68),
('c1000001-0000-0000-0000-000000000004', 'Health Sciences Students Association', 'HSSA', 'service', 'Public health drives, community medical camps across Nandi County, and first-aid drills.', 'Mercy Chebet', 'Tuesdays 5:15 PM - Health Sciences Lounge', 115),
('c1000001-0000-0000-0000-000000000005', 'Baraton Hiking & Environmental Club', 'BHEC', 'recreational', 'Weekend expeditions across Nandi Escarpment, tea farm trail runs, and tree planting initiatives.', 'Kevin Mwangi', 'Sundays 6:30 AM - Sports Pavilion Gate', 95)
ON CONFLICT (id) DO NOTHING;

-- 6. EVENTS
INSERT INTO events (id, title, club_id, organizer_name, venue_id, venue_name, start_time, end_time, category, description, current_rsvps, is_published) VALUES
('e1000001-0000-0000-0000-000000000001', 'Baraton Hackathon 2026: Solutions for African Agriculture', 'c1000001-0000-0000-0000-000000000001', 'Software Engineering Guild', 'venue-sciaud', 'Science Complex Auditorium', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 8 hours', 'academic', 'Build IoT or AI tools for smallholder tea & maize farmers in the Rift Valley. Prizes sponsored by Safaricom & Microsoft ADC.', 74, true),
('e1000001-0000-0000-0000-000000000002', 'Grand Sabbath Choral Vespers & Worship', 'c1000001-0000-0000-0000-000000000002', 'Adventist Youth Ministry', 'venue-chapel', 'Baraton University Church Hall', NOW() + INTERVAL '2 days 7 hours', NOW() + INTERVAL '2 days 9 hours', 'chapel', 'Inspiring choral anthems, musical ensembles, and Sabbath sunset fellowship at the University Sanctuary.', 310, true),
('e1000001-0000-0000-0000-000000000003', 'Annual Inter-Faculty Football Derby & Athletics', NULL, 'Dean of Students & Sports Council', 'venue-sports', 'Baraton Gymnasium & Pavilion', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days 6 hours', 'sports', 'Science & Tech vs School of Business grand finals. Track relays and volleyball showdowns.', 180, true),
('e1000001-0000-0000-0000-000000000004', 'Tech Career & Internship Fair: Meet Top Alumni Recruiters', 'c1000001-0000-0000-0000-000000000001', 'Baraton Alumni Relations', 'venue-amphi', 'Administration Amphitheatre', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days 5 hours', 'career', 'Meet recruiters and UEAB alumni working at Safaricom, Equity Bank, Google, and Cellulant.', 125, true),
('e1000001-0000-0000-0000-000000000005', 'Community Health Screening & Blood Donation Camp', 'c1000001-0000-0000-0000-000000000004', 'Health Sciences Association', 'venue-scmp', 'Student Centre Multipurpose Hall', NOW() + INTERVAL '7 days', NOW() + INTERVAL '7 days 6 hours', 'social', 'Free dental, hypertension, blood sugar checks and blood drive in partnership with Kapsabet Referral Hospital.', 88, true),
('e1000001-0000-0000-0000-000000000006', 'Nandi Hills Escarpment Sunset Hike', 'c1000001-0000-0000-0000-000000000005', 'Hiking & Environmental Club', 'venue-sports', 'Sports Pavilion Gate', NOW() + INTERVAL '9 days', NOW() + INTERVAL '9 days 5 hours', 'social', 'Scenic 12km hike along the tea hills overlooking the Great Rift Valley. Packed water and trail snacks provided.', 55, true)
ON CONFLICT (id) DO NOTHING;

-- 7. ALUMNI PROFILES (8 realistic UEAB alumni)
-- (Linked to placeholder profile IDs; updated when users register)
INSERT INTO profiles (id, student_id, full_name, email, role, course, department, status, is_onboarded) VALUES
('alumni-01', 'S16/01290', 'Sharon Chepkemoi', 'sharon.chepkemoi@alumni.ueab.ac.ke', 'alumnus', 'BSc Software Engineering', 'School of Science & Technology', 'active', true),
('alumni-02', 'S17/02311', 'Kevin Omondi Otieno', 'kevin.otieno@alumni.ueab.ac.ke', 'alumnus', 'BSc Computer Networks', 'School of Science & Technology', 'active', true),
('alumni-03', 'S15/00874', 'Dr. Brenda Wanjiku', 'brenda.wanjiku@alumni.ueab.ac.ke', 'alumnus', 'Bachelor of Science in Nursing', 'School of Health Sciences', 'active', true),
('alumni-04', 'S18/03420', 'Victor Kipkoech Tanui', 'victor.tanui@alumni.ueab.ac.ke', 'alumnus', 'Bachelor of Business Administration', 'School of Business', 'active', true),
('alumni-05', 'S17/02100', 'Faith Mutheu Musyoka', 'faith.musyoka@alumni.ueab.ac.ke', 'alumnus', 'BSc Software Engineering', 'School of Science & Technology', 'active', true),
('alumni-06', 'S19/04112', 'Arnold Kiprotich', 'arnold.kiprotich@alumni.ueab.ac.ke', 'alumnus', 'BSc Applied Statistics', 'School of Science & Technology', 'active', true),
('alumni-07', 'S16/01543', 'Mercy Akoth', 'mercy.akoth@alumni.ueab.ac.ke', 'alumnus', 'BSc Public Health', 'School of Health Sciences', 'active', true),
('alumni-08', 'S18/03890', 'Edwin Bett', 'edwin.bett@alumni.ueab.ac.ke', 'alumnus', 'BSc Software Engineering', 'School of Science & Technology', 'active', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO alumni_profiles (id, user_id, graduation_year, degree, current_company, current_role, industry, location, bio, linkedin_url, is_willing_to_refer, is_mentor, is_approved) VALUES
('a1000001-0000-0000-0000-000000000001', 'alumni-01', 2020, 'BSc Software Engineering', 'Safaricom PLC', 'Senior Cloud Platform Engineer', 'Telecommunications & Fintech', 'Nairobi, Kenya', 'Leading distributed microservices at M-PESA. Passionate about mentoring Baraton engineers into global tech careers.', 'https://linkedin.com/in/sharon-chepkemoi', true, true, true),
('a1000001-0000-0000-0000-000000000002', 'alumni-02', 2021, 'BSc Computer Networks', 'Equity Group Holdings', 'Lead Information Security Analyst', 'Banking & Cyber Defense', 'Nairobi, Kenya', 'Specialized in SOC operations, zero-trust architectures, and red-teaming. Happy to review CVs and refer for security roles.', 'https://linkedin.com/in/kevin-otieno-sec', true, true, true),
('a1000001-0000-0000-0000-000000000003', 'alumni-03', 2019, 'Bachelor of Science in Nursing', 'Aga Khan University Hospital', 'Nurse Manager - Critical Care Unit', 'Healthcare & Clinical Leadership', 'Nairobi, Kenya', 'UEAB Class of 2019. Mentoring healthcare students preparing for NCLEX and East Africa Nursing Council examinations.', 'https://linkedin.com/in/dr-brenda-wanjiku', true, true, true),
('a1000001-0000-0000-0000-000000000004', 'alumni-04', 2022, 'Bachelor of Business Administration', 'KPMG East Africa', 'Senior Financial Advisory Consultant', 'Management Consulting', 'Nairobi, Kenya', 'Advising public and private sector firms on financial risk, capital structuring, and forensic accounting.', 'https://linkedin.com/in/victor-tanui-kpmg', true, false, true),
('a1000001-0000-0000-0000-000000000005', 'alumni-05', 2021, 'BSc Software Engineering', 'Microsoft Africa Development Center (ADC)', 'Software Engineer II - Office365', 'Big Tech & Cloud Productivity', 'Nairobi, Kenya', 'Building developer experiences at Microsoft ADC. Excited to mentor 3rd and 4th year SE students for tech interviews.', 'https://linkedin.com/in/faith-musyoka-dev', true, true, true),
('a1000001-0000-0000-0000-000000000006', 'alumni-06', 2023, 'BSc Applied Statistics', 'Cellulant', 'Data Analyst & Risk Modeling', 'Payments & Fintech', 'Nairobi, Kenya', 'Transforming transactional records into predictive fraud signals. Open for student queries on Python, R and SQL.', 'https://linkedin.com/in/arnold-kiprotich-data', true, false, true),
('a1000001-0000-0000-0000-000000000007', 'alumni-07', 2020, 'BSc Public Health', 'USAID Kenya', 'Monitoring & Evaluation Specialist', 'Global Health & Development', 'Kisumu, Kenya', 'Designing epidemiology surveys and maternal health interventions across Western Kenya.', 'https://linkedin.com/in/mercy-akoth-health', true, true, true),
('a1000001-0000-0000-0000-000000000008', 'alumni-08', 2022, 'BSc Software Engineering', 'Twiga Foods', 'Backend Lead Engineer', 'Agritech & Supply Chain Logistics', 'Nairobi, Kenya', 'Architecting resilient supply-chain order routing systems in Go and Node.js.', 'https://linkedin.com/in/edwin-bett-twiga', true, true, true)
ON CONFLICT (id) DO NOTHING;

-- 8. SAMPLE DOCUMENTS
INSERT INTO documents (id, title, unit_code, description, file_url, file_type, file_size_bytes, uploaded_by_user_id, uploader_name, category, status, download_count, average_rating, rating_count) VALUES
('doc10001-0000-0000-0000-000000000001', 'Compiler Design Complete Lecture Notes (Weeks 1-10)', 'COSC 311', 'Complete hand-annotated lecture slides and scanner diagrams covering LL(1) and LR parsers.', 'https://ueab-assets.edu/docs/cosc311_complete_notes.pdf', 'pdf', 3840000, 'student_rep_brian', 'Brian Kipruto (Class Rep)', 'lecture_notes', 'approved', 142, 4.90, 28),
('doc10001-0000-0000-0000-000000000002', 'COSC 330 End of Trimester Past Paper 2025', 'COSC 330', 'Official past exam paper with query optimization solutions and schema normalization proofs.', 'https://ueab-assets.edu/docs/cosc330_past_paper_2025.pdf', 'pdf', 1250000, 'alumni-01', 'Sharon Chepkemoi', 'past_paper', 'approved', 215, 4.85, 34),
('doc10001-0000-0000-0000-000000000003', 'Renal Physiology & Electrolyte Balance Study Summary', 'NURS 215', 'High-yield revision flashcards and tabular hormone comparison sheet for mid-trimester exam.', 'https://ueab-assets.edu/docs/nurs215_renal_summary.pdf', 'pdf', 2100000, 'student_mercy_chebet', 'Mercy Chebet', 'summary', 'approved', 89, 4.70, 15),
('doc10001-0000-0000-0000-000000000004', 'ARM Assembly Quick Reference Card & Opcode Tables', 'ENGR 210', 'Compact two-page laminated reference cheat sheet for microprocessor register flags.', 'https://ueab-assets.edu/docs/engr210_arm_cheatsheet.pdf', 'pdf', 840000, 'student_dennis', 'Dennis Kiprotich', 'lab_manual', 'approved', 110, 4.95, 22),
('doc10001-0000-0000-0000-000000000005', 'Linear Algebra Vector Spaces & Spectral Theorem Notes', 'MATH 201', 'Step-by-step solved sample problems from Dr. Wafula''s whiteboard tutorials.', 'https://ueab-assets.edu/docs/math201_spectral_notes.pdf', 'pdf', 1950000, 'student_joyce', 'Joyce Koech', 'lecture_notes', 'pending', 0, 0.00, 0)
ON CONFLICT (id) DO NOTHING;

-- 9. SAMPLE LOST & FOUND ITEMS
INSERT INTO lost_found_items (id, type, title, category, description, photo_url, location_found, venue_id, verification_question, handover_point, reported_by_user_id, reporter_name, status) VALUES
('lf100001-0000-0000-0000-000000000001', 'found', 'Blue Lenovo ThinkPad Charger (65W Type-C)', 'electronics', 'Found plugged into a desk power socket near the quiet corner study booths.', 'https://scontent.fnbo8-1.fna.fbcdn.net/v/t39.30808-6/842311859_122135662940846732_6867406674687758303_n.jpg?stp=dst-jpg_tt6&cstp=mx715x476&ctp=s715x476&_nc_cat=107&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_ohc=dZ8fZaHj_xQ7kNvwG1F8ns&_nc_oc=Adqkn0rfUSt8qmlBjNKtQQ3NRgf-8zztzL8rGA9i5f4lygt6J5JG94-jnbanohBhGXk&_nc_zt=23&_nc_ht=scontent.fnbo8-1.fna&_nc_gid=EcR_PLkrYyBU-mIQz6Rn3Q&_nc_ss=7b2a8&oh=00_AQQ5dhxlm5mJgN_YbnYL5F-4dKVGxFC2iVMiapUjpOunPQ&oe=6AF7A455', 'Library 2nd Floor East cubicle 14', 'venue-compmb', 'What color sticker or engraving is on the black power brick?', 'Main Library Reception Counter', 'student_rep_brian', 'Brian Kipruto', 'open'),
('lf100001-0000-0000-0000-000000000002', 'found', 'UEAB Student National ID Card in Leather Sleeve', 'documents_id', 'Brown faux leather ID wallet containing a Kenya National ID and Baraton cafeteria debit token.', NULL, 'Administration Amphitheatre Row 4 Seat 12', 'venue-amphi', 'What is the full official name and ID number on the card?', 'Main Security Gate A Desk', 'staff_guard_joseph', 'Officer Joseph Cherono', 'open'),
('lf100001-0000-0000-0000-000000000003', 'lost', 'Scientific Calculator (Casio fx-991EX ClassWiz)', 'electronics', 'Black and silver solar dual-power engineering calculator with faint pencil notes on cover.', NULL, 'Left behind in Science Complex Room 101 after Linear Algebra tutorial', 'venue-sciaud', 'What formula is carved into the inside of the plastic sliding cover?', 'Security Post B (Science Block)', 'student_kevin', 'Kevin Langat', 'open'),
('lf100001-0000-0000-0000-000000000004', 'found', 'Set of 3 Brass Keys on a Beaded Maasai Lanyard', 'keys', 'Found on the grass bench beside the University Church prayer garden.', NULL, 'Church Prayer Garden Path', 'venue-chapel', 'What colors are the beads on the beaded strap?', 'Church Pastoral Office', 'student_faith', 'Faith Jerotich', 'claimed')
ON CONFLICT (id) DO NOTHING;
