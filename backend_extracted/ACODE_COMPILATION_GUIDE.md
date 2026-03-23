# Android Task Manager - Acode Compilation Guide

This guide will walk you through compiling the Android Task Manager app using **Acode** - a powerful code editor for Android that can build and package HTML/CSS/JS apps.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Method 1: Direct HTML Build (Recommended)](#method-1-direct-html-build-recommended)
4. [Method 2: Using Acode with Cordova](#method-2-using-acode-with-cordova)
5. [Method 3: Using Acode with Capacitor](#method-3-using-acode-with-capacitor)
6. [Installing the APK](#installing-the-apk)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Apps (Install from Play Store)
1. **Acode** - Code editor (Free or Pro version)
2. **Termux** - Terminal emulator for Android
3. **Acode Terminal Plugin** (optional but recommended)

### Optional Apps for Advanced Builds
4. **Cordova** or **Capacitor** (installed via Termux)
5. **Android SDK** (via Termux or standalone)

---

## Project Structure

```
android-task-manager/
├── dist/                    # Built files (ready to compile)
│   ├── index.html          # Main entry point
│   ├── assets/             # CSS and JS bundles
│   ├── manifest.json       # PWA manifest
│   ├── sw.js               # Service worker
│   └── task-manager-icon.svg
├── src/                    # Source files
├── public/                 # Static assets
└── ACODE_COMPILATION_GUIDE.md  # This guide
```

---

## Method 1: Direct HTML Build (Recommended)

This is the simplest method - package the built HTML files as an Android WebView app.

### Step 1: Copy Files to Android

1. Connect your Android device to PC
2. Copy the entire `dist/` folder to your device:
   ```
   /sdcard/TaskManager/
   ```

### Step 2: Create Wrapper App in Acode

1. Open **Acode** app
2. Create a new folder: `TaskManagerApp`
3. Create `index.html` with this wrapper code:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #0f0f0f;
        }
        #app-frame {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <iframe id="app-frame" src="dist/index.html" allow="fullscreen"></iframe>
    <script>
        // Android interface bridge
        window.Android = {
            getSystemInfo: function() {
                return JSON.stringify({
                    model: navigator.userAgent,
                    memory: navigator.deviceMemory || 'unknown',
                    cores: navigator.hardwareConcurrency || 'unknown'
                });
            },
            killProcess: function(packageName) {
                console.log('Kill: ' + packageName);
                return true;
            },
            getRunningApps: function() {
                return '[]';
            }
        };
    </script>
</body>
</html>
```

### Step 3: Build with Acode's WebIDE

1. In Acode, tap **Menu** (≡) → **WebIDE**
2. Select **"Build APK"** option
3. Configure:
   - **App Name**: `Task Manager`
   - **Package Name**: `com.yourname.taskmanager`
   - **Version**: `1.0.0`
   - **Icon**: Select `task-manager-icon.svg`
   - **Entry Point**: `index.html`
4. Tap **Build**
5. Wait for compilation (2-5 minutes)
6. APK will be saved to `/sdcard/Acode/builds/`

---

## Method 2: Using Acode with Cordova

For a more native Android app with full system access.

### Step 1: Install Termux

1. Install **Termux** from F-Droid (recommended) or Play Store
2. Open Termux and update packages:
   ```bash
   pkg update && pkg upgrade
   ```

### Step 2: Install Node.js and Cordova

```bash
# Install Node.js
pkg install nodejs

# Install Cordova globally
npm install -g cordova

# Verify installation
node --version
cordova --version
```

### Step 3: Create Cordova Project

```bash
# Create project folder
cd /sdcard
cordova create TaskManager com.yourname.taskmanager "Task Manager"
cd TaskManager

# Add Android platform
cordova platform add android

# Install plugins for system access
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-battery-status
cordova plugin add cordova-plugin-network-information
```

### Step 4: Copy App Files

```bash
# Remove default www folder
rm -rf www/*

# Copy your built files
cp -r /path/to/dist/* www/
```

### Step 5: Configure config.xml

Edit `config.xml` in Acode:

```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.yourname.taskmanager" version="1.0.0" xmlns="http://www.w3.org/ns/widgets">
    <name>Task Manager</name>
    <description>Android Task Manager with Windows-style UI</description>
    <author email="your@email.com" href="">Your Name</author>
    <content src="index.html" />

    <!-- Permissions -->
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />

    <!-- Android settings -->
    <platform name="android">
        <preference name="android-minSdkVersion" value="24" />
        <preference name="android-targetSdkVersion" value="34" />
        <preference name="AndroidWindowSplashScreenAnimatedIcon" value="res/icon.png" />
        <preference name="SplashScreenDelay" value="2000" />
        <preference name="Fullscreen" value="false" />
        <preference name="DisallowOverscroll" value="true" />
        <preference name="BackgroundColor" value="0xFF0F0F0F" />

        <!-- Icons -->
        <icon density="ldpi" src="res/icon/android/ldpi.png" />
        <icon density="mdpi" src="res/icon/android/mdpi.png" />
        <icon density="hdpi" src="res/icon/android/hdpi.png" />
        <icon density="xhdpi" src="res/icon/android/xhdpi.png" />
        <icon density="xxhdpi" src="res/icon/android/xxhdpi.png" />
        <icon density="xxxhdpi" src="res/icon/android/xxxhdpi.png" />
    </platform>
</widget>
```

### Step 6: Build APK

In Termux:

```bash
cd /sdcard/TaskManager

# Build debug APK
cordova build android

# Or build release APK
cordova build android --release
```

APK location:
- Debug: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

## Method 3: Using Acode with Capacitor

Modern alternative to Cordova with better performance.

### Step 1: Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
```

### Step 2: Initialize Capacitor

```bash
npx cap init TaskManager com.yourname.taskmanager --web-dir dist
```

### Step 3: Add Android Platform

```bash
npm install @capacitor/android
npx cap add android
```

### Step 4: Sync and Build

```bash
# Sync web assets
npx cap sync

# Open in Android Studio (or build directly)
npx cap open android

# Or build APK directly
cd android
./gradlew assembleDebug
```

---

## Installing the APK

### Enable Unknown Sources

1. Go to **Settings** → **Security**
2. Enable **"Unknown sources"** or **"Install unknown apps"**
3. Allow your file manager/browser to install apps

### Install APK

1. Open file manager
2. Navigate to the APK location
3. Tap the APK file
4. Tap **Install**
5. Open the app!

---

## Adding Native Android Features

To access real system information, add this JavaScript bridge:

### In your HTML, add before closing `</body>`:

```html
<script>
// Check if running in Android WebView
if (window.Android || /Android/.test(navigator.userAgent)) {

    // Request real system data
    function getRealSystemInfo() {
        if (window.Android && window.Android.getSystemInfo) {
            const info = JSON.parse(window.Android.getSystemInfo());
            return info;
        }
        return null;
    }

    // Get running processes (requires root on most devices)
    function getRunningProcesses() {
        if (window.Android && window.Android.getRunningApps) {
            return JSON.parse(window.Android.getRunningApps());
        }
        return [];
    }

    // Kill a process (requires system permission)
    function killProcess(packageName) {
        if (window.Android && window.Android.killProcess) {
            return window.Android.killProcess(packageName);
        }
        return false;
    }
}
</script>
```

### Create Android Interface (Java/Kotlin)

For Cordova/Capacitor, create a plugin:

```java
// SystemInfoPlugin.java
package com.yourname.taskmanager;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.app.ActivityManager;
import android.content.Context;
import android.os.Build;
import android.os.Process;

public class SystemInfoPlugin extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        if (action.equals("getSystemInfo")) {
            getSystemInfo(callbackContext);
            return true;
        } else if (action.equals("getRunningApps")) {
            getRunningApps(callbackContext);
            return true;
        } else if (action.equals("killProcess")) {
            String packageName = args.optString(0);
            killProcess(packageName, callbackContext);
            return true;
        }
        return false;
    }

    private void getSystemInfo(CallbackContext callbackContext) {
        try {
            JSONObject info = new JSONObject();
            info.put("model", Build.MODEL);
            info.put("manufacturer", Build.MANUFACTURER);
            info.put("androidVersion", Build.VERSION.RELEASE);
            info.put("sdkVersion", Build.VERSION.SDK_INT);
            info.put("totalRam", getTotalRAM());
            info.put("cpuCores", Runtime.getRuntime().availableProcessors());
            callbackContext.success(info);
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
        }
    }

    private void getRunningApps(CallbackContext callbackContext) {
        ActivityManager am = (ActivityManager) cordova.getActivity()
            .getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> processes = am.getRunningAppProcesses();

        JSONArray apps = new JSONArray();
        for (ActivityManager.RunningAppProcessInfo process : processes) {
            JSONObject app = new JSONObject();
            app.put("pid", process.pid);
            app.put("processName", process.processName);
            app.put("importance", process.importance);
            apps.put(app);
        }
        callbackContext.success(apps);
    }

    private void killProcess(String packageName, CallbackContext callbackContext) {
        ActivityManager am = (ActivityManager) cordova.getActivity()
            .getSystemService(Context.ACTIVITY_SERVICE);
        am.killBackgroundProcesses(packageName);
        callbackContext.success("Killed: " + packageName);
    }
}
```

---

## Troubleshooting

### Build Errors

**Error: "Command not found: cordova"**
```bash
# Solution: Reinstall globally
npm install -g cordova
```

**Error: "ANDROID_HOME not set"**
```bash
# In Termux, set environment variable
export ANDROID_HOME=$HOME/android-sdk
```

**Error: "Gradle build failed"**
```bash
# Clean and rebuild
cordova clean
cordova build android
```

### Runtime Issues

**App shows blank screen**
- Check that all files are in the correct location
- Verify `index.html` path is correct
- Check browser console for errors

**Charts not displaying**
- Ensure internet connection (for CDN resources)
- Or use bundled dependencies

**Permissions denied**
- Add required permissions to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.KILL_BACKGROUND_PROCESSES" />
<uses-permission android:name="android.permission.GET_TASKS" />
<uses-permission android:name="android.permission.REAL_GET_TASKS" />
```

---

## Quick Reference: Acode Build Commands

| Command | Description |
|---------|-------------|
| `cordova create <folder> <package> <name>` | Create new project |
| `cordova platform add android` | Add Android platform |
| `cordova build android` | Build debug APK |
| `cordova build android --release` | Build release APK |
| `cordova run android` | Build and install |
| `cordova clean` | Clean build files |

---

## Next Steps

1. **Test the app** on your device
2. **Sign the APK** for Play Store distribution
3. **Add more native features** using Cordova/Capacitor plugins
4. **Optimize performance** for lower-end devices

---

## Resources

- [Acode Documentation](https://acode.app/docs)
- [Cordova Documentation](https://cordova.apache.org/docs/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android WebView Guide](https://developer.android.com/guide/webapps/webview)

---

**Happy Building!** 🚀
