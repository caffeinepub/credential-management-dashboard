# Specification

## Summary
**Goal:** Fix Android APK download behavior by removing the shipped placeholder APK, ensuring correct serving headers, and making frontend availability checks reliably detect real vs invalid/missing APKs.

**Planned changes:**
- Remove the placeholder `frontend/public/downloads/app.apk` from deployed assets so `/downloads/app.apk` returns 404 until a real signed universal APK is provided (keep the downloads README guidance accurate for this default).
- Ensure `/downloads/app.apk` (when present) is served with the correct APK `Content-Type` and strict no-cache headers, including for cache-busting query parameters (e.g., `?t=<timestamp>`).
- Harden `frontend/src/hooks/useApkAvailability.ts` by validating via a small byte-range GET and checking for the ZIP/APK signature (`PK\x03\x04`), correctly classifying `missing` (404), `invalid` (placeholder/error/HTML/small/non-signature), and `available` (real APK).
- Update `frontend/src/components/apk/AndroidApkDialog.tsx` so the Download button stays disabled for `missing`/`invalid`/`unreachable`, and show clear English guidance explaining the missing/invalid states and that a signed universal APK built via Bubblewrap must be deployed.

**User-visible outcome:** Users only see an enabled “Download APK” action when a real APK is actually hosted; otherwise the dialog clearly explains whether the APK is missing or invalid and what must be done to provide a proper signed universal APK.
