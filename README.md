# Kampas — University of Eastern Africa, Baraton (UEAB)

> **"The campus, in one place."**

Official responsive collegiate web application and Progressive Web App (PWA) built for the students, faculty, and alumni of the **University of Eastern Africa, Baraton (UEAB)** in Nandi County, Kenya.

---

## 🏛 Platform Overview

Kampas brings together four interconnected student pillars:

1. **Navigate**: Dynamic weekly timetable with clash detection, real-time lecturer venue relocation alerts, interactive Leaflet campus map, indoor routing hints, and live free-room calculation.
2. **Share Hub**: Peer-to-peer lecture notes and past-paper revision library with Class Representative quality verification, document bookmarks, download telemetry, and study group room reservations.
3. **Community**: Campus societies, Sabbath chapel vespers, athletic derbies, fast attachment applications, and a **3-screen live Alumni Referral system** connecting students with Baraton graduates at Safaricom, Microsoft ADC, Equity Bank, and KPMG.
4. **Lost and Found**: Camera-first lost and found logging, automated match suggestions (94% confidence), anti-fraud secret ownership verification questions, and security desk custody tracking with a 14-day escalation rule.
5. **Manage & Admin**: Privileged control center for faculty and administrators featuring timetable batch CSV ingestion, facility manager, official bulletin publishing, and an immutable security audit trail.

---

## ⚡ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, React Router, Tailwind CSS v4, Lucide Icons, Zod.
- **Maps**: Leaflet with OpenStreetMap tiles (lazy-loaded).
- **Authentication**: Clerk (`@clerk/clerk-react`) with Kampas Varsity Navy & Gold theme.
- **Database & Realtime**: Supabase (`@supabase/supabase-js`) with Clerk JWT session integration and Row-Level Security (RLS).
- **PWA**: Service worker offline caching for timetable, deadlines, and digital student ID card.

---

## 🚀 Environment Configuration

Create a `.env` file in the root directory (based on `.env.example`):

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."

# Supabase Project
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Dev Role Switcher & Flows Demo (true | false)
VITE_DEV_ROLE_SWITCHER="true"
```

*Note: If environment keys are left empty, Kampas automatically activates its built-in interactive demo provider, fully seeded with realistic UEAB data so that all features and the 6 demo flows work immediately.*

---

## 📋 Manual Setup Guides

### 1. Clerk Dashboard Setup

1. Log in to [Clerk Dashboard](https://dashboard.clerk.com) and create an application named **Kampas UEAB**.
2. Under **User & Authentication > Email, Phone, Username**:
   - Enable **Username** (used for Student ID, e.g., `S21/04589`).
   - Enable **Email address** with Email Verification Code / Magic Link.
3. Under **Configure > Roles & Permissions**:
   - Add user roles stored in `publicMetadata.role`:
     `student`, `lecturer`, `class_rep`, `club_officer`, `alumnus`, `employer`, `staff`, `admin`.
4. Copy your **Publishable Key** into `VITE_CLERK_PUBLISHABLE_KEY`.

### 2. Supabase Dashboard Setup

1. Create a new Supabase project at [database.new](https://database.new) named **kampas-ueab**.
2. Open the **SQL Editor** in your Supabase dashboard:
   - Run `supabase/schema.sql` to generate all 30+ tables and full-text search indexes.
   - Run `supabase/policies.sql` to enforce Row-Level Security (RLS) rules.
   - Run `supabase/seed.sql` to populate realistic Baraton units, venues, alumni, and clubs.
3. Under **Storage**:
   - Create buckets: `documents`, `posters`, `lost-items`, `avatars`.
4. Copy your **Project URL** and **anon public key** into `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

---

## 🧪 The Six End-to-End Demo Flows

1. **First Login & Onboarding**: Sign in with Student ID `S21/04589`, complete the 3-step academic wizard (degree, skills, quiet hours), and land on the live Baraton campus map.
2. **Venue Change**: Switch role to *Lecturer*, relocate `COSC 311` from Science Complex to Computing Lab B. An urgent push alert is dispatched and the map pin routes to the new hall.
3. **Free Room & Study Group**: Open the Free Room Detector, reserve an open hall for the *Baraton Compiler Crafters*, and notify members.
4. **Share Notes & Class Rep Approval**: Upload lecture notes, switch role to *Class Rep*, verify the document in the pending queue, and publish it to the student library.
5. **Alumni Referral**: Send a candidate pitch to alumnus *Sharon Chepkemoi (Safaricom)*, switch to Alumnus persona, accept the pitch with feedback, and observe the live acceptance badge update.
6. **Lost & Found Matching**: Report a found Casio scientific calculator. A 94% match is detected, the student verifies ownership by answering the secret question, and confirms pickup at the Security Desk.
