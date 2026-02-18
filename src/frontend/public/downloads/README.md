# APK Downloads Directory

This directory hosts Android APK files for download from your deployed Internet Computer application.

## ⚠️ CRITICAL: Universal APK Required

**You MUST use a universal APK to avoid "problem while parsing the package" errors.**

A universal APK contains code for all common Android architectures (ARM, x86, x86_64) and ensures maximum compatibility across devices. Architecture-specific APKs will cause installation failures on devices with different architectures.

---

## Default Behavior (No APK Hosted)

**By default, this directory does NOT contain a valid APK file.**

When no APK is present at `frontend/public/downloads/app.apk`:
- Requests to `/downloads/app.apk` will return **404 Not Found**
- The UI will display a "No APK currently hosted" state
- The download button will be disabled
- This is the expected behavior until you build and deploy a real APK

---

## Quick Start Guide

### 1. Install Bubblewrap CLI

