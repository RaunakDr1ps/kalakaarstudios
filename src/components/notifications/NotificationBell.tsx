"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, CheckCheck, X } from "lucide-react";
import type { NotificationItem } from "@/lib/artist";
import { useArtistNotifications } from "./useArtistNotifications";
import NotificationList, {
  NotificationError,
  NotificationLoadingRow,
  NotificationSkeleton,
} from "./NotificationList";

/**
 * Header bell for registered artists. Hidden entirely until hydration proves
 * there is an artist session, so anonymous visitors never see a dead control.
 */
export default function NotificationBell() {
  const { session, ready, items, unread, loading, error, refresh, markRead, markAllRead } =
    useArtistNotifications();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!ready || !session) return null;

  const handleItemClick = (item: NotificationItem) => {
    void markRead(item.id);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={
          unread > 0
            ? `Notifications — ${unread} unread`
            : "Notifications"
        }
        className="relative flex h-9 w-9 items-center justify-center border-2 border-ink bg-cream shadow-[3px_3px_0px_0px_#000000] transition-all hover:-translate-y-0.5 hover:bg-sun"
      >
        <Bell className="h-4.5 w-4.5" strokeWidth={2.5} />
        {unread > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-ink bg-red px-1 text-[10px] font-bold leading-none text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
          />

          <aside
            role="dialog"
            aria-label="Notification Center"
            className="relative flex h-full w-full max-w-sm flex-col border-l-2 border-ink bg-cream shadow-[-8px_0px_0px_0px_var(--color-ink)]"
          >
            <header className="flex items-center justify-between gap-3 border-b-2 border-ink bg-sun px-4 py-4">
              <div>
                <p className="font-blocky text-lg font-bold uppercase leading-none tracking-tight text-ink">
                  Notification Center
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/60">
                  {session.name ? `Hi ${session.name.split(" ")[0]} · ` : ""}
                  {unread} unread of {items.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button
                    type="button"
                    onClick={markAllRead}
                    title="Mark all as read"
                    className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-cream shadow-[2px_2px_0px_0px_var(--color-ink)] transition-all hover:bg-sun"
                  >
                    <CheckCheck className="h-4 w-4" strokeWidth={2.5} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-cream shadow-[2px_2px_0px_0px_var(--color-ink)] transition-all hover:bg-sun"
                >
                  <X className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {error ? (
                <NotificationError message={error} onRetry={refresh} />
              ) : loading && items.length === 0 ? (
                <>
                  <NotificationLoadingRow />
                  <NotificationSkeleton />
                </>
              ) : (
                <NotificationList
                  items={items}
                  onItemClick={handleItemClick}
                  compact
                />
              )}
            </div>

            <footer className="border-t-2 border-ink bg-white px-4 py-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link
                  href="/notifications"
                  onClick={() => setOpen(false)}
                  className="text-xs font-bold uppercase tracking-widest underline decoration-sun decoration-[3px] underline-offset-4"
                >
                  View all
                </Link>
                <Link
                  href="/events/bihar-got-talent"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 border-2 border-ink bg-sun px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5"
                >
                  Bihar Got Talent
                </Link>
              </div>
            </footer>
          </aside>
        </div>
      )}
    </>
  );
}
