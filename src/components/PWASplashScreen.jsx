"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function PWASplashScreen() {
    const [showSplash, setShowSplash] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Check if running as standalone PWA
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (typeof window.navigator.standalone !== "undefined" && window.navigator.standalone === true);

        if (!isStandalone) {
            setShowSplash(false);
            return;
        }

        // Hide splash after 3 seconds or when page is fully loaded
        const splashTimeout = setTimeout(() => {
            setShowSplash(false);
        }, 3000);

        const onLoadComplete = () => {
            setShowSplash(false);
            clearTimeout(splashTimeout);
        };

        // Hide splash when document is fully loaded
        if (document.readyState === "complete") {
            setShowSplash(false);
        } else {
            window.addEventListener("load", onLoadComplete);
            return () => {
                window.removeEventListener("load", onLoadComplete);
                clearTimeout(splashTimeout);
            };
        }

        return () => clearTimeout(splashTimeout);
    }, []);

    if (!mounted || !showSplash) return null;

    return (
        <>
            <style jsx>{`
                @keyframes slideRight {
                    0% {
                        transform: translateX(-100%);
                    }
                    50% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
                @keyframes dotsAnimation {
                    0%, 20% {
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 0.7;
                    }
                    100% {
                        opacity: 1;
                    }
                }
                .loading-text {
                    animation: dotsAnimation 1.5s ease-in-out infinite;
                }
            `}</style>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_1px)] bg-[length:20px_20px]"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-6">
                {/* Logo Container with Rounded Corners */}
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-3xl md:rounded-4xl border-4 border-orange-400 opacity-20 animate-pulse"></div>

                    {/* Logo */}
                    <img
                        src="/fav/android-icon-192x192.png"
                        alt="PractiCal Logo"
                        className="w-full h-full rounded-3xl md:rounded-4xl object-cover shadow-lg hover:shadow-xl transition-shadow"
                    />
                </div>

                {/* App Name */}
                <div className="text-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                        PractiCal
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Loading your meal plans...
                    </p>
                </div>

                {/* Loading Spinner */}
                <div className="flex items-center justify-center mt-4">
                    <div className="relative w-12 h-12 md:w-14 md:h-14">
                        {/* Outer Circle */}
                        <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>

                        {/* Animated Circle */}
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-orange-500 border-r-orange-400 animate-spin"></div>

                        {/* Inner Dot */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Loading Text with Animation */}
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600 font-medium">
                        Getting ready<span className="loading-text">...</span>
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-32 md:w-40 h-1 bg-gray-200 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-[slideRight_2s_ease-in-out_infinite]"
                        style={{
                            animation: "slideRight 2s ease-in-out infinite"
                        }}>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
