# Kampas — University of Eastern Africa, Baraton (UEAB)

> **"The campus, in one place."**

Official responsive collegiate web application and Progressive Web App (PWA) built for the students and alumni of the **University of Eastern Africa, Baraton (UEAB)** in Nandi County, Kenya.

---

## 🏛 Platform Overview

Kampas is a student-first campus operating system featuring six core modules:

1. **Navigate**: Dynamic weekly timetable with clash detection, real-time lecturer venue relocation alerts, interactive Leaflet campus GIS map, one-tap route to next class, and building exterior & entrance door guides.
2. **House Find**: 14+ audited off-campus rentals in Baraton Centre, Chemamul, Kaimosi Road, Koitalel, and Cheterit. KES filters, 3-house side-by-side comparison, landlord contact modal with simulated response, and a roommate-wanted board.
3. **Share Hub**: Peer-reviewed lecture notes, exam revisions, past papers with Class Rep verification, document bookmarks, download counts, and collaborative study groups.
4. **Community**: Campus societies (GDSC, AYS, Innovators), Sabbath chapel vespers, athletic derbies, career attachments, and verified Baraton alumni network.
5. **Alumni Mentorship & Referrals**: 3-step structured pitch flow connecting students directly with Baraton graduates working at Safaricom, Microsoft ADC, Equity Bank, and AMPATH.
6. **Lost & Found**: Camera-first item logging, 94% match suggestions, secret ownership verification questions, and secure security desk handovers.

---

## ⚡ Tech Stack & Architecture

- **Frontend**: React 19, TypeScript, Vite, React Router, Tailwind CSS v4, Lucide Icons, Zod.
- **Maps**: Leaflet with OpenStreetMap tiles, centered at UEAB Baraton coordinates `[0.2505, 35.0800]`.
- **Architecture**:
  - Realistic Mock Data in `src/data/*.ts`
  - Client Service Layer in `src/services/*.ts` with simulated latency (`setTimeout`)
  - Reactive application state in React Context persisted to `localStorage`
  - Central Image Registry in `src/data/images.ts` with descriptive alt text and skeleton loaders
- **Design System**:
  - Primary Blue `#0B2A6F`, Dark Blue `#071B4A`, UEAB Gold `#F2B705` (accent, active states)
  - Background `#F7F9FC`, Card `#FFFFFF`, Borders `#E3E8F0`, Text `#0F172A`, Muted `#5B6475`
  - Status colors only: Green `#16A34A` (done), Amber `#F59E0B` (soon), Red `#DC2626` (urgent)
  - 44px touch targets, dark mode, low-data text mode

---

## 📱 Layout & Navigation

- **Desktop (1024px and up)**: Fixed left sidebar (does not scroll with page content; content offset with `lg:pl-64`), with gold active indicator and collapsible rail.
- **Mobile and Tablet**: Slide-in drawer opened from top bar hamburger + fixed 60px bottom tab bar with 5 main sections (Home, Campus, Housing, Share, Community).
- **Working Top Bar**: Debounced global search bar with grouped thumbnail suggestions across 8 categories (Venues, Houses, Events, Units, Documents, Clubs, People, Lost items), keyboard navigation (arrows, Enter, Esc), recent searches, and full results at `/search?q=`.

---

## ⚡ Interactive Floating Demo Controls

A togglable floating button (**⚡ Demo Controls**) is available on every screen to trigger simulated realtime events:

1. **Lecturer Venue Shift Alert**: Relocates `MATH 201` from Science Complex to Computing Lab B with instant notification and route update.
2. **Alumnus Referral Accepted**: Simulates Safaricom engineer accepting the student's CV pitch.
3. **Lost-Item 94% Match Found**: Simulates instant match detection for a lost HP Calculator with ownership quiz.
4. **Landlord Inquiry Reply**: Dispatches instant landlord response for Baraton Centre rental.
