# Building an Android APK from Your Deployed PWA

## Overview

Your application is deployed as a Progressive Web App (PWA) on the Internet Computer. While users can install it directly from Chrome on Android using "Add to Home screen," you may want to distribute it as a native Android APK through direct download or the Google Play Store.

This guide explains how to package your deployed web app into an Android APK using **Trusted Web Activity (TWA)** technology via Google's **Bubblewrap** tool.

**Important:** The APK generation happens **locally on your development machine** using Android build tools—it is **not** part of the Internet Computer deployment process.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Important Notes](#important-notes)
3. [Building with Bubblewrap](#building-with-bubblewrap)
4. [Signing Your APK](#signing-your-apk)
5. [Hosting Your APK](#hosting-your-apk)
6. [Troubleshooting](#troubleshooting)
7. [Digital Asset Links](#digital-asset-links)
8. [Minimum Requirements](#minimum-requirements)
9. [Additional Resources](#additional-resources)

---

## Prerequisites

Before you begin, ensure you have:

1. **Node.js and npm** (v14.15.0 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify: `node --version` and `npm --version`

2. **Java Development Kit (JDK)** 8 or higher
   - Download from [Oracle](https://www.oracle.com/java/technologies/downloads/) or use OpenJDK
   - Verify: `java -version`
   - Ensure `JAVA_HOME` environment variable is set

3. **Android SDK** (via Android Studio or command-line tools)
   - Download [Android Studio](https://developer.android.com/studio)
   - Or install [command-line tools only](https://developer.android.com/studio#command-tools)
   - Ensure `ANDROID_HOME` environment variable is set
   - Install Android SDK Platform-Tools and Build-Tools

4. **Your deployed app URL** (HTTPS required)
   - Example: `https://nysqw-2iaaa-aaaal-abxqa-cai.icp0.io`
   - Must be accessible over HTTPS (Internet Computer provides this automatically)

---

## Important Notes

### Universal APK is REQUIRED

**⚠️ CRITICAL:** For direct APK distribution (not via Google Play Store), you **MUST** build a **universal APK** that supports all device architectures.

- **Universal APK:** Contains native libraries for all architectures (ARM, x86, x86_64)
- **Architecture-Specific APKs:** Separate APKs for each architecture (arm64-v8a, armeabi-v7a, x86, x86_64)

**Why universal APK is required:**
- Architecture-specific APKs only work on devices with matching architecture
- Installing the wrong architecture APK causes "problem while parsing the package" error
- Universal APKs work on all devices and prevent installation failures
- Google Play Store handles architecture selection automatically, but direct distribution does not

**How to build universal APK:**
