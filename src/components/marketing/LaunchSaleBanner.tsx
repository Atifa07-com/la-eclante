import { useEffect, useLayoutEffect, useState } from "react";

const SALE_END = new Date("2026-10-31T18:59:59Z").getTime();
const DISMISS_KEY = "la-eclante-launch-sale-dismissed";

type LaunchSaleBannerProps = {
  onVisibilityChange: (visible: boolean) => void;
};

const readDismissedState = () => {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem(DISMISS_KEY) === "true";
  } catch {
    return false;
  }
};

const getRemainingTime = () => Math.max(0, SALE_END - Date.now());

const LaunchSaleBanner = ({ onVisibilityChange }: LaunchSaleBannerProps) => {
  const [dismissed, setDismissed] = useState(readDismissedState);
  const [remaining, setRemaining] = useState(getRemainingTime);
  const isExpired = remaining === 0;
  const isVisible = !dismissed && !isExpired;

  useLayoutEffect(() => {
    onVisibilityChange(isVisible);
  }, [isVisible, onVisibilityChange]);

  useEffect(() => {
    if (dismissed || isExpired) return;

    const updateCountdown = () => {
      setRemaining(getRemainingTime());
    };
    const intervalId = window.setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => window.clearInterval(intervalId);
  }, [dismissed, isExpired]);

  if (!isVisible) return null;

  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // Keep dismissal functional when browser storage is unavailable.
    }
    setDismissed(true);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex h-11 items-center border-b border-accent-gold/40 bg-charcoal text-background shadow-[0_2px_12px_rgba(0,0,0,0.18)]">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center gap-2 px-2 sm:gap-4 sm:px-6">
        <p className="max-w-none min-w-0 truncate text-[10px] font-medium uppercase tracking-[0.08em] text-background/90 sm:text-xs sm:tracking-[0.12em]">
          <span className="sm:hidden">Launch Month: 30% Off</span>
          <span className="hidden sm:inline">Launch Month Offer: 30% Off All Products &amp; Routines</span>
        </p>

        <div
          role="timer"
          aria-label={`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`}
          className="flex shrink-0 items-center gap-1 font-mono text-[10px] tabular-nums text-accent-gold sm:gap-1.5 sm:text-xs"
        >
          <span>{String(days).padStart(2, "0")}d</span>
          <span aria-hidden="true">:</span>
          <span>{String(hours).padStart(2, "0")}h</span>
          <span aria-hidden="true">:</span>
          <span>{String(minutes).padStart(2, "0")}m</span>
          <span aria-hidden="true">:</span>
          <span>{String(seconds).padStart(2, "0")}s</span>
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss launch month offer"
          className="-mr-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-lg leading-none text-background/70 transition-colors hover:bg-background/10 hover:text-background"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default LaunchSaleBanner;