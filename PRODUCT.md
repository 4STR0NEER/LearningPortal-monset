# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite (npm), Tailwind CSS v4, react-router, lucide-react, Recharts, anime.js v4 (choreographed motion), Motion via `motion/react` (component state). Frontend only: no backend, all data is mock JS in `src/data`, shaped like future Supabase tables so wiring a backend is a swap.

## Users

- **Students** of a learning center: open their enrolled courses, read weekly materials, take quizzes, and track progress.
- **Teachers / admins**: review applicants, see enrollment and course-progress statistics, browse enrolled students, and manage course content.

The client is a generic learning center. Program codes in the mock data (BTLEd AFA/HET/IAT/ICT, BTVTED, Unit Earner) are sample data, not a claim about the client.

## Product Purpose

A clickable LMS portal demo shown to a learning-center client to win the contract. Success: the client sees a polished, credible product with breadth of working screens across both roles, and can picture their own center in it.

## Positioning

A rebrandable portal: school name, tagline and logo live in one config file (`src/config/brand.js`), so the same build is re-skinned per prospective client.

## Operating Context

Demoed live on a laptop (and possibly a phone) in a client meeting. The presenter switches between Student and Teacher roles mid-demo with a toggle; the choice persists in localStorage. Layout follows reference screenshots of an existing LMS ("Sir Chan's TLE Tambayan"), restyled with the client palette.

## Capabilities and Constraints

- Student: dashboard of enrolled courses with progress, course page with locked weeks, quizzes (mock modal, attempts and scores in local state), reading materials marked done, profile.
- Teacher: dashboard (stat cards, course progress matrix, completion & mastery chart, top scorers), applicants (approve/decline), students enrolled (search/filter), course management (edit/add are placeholder toasts), reports (export is a "coming soon" toast).
- Nothing persists except the role choice. No auth.
- Ask before inventing any screen not described in the brief.

## Brand Commitments

- Palette pinned by the client: deep teal `#0E6973` (primary), teal `#118C8C`, mint `#BAD9CE`, lemon `#F2BB16` (accent only), ochre `#BF820F` (lemon's dark partner). Mood: fresh, calm, summery.
- Clean, light, corporate-education look; humanist sans (Nunito Sans class); thin outline icons.
- Placeholder brand until a client is signed: round seal emblem + wordmark.

## Evidence on Hand

- Written descriptions of five reference screenshots (no image files yet). Reference material goes in `resources/`.
- No real student data, testimonials or metrics. All numbers are mock and must stay labeled as demo data if shown outside the app.

## Product Principles

1. Breadth that clicks: every visible control does something, even if it is a toast.
2. Rebrand in minutes: brand and tokens live in one place each.
3. Data shaped for the backend it will get: ids and foreign keys, no UI-shaped blobs.
4. Quiet, quick UI; one expressive moment (the loading screen).

## Accessibility & Inclusion

Respect `prefers-reduced-motion` in every animation engine. Keyboard reachable controls with visible focus. WCAG AA contrast for text.
