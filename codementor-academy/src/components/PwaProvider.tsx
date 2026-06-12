"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Registers the service worker and shows a small "Install app" button when the
 * browser offers an install prompt (Windows/Android Chrome & Edge). On iPadOS,
 * installation is manual via Share → Add to Home Screen, so we show a hint there.
 */
export function PwaProvider() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Detect iPad/iPhone (no beforeinstallprompt on iOS Safari).
    const ua = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    setIsIOS(iOS && !standalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (dismissed) return null;

  // Android/Windows native install prompt
  if (deferred) {
    return (
      <Banner onClose={() => setDismissed(true)}>
        <span className="text-sm font-medium text-slate-700">
          📲 Install CodeMentor as an app
        </span>
        <button
          onClick={async () => {
            await deferred.prompt();
            await deferred.userChoice;
            setDeferred(null);
            setDismissed(true);
          }}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Install
        </button>
      </Banner>
    );
  }

  // iPadOS / iOS manual-install hint
  if (isIOS) {
    return (
      <Banner onClose={() => setDismissed(true)}>
        <span className="text-sm text-slate-700">
          📲 Install on iPad: tap <b>Share</b> → <b>Add to Home Screen</b>
        </span>
      </Banner>
    );
  }

  return null;
}

function Banner({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <div className="flex items-center gap-2">{children}</div>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="text-slate-400 hover:text-slate-600"
      >
        ✕
      </button>
    </div>
  );
}
