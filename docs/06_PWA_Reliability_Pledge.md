# 7. PWA Reliability Pledge & Strategy

## 7.1. The Promise

This document formalizes the development promise made regarding the reliability of the Progressive Web App (PWA), specifically its core real-time tracking feature.

The guiding principle is: **We will build for failure.** We will not hope for the best; we will engineer for the worst. The application's responsibility is to guide the user to success and to fail gracefully and informatively when it cannot. This is how we will build an application worthy of trust.

## 7.2. The "Safety Net" Feature Set

The following are not afterthoughts or bug fixes; they are **required features** to be implemented as part of the core development process to mitigate real-world risks.

| Risk ID | Real-World Risk | The "Safety Net" Feature / Mitigation |
| :--- | :--- | :--- |
| **PWA-01** | **Inconsistent GPS Accuracy.** The phone provides a fast but inaccurate location from Wi-Fi before the high-accuracy GPS locks on. | When requesting location, the code **must** use the `enableHighAccuracy: true` option to explicitly request the best possible GPS fix. |
| **PWA-02** | **User Denies Location Permission.** The supervisor accidentally blocks location access, and the browser remembers this setting. | Implement a **"Pre-Route Check" screen.** Before the route can be started, the app must verify location permissions. If denied, the UI must clearly instruct the user on how to enable permissions in their phone's settings for the browser. The "Start" button will remain disabled until permission is granted. |
| **PWA-03** | **User Disables Phone's GPS.** The supervisor turns off the phone's main "Location Services" toggle mid-route. | The app **must** listen for the `POSITION_UNAVAILABLE` error from the Geolocation API. If this error is received, a persistent, non-dismissible UI element (e.g., a banner) must be displayed, instructing the user to re-enable their phone's location services. Location broadcasting will be paused until the service is restored. |
| **PWA-04**| **OS Puts App to Sleep.** The supervisor switches to another app (e.g., a game) or locks the screen, causing the OS to "freeze" the browser tab to save battery. | This is handled by a **two-layered defense**: <br> **1. Technical Safeguard:** The supervisor's tracking interface **must** implement the **Screen Wake Lock API**. This prevents the phone from automatically dimming or locking the screen due to inactivity. <br> **2. Human Safeguard:** The UI **must** display a clear, persistent on-screen message during active tracking, such as: *"Tracking is Active. For best results, please keep this screen open during your route. Switching to other apps may pause location updates."* This educates the user and sets a professional expectation. |
| **PWA-05**| **Cross-Browser Incompatibility.** The feature works on an iPhone/Safari but fails on an Android/Chrome device (or vice-versa). | The PWA's location tracking feature **must** be explicitly tested and confirmed as fully functional on, at a minimum, the latest versions of **Safari on iOS** and **Chrome on Android**. |
| **PWA-06**| **Loss of Internet Connectivity.** The supervisor's phone enters an area with no cellular data. | The PWA **must** queue location data gathered while offline. Upon reconnection, it must send the entire batch of offline location points to the backend to provide a complete and accurate travel history for the parent. | 