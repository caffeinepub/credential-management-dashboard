# Specification

## Summary
**Goal:** Build a responsive, mobile-first “Credential Management Dashboard” web app (PWA-style installable on Android via browser) for managing 1000+ credential records with a Government/Enterprise admin-dashboard UI.

**Planned changes:**
- Create the dashboard layout with a sticky header (logo placeholder + exact department header text), main title/subtitle, and a fixed footer with “Confidential – For Official Use Only”.
- Implement credential CRUD (add/edit/delete) via a floating modal/drawer form with the required fields and password masking + eye toggle.
- Render credentials in a responsive, performant, scrollable table (sticky table header, zebra striping, hover highlight, horizontal scroll on mobile) with the required columns and per-row actions.
- Add badge-style pill display/selection for Ranges and Branch using the exact provided option lists.
- Add global live search (pill input) plus dropdown filters for Branch/Ranges/Category with per-filter clear and a global “Clear Filters” (AND behavior with pagination).
- Add per-row password masking/show toggle and copy-to-clipboard for Login ID and Password with success feedback.
- Add pagination suitable for 1000+ entries that works with search and filters.
- Persist records in LocalStorage with safe handling of corrupt/invalid saved data.
- Add dark mode toggle with persisted theme preference.
- Add a Print action with a clean print layout including the header text, title/subtitle, and a table of the currently visible (filtered/searched) records across multiple pages.

**User-visible outcome:** Users can add, view, search, filter, paginate, edit, delete, copy, and print credential records in a professional light/dark admin dashboard, with data and theme saved locally across refreshes.
