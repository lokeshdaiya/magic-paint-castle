import React from "react";
import { ShieldCheck, X, Heart, Lock, Sparkles, Mail, CheckCircle2 } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border-4 border-indigo-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-policy-title"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-xs">
              <ShieldCheck className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 id="privacy-policy-title" className="text-lg font-black tracking-tight flex items-center gap-2">
                Privacy Policy
                <span className="text-[11px] bg-white/25 px-2 py-0.5 rounded-full font-bold">
                  Families & Kids Safe
                </span>
              </h2>
              <p className="text-xs text-indigo-100 font-medium">
                Magic Paint Castle • Effective: October 1, 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition cursor-pointer"
            aria-label="Close Privacy Policy"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          {/* Quick Summary Card */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex gap-3.5 items-start">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-bold text-emerald-900 mb-1">
                Zero Personal Data Collected • 100% Safe For Kids
              </p>
              <p className="text-emerald-800 leading-normal">
                Magic Paint Castle does not collect, sell, or share personal information. There are no accounts, no logins, no commercial advertisements, and drawings stay private on your child's device.
              </p>
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="text-base font-black text-indigo-950 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              1. Children's Privacy (COPPA & GDPR-K Compliance)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              We strictly comply with the <strong>Children's Online Privacy Protection Act (COPPA)</strong> and the <strong>Google Play Designed for Families</strong> policy:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
              <li>No personal information (names, emails, addresses, or phone numbers) is collected.</li>
              <li>No user registration or account creation is required to use all features.</li>
              <li>No device GPS location or biometric data is ever accessed or tracked.</li>
              <li>No cross-app or behavioral tracking across the web.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-base font-black text-indigo-950 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              2. How Drawings & Artworks Are Stored
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              All artworks and drawings are stored <strong>locally on your own device</strong> (in your browser's private local storage). Your child's drawings never upload to remote servers and cannot be viewed by third parties.
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              Parents or children can delete any artwork at any time by tapping the "Trash" icon inside the "My Drawings" art book.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h3 className="text-base font-black text-indigo-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              3. No Advertising & No Analytics SDKs
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Magic Paint Castle contains <strong>zero third-party advertisements</strong>, banner ads, or pop-ups. We do not integrate advertising networks or tracking trackers.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h3 className="text-base font-black text-indigo-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              4. Optional Magic Buddy (AI Feedback)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              The app includes an optional AI animal friend (Bella the Bunny, Ollie the Owl, Dexter the Dino) who cheers kids on with positive feedback:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
              <li>When the user presses "Ask Companion", the current drawing image is sent securely via encrypted HTTPS to generate an encouraging compliment.</li>
              <li>The image is processed transiently and is discarded immediately after generating the feedback text. It is never used to identify the user or train models.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h3 className="text-base font-black text-indigo-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              5. Device Permissions
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600">
              <li><strong>Save/Download:</strong> Only activated when tapping "Save" to export a drawing file to your camera roll or downloads folder.</li>
              <li><strong>Audio:</strong> Plays joyful brush sound effects through device speakers. No audio recording or microphone access is ever requested.</li>
            </ul>
          </section>

          {/* Contact Box */}
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="font-bold text-indigo-900">Have questions for the developer?</p>
                <p className="text-indigo-700">Contact us at: <a href="mailto:ldlucky2009@gmail.com" className="font-semibold underline">ldlucky2009@gmail.com</a></p>
              </div>
            </div>
            <a
              href="/privacy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shrink-0 transition"
            >
              Open Web Page ↗
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
          >
            Got it, Let's Paint! 🎨
          </button>
        </div>
      </div>
    </div>
  );
};
export default PrivacyPolicyModal;
