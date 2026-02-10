"use client";
import { useEffect, useState } from "react";

export default function PWAInstallBar() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showIOSHint, setShowIOSHint] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Only run on client
        if (typeof window === "undefined") return;

        // Enhanced mobile detection
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        
        const isIOS = /iphone|ipad|ipod/i.test(userAgent);
        const isAndroid = /android/i.test(userAgent);

        console.log("[PWA] Mobile Detection:", { isMobileDevice, isIOS, isAndroid, userAgent });
        setIsMobile(isMobileDevice);

        if (!isMobileDevice) {
            console.log("[PWA] Not a mobile device, skipping PWA prompts");
            return;
        }

        // Check if already installed
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            ("standalone" in window.navigator && window.navigator.standalone === true) ||
            document.referrer.includes("android-app://");

        console.log("[PWA] Installation check:", { isStandalone });

        if (isStandalone) {
            console.log("[PWA] App already installed");
            setIsInstalled(true);
            return;
        }

        // Register service worker
        const registerServiceWorker = async () => {
            if ("serviceWorker" in navigator) {
                try {
                    console.log("[PWA] Attempting to register service worker at /sw.js");
                    const registration = await navigator.serviceWorker.register("/sw.js", {
                        scope: "/",
                        updateViaCache: "none",
                    });
                    console.log("[PWA] Service Worker registered successfully:", registration);
                } catch (error) {
                    console.error("[PWA] Service Worker registration failed:", error);
                }
            } else {
                console.warn("[PWA] Service Worker not supported in this browser");
            }
        };

        // Register SW immediately
        registerServiceWorker();

        // iOS hint - show immediately since iOS doesn't support beforeinstallprompt
        if (isIOS) {
            console.log("[PWA] iOS device detected, showing iOS hint");
            setShowIOSHint(true);
        }

        // Android install prompt listener
        const beforeInstallPromptHandler = (e) => {
            console.log("[PWA] beforeinstallprompt event fired", e);
            e.preventDefault();
            setDeferredPrompt(e);
        };

        const appInstalledHandler = () => {
            console.log("[PWA] App installed (appinstalled event)");
            setIsInstalled(true);
        };

        window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);
        window.addEventListener("appinstalled", appInstalledHandler);

        return () => {
            window.removeEventListener("beforeinstallprompt", beforeInstallPromptHandler);
            window.removeEventListener("appinstalled", appInstalledHandler);
        };
    }, []);

    // Don't render on desktop or if installed
    if (!isMobile || isInstalled) return null;

    // Don't render if nothing to show
    if (!deferredPrompt && !showIOSHint) return null;

    return (
        <div className="fixed bottom-4 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2">
            <div className="rounded-xl bg-black p-4 shadow-xl text-white">
                {/* Android - Install Prompt */}
                {deferredPrompt && (
                    <div className="flex items-center justify-between gap-3">
                        {/* Icon with Rounded Corners */}
                        <div className="flex-shrink-0">
                            <img
                                src="/fav/android-icon-96x96.png"
                                alt="PractiCal"
                                className="w-12 h-12 md:w-14 md:h-14 rounded-xl shadow-md"
                            />
                        </div>
                        <div className="text-sm flex-1">
                            <p className="font-semibold text-white">Install PractiCal</p>
                            <p className="text-gray-300 text-xs mt-1">
                                Get faster access & offline support
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setDeferredPrompt(null)}
                                className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white transition"
                            >
                                Not now
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        if (deferredPrompt) {
                                            console.log("[PWA] User clicked install");
                                            deferredPrompt.prompt();
                                            const { outcome } = await deferredPrompt.userChoice;
                                            console.log(`[PWA] User response: ${outcome}`);
                                            if (outcome === "accepted") {
                                                setIsInstalled(true);
                                            }
                                            setDeferredPrompt(null);
                                        }
                                    } catch (error) {
                                        console.error("[PWA] Install prompt error:", error);
                                    }
                                }}
                                className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black hover:bg-gray-200 transition"
                            >
                                Install
                            </button>
                        </div>
                    </div>
                )}

                {/* iOS - Share Instructions */}
                {showIOSHint && !deferredPrompt && (
                    <div className="text-sm">
                        <p className="font-semibold text-white">Install PractiCal</p>
                        <p className="text-gray-300 text-xs mt-2 leading-relaxed">
                            Tap the <span className="font-semibold">Share</span> icon at the bottom, then tap <span className="font-semibold">"Add to Home Screen"</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
