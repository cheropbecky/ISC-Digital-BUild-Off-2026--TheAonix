# Kampas — University of Eastern Africa, Baraton

> **The campus, in one place.**

Kampas is a responsive student platform and Progressive Web App (PWA) built specifically for the **University of Eastern Africa, Baraton (UEAB)** in Nandi County, Kenya. Developed for the **ISC Digital Build-Off Hackathon 2026** under the *Campus Problems* theme, Kampas integrates campus navigation, timetables, housing, study resources, community activities, and lost-and-found services into a single offline-first student interface designed to perform reliably even on weak campus data.

---

## 👥 Project Team & Roles

| Name | Student ID | Assigned Project Role | Core Responsibilities & Contributions |
| --- | --- | --- | --- |
| **Becky Cherop** *(Team Leader)* | SKIPCH2511 | Frontend Developer & UI Specialist | Designed and implemented responsive user interfaces, navigation layouts, campus maps, timetable viewers, and the feedback module using React, Tailwind CSS, and Vite. |
| **Jacob Sihul** | SSIHOT2511 | Backend & API Developer | Handled backend routing, authentication workflows, Supabase replication logic, and M-Pesa Daraja payment integration endpoints. |
| **Nathan Kimutai** | SKIMNA2511 | Database Engineer | Architected the Supabase PostgreSQL database schema, relational tables, indexing, and offline-first SQLite-Wasm local caching layers. |
| **Thabita Jeptoo** | STHAJE2511 | DevOps & QA Specialist | Managed GitHub branch workflows (`Becky`), Vercel production deployments, quality assurance, cross-device testing, and artifact documentation. |

---

## 📌 Problem Statement and Research

### The Challenge

Students at UEAB face a fragmented digital ecosystem where critical academic and campus life information is scattered across disparate noticeboards, unoptimized manual schedules, social media groups, and offline word-of-mouth. Key pain points identified through campus interviews and student surveys include:

- **Timetable & Venue Confusion:** Frequent last-minute venue changes and overlapping class schedules leading to missed CATs and lectures.
- **Housing Inefficiencies:** Difficulty finding verified, secure off-campus rentals without exorbitant broker fees or unreliable listings.
- **Resource Isolation:** Scattered lecture notes, past papers, and study groups making collaborative learning difficult.
- **Connectivity Barriers:** Standard web portals failing or lagging during peak hours due to unreliable campus bandwidth.

### Target Audience

- **Undergraduate & Postgraduate Students:** Needing quick access to academic schedules, GPS campus guidance, and verified housing.
- **Lecturers & Faculty:** Managing venue updates, notices, and class rosters.
- **Landlords & Alumni:** Offering verified student rentals, mentorship, and career referrals.

---

## 🚀 Proposed Solution & Core Features

- **Campus Home Dashboard:** At-a-glance overview of upcoming classes, pending deadlines, campus events, and housing highlights.
- **Timetable & Calendar:** Weekly and daily schedules with automated clash detection, venue relocation alerts, personal event creation, and ICS export.
- **UEAB Campus GIS Map:** Interactive Leaflet and OpenStreetMap interface centered on Baraton with searchable venue markers, walking directions via OSRM, and official campus imagery.
- **House Find (Off-Campus Rentals):** Verified student housing directory with neighborhood filters, water/Wi-Fi badges, and secure direct inquiry messaging.
- **Share Hub (Notes Library):** Collaborative repository for lecture notes, past papers, revision summaries, and study group matchmaking.
- **Community & Events Hub:** School-filtered club activities, alumni career directories, referral flows, and event RSVPs.
- **Lost & Found Desk:** Camera-first item reporting with automated match suggestions and secure verification questions.
- **Feedback & Support Portal:** Direct student-to-developer feedback channel for bug reports and UI suggestions with satisfaction ratings.

---

## 📐 System Design & Architecture

### 1. Use Case Diagram

The system actors (Student, Lecturer, Alumni, Landlord, and Admin) interact with Kampas modules ranging from timetable management to housing and community moderation.

![Use Case Diagram](Kampas-UseCase%20Diagram.png)

### 2. Data Flow Diagram (DFD)

Illustrates how data moves between external entities (Students, Lecturers, Admin, Alumni, Landlords), central processes (Timetable, Navigation, Housing, Share Hub, Lost & Found), and data stores (D1 to D9).

![Data Flow Diagram](Kampas%20DFD.png)

### 3. Entity-Relationship Diagram (ERD / EER)

The relational schema powering Kampas, featuring normalized tables for units, timetable entries, housing listings, lost and found items, user profiles, and audit logs.

![ERD Schema](Untitled%20(1).png)

### 4. Low-Fidelity Wireframes

UI wireframes mapping out the desktop (1440x900) layout across all core modules.

![Wireframes](wireframes.png)

---

## 🛠️ Technology Stack

| Layer | Tools |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite, React Router, Tailwind CSS v4, Motion (Framer Motion) |
| **Mapping & GIS** | Leaflet, React Leaflet, Leaflet MarkerCluster, OpenStreetMap tiles, OSRM routing |
| **Database & Storage** | Supabase (PostgreSQL), SQLite-Wasm / sql.js for offline-first local persistence |
| **Authentication & Validation** | Clerk, Zod |
| **Deployment & Tooling** | Vercel, Vite PWA, Git |

---

## 📂 Project Structure

```text
src/
├── app/                 # Application layout, routing, and protected shells
├── components/          # Shared UI elements, navigation sidebar, and map wrappers
├── data/                # UEAB venues, timetable, events, images, and mock datasets
├── features/            # Modular features: home, navigate, housing, share, community, found, feedback
├── lib/                 # Global store, Supabase client, utilities, and permissions
└── services/            # Timetable, search, and application service logic
```

### Key Source Files

- `src/features/core/HomePage.tsx`: Campus Home dashboard.
- `src/features/core/FeedbackPage.tsx`: User feedback and support portal.
- `src/features/navigate/TimetablePage.tsx`: Timetable, clash detection, and calendar interface.
- `src/features/navigate/CampusMapPage.tsx`: Dedicated campus GIS map.
- `src/components/layout/Sidebar.tsx`: Fixed desktop sidebar with collapsible navigation.
- `src/data/venues.ts`: UEAB Baraton venue directory and GPS coordinates.

---

## 🎥 Video Walkthrough & Live Demo

- **YouTube Demo Walkthrough:** [https://youtu.be/oVPTXHhnves](https://youtu.be/oVPTXHhnves)
- **Live Vercel Deployment:** [Insert Live App URL Here]

---

## ⚙️ How to Run the Project

### Prerequisites

- Node.js (v18 or newer)
- npm package manager

### 1. Clone the Repository

```bash
git clone https://github.com/cheropbecky/KAMPAS.git
cd KAMPAS
git checkout Becky
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example configuration file:

```bash
cp .env.example .env
```

> **Note:** Kampas runs fully in offline/demo mode without API keys, using local reactive stores. For connected persistence and authentication, populate your Supabase and Clerk keys in `.env`.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run lint
npm run build
npm run preview
```

---

## 📊 Testing and User Feedback

During prototype testing with two UEAB student groups:

- **Feedback received:** Students noted that finding off-campus housing required too many clicks on mobile devices.
- **Improvements made:** Streamlined the `HouseFindPage` with quick pill filters for water, Wi-Fi, and distance to campus, and added direct landlord calling buttons.

---

## 📜 Credits and License

Developed with passion by the Kampas Team at the University of Eastern Africa, Baraton.

**Third-party tools and assets:** React, Vite, Tailwind CSS, Lucide Icons, Leaflet, OpenStreetMap © OpenStreetMap contributors, OSRM, and Supabase. AI-assisted development tools (Google AI Studio, Claude) were used under team supervision.

Licensed under the **MIT License**.