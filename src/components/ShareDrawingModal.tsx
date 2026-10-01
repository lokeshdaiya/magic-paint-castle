import React, { useState, useEffect } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Sparkles,
  Heart,
  ImageIcon,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface ShareDrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageDataUrl: string | null;
  imageBlob: Blob | null;
  templateName?: string;
}

export const ShareDrawingModal: React.FC<ShareDrawingModalProps> = ({
  isOpen,
  onClose,
  imageDataUrl,
  imageBlob,
  templateName = "Masterpiece",
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isSharingNative, setIsSharingNative] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hostedShareUrl, setHostedShareUrl] = useState<string>("");
  const [hostedImageUrl, setHostedImageUrl] = useState<string>("");

  // When modal opens, upload drawing to server so social platforms can fetch the picture
  useEffect(() => {
    if (!isOpen || !imageDataUrl) return;

    let isMounted = true;
    setIsUploading(true);

    // Default fallback url
    const defaultUrl = window.location.href.split("?")[0];
    setHostedShareUrl(defaultUrl);

    fetch("/api/share-drawing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: imageDataUrl,
        templateName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.shareUrl) {
          setHostedShareUrl(data.shareUrl);
          setHostedImageUrl(data.imageUrl);
        }
      })
      .catch((err) => {
        console.warn("Cloud sharing upload error (using local fallback):", err);
      })
      .finally(() => {
        if (isMounted) setIsUploading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, imageDataUrl, templateName]);

  if (!isOpen) return null;

  const currentShareUrl = hostedShareUrl || window.location.href.split("?")[0];
  const shareTitle = `Look at my magical drawing! 🎨✨`;
  const shareText = `I just painted "${templateName}" on Magic Paint Castle! 🏰🌈 Check it out:`;

  // Native Web Share API with BOTH File and App Link
  const handleNativeShare = async () => {
    if (!navigator.share) {
      handleCopyLink();
      return;
    }

    try {
      setIsSharingNative(true);

      // Ensure we have a Blob from imageDataUrl if not passed
      let blob = imageBlob;
      if (!blob && imageDataUrl) {
        const res = await fetch(imageDataUrl);
        blob = await res.blob();
      }

      if (blob && navigator.canShare) {
        const safeName = templateName.toLowerCase().replace(/[^a-z0-9]/g, "-");
        const file = new File([blob], `${safeName}-drawing.png`, {
          type: "image/png",
        });

        // 1. Primary: Pass BOTH file attachment AND text with link
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: shareTitle,
              text: `${shareText}\n${currentShareUrl}`,
              files: [file],
            });
            setIsSharingNative(false);
            return;
          } catch (e: any) {
            if (e.name === "AbortError") {
              setIsSharingNative(false);
              return;
            }
            // Fallback for apps that only accept the file without text
            console.warn("Retrying file share:", e);
            try {
              await navigator.share({
                title: shareTitle,
                files: [file],
              });
              setIsSharingNative(false);
              return;
            } catch (innerErr) {
              console.warn("File share fallback error:", innerErr);
            }
          }
        }
      }

      // 2. Fallback: Share rich URL (platforms will fetch OpenGraph image automatically)
      await navigator.share({
        title: shareTitle,
        text: `${shareText}\n${currentShareUrl}`,
        url: currentShareUrl,
      });
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.warn("Native share error:", err);
      }
    } finally {
      setIsSharingNative(false);
    }
  };

  // Copy rich share text & link
  const handleCopyLink = async () => {
    const textToCopy = `${shareText}\n${currentShareUrl}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      const input = document.createElement("textarea");
      input.value = textToCopy;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Copy actual PNG image to clipboard for pasting into WhatsApp, Discord, Messages
  const handleCopyImage = async () => {
    try {
      let blob = imageBlob;
      if (!blob && imageDataUrl) {
        const res = await fetch(imageDataUrl);
        blob = await res.blob();
      }

      if (!blob || !navigator.clipboard?.write) {
        alert("Picture copying is not supported on this browser. You can download the picture or use 'Share with Apps'!");
        return;
      }

      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2500);
    } catch (err) {
      console.warn("Could not copy image to clipboard:", err);
      handleCopyLink();
    }
  };

  // Direct download to phone / computer
  const handleDownload = () => {
    if (!imageDataUrl) return;
    const a = document.createElement("a");
    a.download = `magic-drawing-${Date.now()}.png`;
    a.href = imageDataUrl;
    a.click();
  };

  // Social link generators embedding the rich preview URL
  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(`${shareTitle}\n${shareText}\n${currentShareUrl}`);
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  const getFacebookUrl = () => {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentShareUrl)}`;
  };

  const getTwitterUrl = () => {
    const text = encodeURIComponent(`${shareTitle} Painted on Magic Paint Castle! 🎨🏰`);
    return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentShareUrl)}&hashtags=KidsArt,Drawing,MagicPaintCastle`;
  };

  const getPinterestUrl = () => {
    const media = encodeURIComponent(hostedImageUrl || imageDataUrl || "");
    const desc = encodeURIComponent(`Magical children's drawing created on Magic Paint Castle: ${templateName}`);
    return `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentShareUrl)}&media=${media}&description=${desc}`;
  };

  const getTelegramUrl = () => {
    const text = encodeURIComponent(`${shareTitle}\n${shareText}`);
    return `https://t.me/share/url?url=${encodeURIComponent(currentShareUrl)}&text=${text}`;
  };

  const supportsNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-indigo-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-white to-pink-50/80 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border-2 border-white shadow-2xl text-indigo-950 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-gray-700 shadow-xs transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/90 text-pink-700 text-xs font-black mb-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin" />
            <span>Share Image & App Link</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
            Share Your Drawing 💖
          </h2>
          <p className="text-xs text-indigo-800/80 font-semibold mt-0.5">
            Share the picture of your drawing together with the app link!
          </p>
        </div>

        {/* Artwork Polaroid Card Preview */}
        {imageDataUrl && (
          <div className="relative mx-auto w-full max-w-xs p-3 bg-white rounded-2xl shadow-md border border-pink-100 mb-4 rotate-[-1deg] hover:rotate-0 transition-transform">
            <div className="w-full aspect-[4/3] bg-pink-50/60 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
              <img
                src={imageDataUrl}
                alt="Your Artwork"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-2 text-center flex items-center justify-between px-1 text-[11px] font-black text-indigo-900">
              <span className="truncate">🎨 {templateName}</span>
              <span className="text-pink-500 flex items-center gap-0.5 font-bold text-[10px]">
                <Heart className="w-3 h-3 fill-pink-500" /> By a Young Artist
              </span>
            </div>
          </div>
        )}

        {/* Status indicator while uploading preview */}
        {isUploading && (
          <div className="flex items-center justify-center gap-2 mb-3 text-xs text-indigo-700 font-bold bg-indigo-50/70 py-1.5 px-3 rounded-full border border-indigo-100">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-500" />
            <span>Generating rich image preview card for social apps...</span>
          </div>
        )}

        {/* PRIMARY ACTION: Native Device Share with Image File + Link */}
        {supportsNativeShare && (
          <div className="mb-4">
            <button
              onClick={handleNativeShare}
              disabled={isSharingNative}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white rounded-2xl font-black text-sm shadow-lg hover:shadow-xl active:scale-[0.98] transition cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
              <span>
                {isSharingNative
                  ? "Opening Share..."
                  : "Share Picture & Link (WhatsApp, Instagram, Messages...)"}
              </span>
            </button>
            <p className="text-[10px] text-center text-indigo-900/60 font-semibold mt-1">
              ✨ Attaches the full-resolution image file and includes the app link
            </p>
          </div>
        )}

        {/* Social Apps Direct Share (Using Image-Preview Card URL) */}
        <div className="mb-4">
          <div className="text-[11px] font-black uppercase tracking-wider text-indigo-900/70 mb-2 px-1 flex items-center justify-between">
            <span>Share with Preview Card on:</span>
            <span className="text-[10px] font-normal text-indigo-900/50">Includes image + link</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* WhatsApp */}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 transition active:scale-95 group"
              title="Share to WhatsApp with drawing picture preview"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
                </svg>
              </div>
              <span className="text-[11px] font-black text-emerald-900 mt-1.5">WhatsApp</span>
            </a>

            {/* Facebook */}
            <a
              href={getFacebookUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30 text-blue-900 transition active:scale-95 group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span className="text-[11px] font-black text-blue-950 mt-1.5">Facebook</span>
            </a>

            {/* X / Twitter */}
            <a
              href={getTwitterUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/10 hover:bg-slate-900/20 border border-slate-900/30 text-slate-900 transition active:scale-95 group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <span className="text-[11px] font-black text-slate-900 mt-1.5">X / Twitter</span>
            </a>

            {/* Pinterest */}
            <a
              href={getPinterestUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-900 transition active:scale-95 group"
            >
              <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.94-.13-2.39.03-3.42l1.09-4.63s-.28-.56-.28-1.39c0-1.3.75-2.27 1.69-2.27.8 0 1.18.6 1.18 1.32 0 .8-.51 2-1 3.11-.22.94.47 1.7 1.4 1.7 1.68 0 2.97-1.77 2.97-4.33 0-2.26-1.63-3.84-3.95-3.84-2.69 0-4.27 2.02-4.27 4.11 0 .81.31 1.68.7 2.16.08.1.09.18.07.28l-.26 1.08c-.04.18-.15.22-.34.13-1.28-.6-2.08-2.46-2.08-3.96 0-3.23 2.35-6.19 6.77-6.19 3.55 0 6.31 2.53 6.31 5.92 0 3.53-2.23 6.37-5.32 6.37-1.04 0-2.02-.54-2.35-1.18l-.64 2.45c-.23.9-.86 2.02-1.28 2.72A12 12 0 1 0 12 0z" />
                </svg>
              </div>
              <span className="text-[11px] font-black text-red-950 mt-1.5">Pinterest</span>
            </a>
          </div>
        </div>

        {/* Copy Tools & Quick Actions */}
        <div className="space-y-2.5 bg-white/70 rounded-2xl p-3.5 border border-white/80">
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Copy Image directly to clipboard */}
            <button
              onClick={handleCopyImage}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-bold transition active:scale-95 cursor-pointer"
              title="Copy the image to clipboard so you can paste it directly in any chat"
            >
              {copiedImage ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-extrabold">Picture Copied!</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 text-indigo-600" />
                  <span>Copy Picture to Paste</span>
                </>
              )}
            </button>

            {/* Copy Share Link */}
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-200 text-xs font-bold transition active:scale-95 cursor-pointer"
              title="Copy the link that includes the rich image card"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-extrabold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-pink-600" />
                  <span>Copy Link with Preview</span>
                </>
              )}
            </button>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG Picture to Device</span>
          </button>
        </div>

        {/* View Shared Link */}
        {hostedShareUrl && (
          <div className="mt-3 text-center">
            <a
              href={hostedShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              <span>View hosted artwork preview page</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Friendly Close Footer */}
        <div className="mt-3 text-center">
          <button
            onClick={onClose}
            className="text-xs font-black text-indigo-900/60 hover:text-indigo-950 transition cursor-pointer"
          >
            &larr; Back to Painting Canvas
          </button>
        </div>
      </div>
    </div>
  );
};
