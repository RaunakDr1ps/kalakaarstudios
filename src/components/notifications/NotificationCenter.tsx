"use client";

import Link from "next/link";
import { BellRing, CheckCheck, RefreshCw, UserPlus } from "lucide-react";
import type { NotificationItem } from "@/lib/artist";
import { useArtistNotifications } from "./useArtistNotifications";
import NotificationList, {
  NotificationError,
  NotificationLoadingRow,
  NotificationSkeleton,
} from "./NotificationList";

export default function NotificationCenter() {
  const {
    session,
    ready,
    items,
    unread,
    loading,
    error,
    refresh,
    markRead,
    markAllRead,
  } = useArtistNotifications();

  if (!ready) {
    return <NotificationSkeleton rows={4} />;
  }

  if (!session) {
    return (
      <div className="border-2 border-ink bg-white p-8 text-center shadow-[6px_6px_0px_0px_var(--color-ink)]">
        <span className="mx-auto flex h-14 w-14 items-center justify-center border-2 border-ink bg-sun shadow-[3px_3px_0px_0px_var(--color-ink)]">
          <BellRing className="h-7 w-7" strokeWidth={2.25} />
        </span>
        <h2 className="mt-5 font-blocky text-2xl font-bold uppercase tracking-tight">
          You&apos;re not on the roster yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-relaxed text-ink/70">
          The Notification Center is where registered artists see audition calls,
          shortlist updates and showcase invites. Register for Bihar Got Talent
          to unlock it.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/register/artist"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-sun px-6 py-3 text-sm font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5"
          >
            <UserPlus className="h-4 w-4" strokeWidth={2.5} />
            Register as an Artist
          </Link>
          <Link
            href="/events/bihar-got-talent"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-sun/40"
          >
            About Bihar Got Talent
          </Link>
        </div>
      </div>
    );
  }

  const handleItemClick = (item: NotificationItem) => {
    void markRead(item.id);
  };

  return (
    <div className="border-2 border-ink bg-white shadow-[6px_6px_0px_0px_var(--color-ink)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink bg-sun px-5 py-4">
        <div>
          <p className="font-blocky text-lg font-bold uppercase leading-none tracking-tight">
            Your updates
          </p>
          <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/60">
            {session.email} · {unread} unread of {items.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            aria-label="Refresh notifications"
            className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-cream shadow-[2px_2px_0px_0px_var(--color-ink)] transition-all hover:bg-sun disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              strokeWidth={2.5}
            />
          </button>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unread === 0}
            className="inline-flex items-center gap-1.5 border-2 border-ink bg-cream px-3 py-2 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_var(--color-ink)] transition-all hover:bg-sun disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" strokeWidth={2.5} />
            Mark all read
          </button>
        </div>
      </header>

      <div className="px-5 py-5">
        {error ? (
          <NotificationError message={error} onRetry={refresh} />
        ) : loading && items.length === 0 ? (
          <>
            <NotificationLoadingRow />
            <NotificationSkeleton rows={4} />
          </>
        ) : (
          <NotificationList items={items} onItemClick={handleItemClick} />
        )}
      </div>

      <footer className="border-t-2 border-ink bg-cream px-5 py-4 text-xs font-medium text-ink/60">
        Registration status and audition announcements for{" "}
        <span className="font-bold text-ink">{session.city || "Bihar"}</span>{" "}
        arrive here first. Need to change something? Email
        Kalakaarstudios@ssociopro.com with your registration ID.
      </footer>
    </div>
  );
}
