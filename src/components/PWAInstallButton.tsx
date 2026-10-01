import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Share2, MoreVertical, Monitor } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already running inside standalone PWA mode, don't show install buttons
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/40 backdrop-blur-md rounded-full border border-white/50 text-[11px] font-black text-indigo-900 shadow-xs">
        <span>✨</span> App Installed
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      {/* Primary Install App Button - Always visible so user can install or get instructions */}
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white rounded-full font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer animate-pulse hover:animate-none"
        title="Install Magic Paint Castle as an App"
      >
        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span>Install App</span>
      </button>

      {/* Universal Installation Instructions Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-950/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm bg-white/95 backdrop-blur-2xl rounded-3xl p-6 border-2 border-white shadow-2xl text-indigo-950 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-14 h-14 mx-auto mb-2 bg-gradient-to-tr from-pink-400 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                🎨
              </div>
              <h3 className="text-lg font-black text-indigo-950">
                Install Magic Paint Castle
              </h3>
              <p className="text-xs text-indigo-700 font-medium mt-1">
                Install as a standalone app on your device for instant offline painting and full-screen fun!
              </p>
            </div>

            {/* Android Chrome Instructions */}
            {isAndroid && (
              <div className="space-y-3 bg-pink-50/80 rounded-2xl p-4 border border-pink-100 text-xs font-semibold text-indigo-950">
                <div className="flex items-center gap-2 text-pink-600 font-bold mb-1">
                  <Smartphone className="w-4 h-4" />
                  <span>On Android (Google Chrome):</span>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500 text-white font-black flex items-center justify-center text-xs">
                    1
                  </span>
                  <p className="leading-snug pt-0.5">
                    Tap the Chrome menu button <strong className="inline-flex items-center gap-0.5 text-pink-700 bg-white px-1.5 py-0.5 rounded-md border border-pink-200"><MoreVertical className="w-3 h-3 inline" /> 3 dots</strong> in the top-right corner.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500 text-white font-black flex items-center justify-center text-xs">
                    2
                  </span>
                  <p className="leading-snug pt-0.5">
                    Select <strong className="text-pink-700 bg-white px-1.5 py-0.5 rounded-md border border-pink-200">"Install app"</strong> (or "Add to Home screen").
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500 text-white font-black flex items-center justify-center text-xs">
                    3
                  </span>
                  <p className="leading-snug pt-0.5">
                    Tap <strong className="text-indigo-900 font-black">"Install"</strong>. The app icon will appear on your home screen! 🚀
                  </p>
                </div>
              </div>
            )}

            {/* iOS Safari Instructions */}
            {isIOS && (
              <div className="space-y-3 bg-indigo-50/80 rounded-2xl p-4 border border-indigo-100 text-xs font-semibold text-indigo-950">
                <div className="flex items-center gap-2 text-indigo-600 font-bold mb-1">
                  <Smartphone className="w-4 h-4" />
                  <span>On iPhone & iPad (Safari):</span>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-xs">
                    1
                  </span>
                  <p className="leading-snug pt-0.5">
                    Tap the Safari <span className="inline-flex items-center gap-1 font-black text-indigo-700 bg-white px-1.5 py-0.5 rounded-md border border-indigo-200"><Share2 className="w-3 h-3 inline" /> Share</span> button.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-xs">
                    2
                  </span>
                  <p className="leading-snug pt-0.5">
                    Scroll down and tap <strong className="text-indigo-900 font-black">"Add to Home Screen"</strong> (➕).
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center text-xs">
                    3
                  </span>
                  <p className="leading-snug pt-0.5">
                    Tap <strong className="text-indigo-900 font-black">"Add"</strong> in the top-right corner. You're ready to paint! 🎈
                  </p>
                </div>
              </div>
            )}

            {/* Desktop / Laptop Instructions (Chrome, Edge, Brave, etc.) */}
            {!isIOS && !isAndroid && (
              <div className="space-y-3 bg-purple-50/80 rounded-2xl p-4 border border-purple-100 text-xs font-semibold text-indigo-950">
                <div className="flex items-center gap-2 text-purple-600 font-bold mb-1">
                  <Monitor className="w-4 h-4" />
                  <span>On Desktop (Chrome / Edge):</span>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">
                    1
                  </span>
                  <p className="leading-snug pt-0.5">
                    Click the <strong className="text-purple-700 bg-white px-1.5 py-0.5 rounded-md border border-purple-200">Install icon (⊕)</strong> in the right side of the address bar.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">
                    2
                  </span>
                  <p className="leading-snug pt-0.5">
                    Or click the browser menu <strong className="text-purple-700 bg-white px-1.5 py-0.5 rounded-md border border-purple-200"><MoreVertical className="w-3 h-3 inline" /> (3 dots)</strong> &rarr; <strong className="text-purple-900 font-bold">"Install Magic Paint Castle..."</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white font-black flex items-center justify-center text-xs">
                    3
                  </span>
                  <p className="leading-snug pt-0.5">
                    Click <strong className="text-purple-900 font-black">"Install"</strong> to launch the desktop app! 🎨
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black text-sm shadow-md active:scale-95 transition cursor-pointer"
            >
              Got it! Let's Draw 🌈
            </button>
          </div>
        </div>
      )}
    </>
  );
};
