import React, { useState, useEffect, useRef } from "react";
import { Companion, DrawingChallenge } from "../types";
import { COMPANIONS, CHALLENGES } from "../constants";
import { Sparkles, Volume2, VolumeX, RefreshCw, Star, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CompanionAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  activeChallenge: DrawingChallenge | null;
  onSetChallenge: (challenge: DrawingChallenge | null) => void;
  selectedTemplateId: string;
}

export default function CompanionArea({
  canvasRef,
  activeChallenge,
  onSetChallenge,
  selectedTemplateId,
}: CompanionAreaProps) {
  const [selectedCompanion, setSelectedCompanion] = useState<Companion>(COMPANIONS[0]);
  // Sound is off by default
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("magic_paint_voice_enabled");
      return saved === "true"; // Off by default (false) unless explicitly turned on
    } catch {
      return false;
    }
  });
  const [speechPlaying, setSpeechPlaying] = useState<boolean>(false);
  const [companionMessage, setCompanionMessage] = useState<string>(COMPANIONS[0].greeting);
  const [loadingFeedback, setLoadingFeedback] = useState<boolean>(false);
  const [wiggling, setWiggling] = useState<boolean>(false);
  const [successConfetti, setSuccessConfetti] = useState<boolean>(false);

  // References to handle window speech synthesis safely
  const speechUttRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Greet of the companion on switch
  useEffect(() => {
    setCompanionMessage(selectedCompanion.greeting);
    triggerWiggle();
    speakMessage(selectedCompanion.greeting);
    
    // Cleanup any ongoing speech
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedCompanion]);

  function triggerWiggle() {
    setWiggling(true);
    setTimeout(() => setWiggling(false), 900);
  }

  // Speak a message aloud using Web Speech Synthesis
  function speakMessage(text: string) {
    if (!speechEnabled || !window.speechSynthesis) return;

    try {
      // Cancel outstanding speech
      window.speechSynthesis.cancel();

      // Clean emojis and asterisks from speech text for cleaner voice reading
      const cleanText = text
        .replace(/[\*(.*?)\*]/g, "") // remove sound tokens like *hops around*
        .replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, ""); // strip emojis

      const ut = new SpeechSynthesisUtterance(cleanText);
      
      // Attempt to pick a cute pitching voice for children
      const voices = window.speechSynthesis.getVoices();
      
      if (selectedCompanion.id === "bunny") {
        // High-pitched, cute
        ut.pitch = 1.4;
        ut.rate = 1.05;
        const femaleVoice = voices.find(v => v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("google us english") || v.name.toLowerCase().includes("zira") || v.name.toLowerCase().includes("samantha"));
        if (femaleVoice) ut.voice = femaleVoice;
      } else if (selectedCompanion.id === "owl") {
        // Intellectual, medium key
        ut.pitch = 1.0;
        ut.rate = 0.95;
        const maleVoice = voices.find(v => v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("david") || v.name.toLowerCase().includes("microsoft david") || v.name.toLowerCase().includes("google uk english male"));
        if (maleVoice) ut.voice = maleVoice;
      } else if (selectedCompanion.id === "dino") {
        // Energetic growl key
        ut.pitch = 0.75;
        ut.rate = 1.15;
        const maleVoice = voices.find(v => v.name.toLowerCase().includes("male") || v.name.toLowerCase().includes("hazel") || v.name.toLowerCase().includes("google español"));
        if (maleVoice) ut.voice = maleVoice;
      }

      ut.onstart = () => setSpeechPlaying(true);
      ut.onend = () => setSpeechPlaying(false);
      ut.onerror = () => setSpeechPlaying(false);

      speechUttRef.current = ut;
      window.speechSynthesis.speak(ut);
    } catch (e) {
      console.warn("Speech Synthesis failed:", e);
    }
  }

  // Retries reading current active message (enables sound if currently off)
  function handleRepeatSpeech() {
    triggerWiggle();
    if (!speechEnabled) {
      setSpeechEnabled(true);
      try {
        localStorage.setItem("magic_paint_voice_enabled", "true");
      } catch {}
      setTimeout(() => speakMessage(companionMessage), 50);
    } else {
      speakMessage(companionMessage);
    }
  }

  // Toggles speech
  function toggleSpeech() {
    if (speechEnabled) {
      setSpeechEnabled(false);
      try {
        localStorage.setItem("magic_paint_voice_enabled", "false");
      } catch {}
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setSpeechPlaying(false);
    } else {
      setSpeechEnabled(true);
      try {
        localStorage.setItem("magic_paint_voice_enabled", "true");
      } catch {}
      setTimeout(() => speakMessage(companionMessage), 50);
    }
  }

  // Next random challenge function
  function handleNextChallenge() {
    triggerWiggle();
    const randomIndex = Math.floor(Math.random() * CHALLENGES.length);
    const newChal = CHALLENGES[randomIndex];
    onSetChallenge(newChal);
    
    const reaction = [
      `How about drawing this? ${newChal.text}`,
      `Ooooh, this is a spectacular mission! ${newChal.text}`,
      `Wow! Try this epic painting task: ${newChal.text}`
    ][Math.floor(Math.random() * 3)];

    setCompanionMessage(reaction);
    speakMessage(reaction);
  }

  // Sends the canvas drawing to standard Express API endpoint for server-side Gemini analysis
  async function askCompanionForFeedback() {
    if (!canvasRef.current) return;
    
    triggerWiggle();
    setLoadingFeedback(true);
    setCompanionMessage(`*squints eyes carefully* Oh! Let me put on my magic analysis goggles and look at your amazing masterpiece... Hmmm...`);
    speakMessage("Oh, let me look at your amazing masterpiece! Hmmm!");

    try {
      // Access the canvas drawing as dataURL
      const dataUrl = canvasRef.current.toDataURL("image/png");

      const response = await fetch("/api/magic-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: dataUrl,
          companionType: selectedCompanion.id,
          challengeText: activeChallenge ? activeChallenge.text : (selectedTemplateId !== "blank" ? `Coloring in the ${selectedTemplateId} outline` : null),
        }),
      });

      const data = await response.json();
      
      if (response.ok && data.feedback) {
        setCompanionMessage(data.feedback);
        speakMessage(data.feedback);
        
        // Trigger a nice success bubble and minor visual fanfare
        setSuccessConfetti(true);
        setTimeout(() => setSuccessConfetti(false), 3000);
      } else {
        const errMsg = data.error || "The magic forest is a bit noisy right now! Press the button to try again! 💕";
        setCompanionMessage(`*ops* ${errMsg}`);
        speakMessage(errMsg);
      }
    } catch (err) {
      console.error("Feedback error:", err);
      const friendlyErr = "Oh dear! My connection to our magic forest went on a tiny nap. Show me again! ✨";
      setCompanionMessage(friendlyErr);
      speakMessage(friendlyErr);
    } finally {
      setLoadingFeedback(false);
    }
  }

  return (
    <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-xl p-5 relative overflow-hidden flex flex-col h-full justify-between">
      {/* Visual background sparkles decorations */}
      <div className="absolute top-2 right-2 text-indigo-300 animate-pulse pointer-events-none opacity-60">
        <Sparkles className="w-8 h-8" />
      </div>

      {/* Companion Selector Tabs */}
      <div>
        <span className="text-xs font-black text-indigo-900 uppercase tracking-widest block mb-2 px-1">
          Pick Your Art Buddy 🐾
        </span>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {COMPANIONS.map((companion) => (
            <button
              key={companion.id}
              onClick={() => setSelectedCompanion(companion)}
              className={`flex items-center gap-1.5 justify-center py-2 px-3 rounded-2xl border transition-all cursor-pointer ${
                selectedCompanion.id === companion.id
                  ? "border-indigo-600 bg-white/90 text-indigo-950 font-bold scale-[1.02] shadow-sm"
                  : "border-white/40 hover:border-indigo-200 bg-white/30 text-indigo-900"
              }`}
            >
              <span className="text-xl">{companion.avatar}</span>
              <span className="text-xs font-black">{companion.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>

        {/* Mascot Cartoon Stage */}
        <div className="flex bg-white/30 backdrop-blur-md rounded-2xl p-4 border border-dashed border-white/60 relative items-center justify-center min-h-[160px]">
          {successConfetti && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <span className="absolute text-2xl animate-ping text-pink-500 left-3 top-2">⭐</span>
              <span className="absolute text-2xl animate-bounce text-yellow-400 right-5 top-4">✨</span>
              <span className="absolute text-2xl animate-pulse text-indigo-400 bottom-2 left-6">❤️</span>
            </div>
          )}

          <div className="flex flex-col items-center">
            {/* Mascot Avatar */}
            <motion.div
              animate={
                loadingFeedback
                  ? {
                      scale: [1, 1.1, 1, 1.1, 1],
                      rotate: [0, -8, 8, -8, 0],
                      transition: { repeat: Infinity, duration: 1.2 }
                    }
                  : wiggling
                  ? {
                      scale: [1, 1.2, 0.9, 1.1, 1],
                      y: [0, -20, 5, -5, 0],
                      transition: { duration: 0.8 }
                    }
                  : speechPlaying
                  ? {
                      scale: [1, 1.05, 1, 1.05, 1],
                      y: [0, -4, 0, -4, 0],
                      transition: { repeat: Infinity, duration: 0.5 }
                    }
                  : { y: [0, -3, 0] }
              }
              transition={!wiggling && !loadingFeedback && !speechPlaying ? { repeat: Infinity, duration: 3, ease: "easeInOut" } : undefined}
              className="text-8xl select-none cursor-pointer filter drop-shadow-md mb-2 relative"
              onClick={triggerWiggle}
            >
              {selectedCompanion.avatar}
              {speechPlaying && (
                <span className="absolute -top-1 -right-2 bg-pink-500 text-white rounded-full p-1 text-[10px] uppercase font-bold animate-pulse border border-white">
                  Talking!
                </span>
              )}
            </motion.div>

            {/* Mascot Title Badge */}
            <div className="bg-indigo-900 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md">
              {selectedCompanion.name}
            </div>
          </div>
        </div>
      </div>

      {/* Bubble Message Box */}
      <div className="mt-4 flex-1 flex flex-col justify-between">
        <div className="bg-white/65 border border-white/80 backdrop-blur-md rounded-2xl p-4 relative mb-4 flex-1 flex flex-col justify-between">
          <div className="absolute top-[-8px] left-[50%] transform -translate-x-[50%] w-4 h-4 bg-white/65 border-t border-l border-white/80 rotate-45"></div>
          
          <div className="text-indigo-950 text-sm font-bold leading-relaxed mb-3 overflow-y-auto max-h-[145px] pr-1">
            {companionMessage}
          </div>

          <div className="flex items-center justify-between border-t border-white/40 pt-2 text-xs">
            <button
              onClick={handleRepeatSpeech}
              title="Read message aloud"
              className="flex items-center gap-1 text-indigo-900 hover:text-indigo-700 cursor-pointer font-bold transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" /> Read Aloud
            </button>

            <button
              onClick={toggleSpeech}
              title={speechEnabled ? "Mute sound" : "Turn sound on"}
              className={`flex items-center gap-1.5 font-bold cursor-pointer px-2.5 py-1 rounded-lg transition-all ${
                speechEnabled
                  ? "bg-emerald-100/90 text-emerald-800 hover:bg-emerald-200"
                  : "bg-slate-200/80 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {speechEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-bounce text-emerald-600" /> Sound: ON
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" /> Sound: OFF (Muted)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Controls for challenges and Gemini API calls */}
        <div className="space-y-2.5">
          {/* Ask Companion Feedback Trigger Button */}
          <button
            onClick={askCompanionForFeedback}
            disabled={loadingFeedback}
            className={`w-full py-3.5 px-4 rounded-2xl text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer ${
              loadingFeedback
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-indigo-300/40"
            }`}
          >
            {loadingFeedback ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-yellow-200 animate-spin" strokeWidth={2.5} />
                Ask Magic Companion! ⭐
              </>
            )}
          </button>

          {/* Inspiration Prompt Button Container */}
          <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black text-indigo-900 uppercase tracking-wide">
                Need drawing ideas? 💡
              </span>
              <button
                onClick={handleNextChallenge}
                className="text-xs font-black text-pink-600 hover:text-pink-700 flex items-center gap-0.5 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Roll dice!
              </button>
            </div>

            {activeChallenge ? (
              <div className="bg-white border border-white/80 rounded-xl p-2.5 shadow-sm text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-800 flex items-center gap-1">
                    <span>{activeChallenge.emoji}</span> Mission Game
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded-full">
                    {activeChallenge.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 italic leading-snug">{activeChallenge.text}</p>
                <button
                  onClick={() => {
                    onSetChallenge(null);
                    setCompanionMessage(selectedCompanion.greeting);
                    speakMessage(selectedCompanion.greeting);
                  }}
                  className="text-[10px] text-red-500 hover:underline font-bold mt-1 block w-fit ml-auto cursor-pointer"
                >
                  Clear Mission
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-indigo-800/80 font-bold italic">
                Press "Roll dice!" to get a funny challenge!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
