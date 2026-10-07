"use client";

import Link from "next/link";
import { BellOff, Loader2, RotateCw } from "lucide-react";
import { formatTimeAgo, type NotificationItem } from "@/lib/artist";

export function NotificationSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-20 animate-pulse border-2 border-dashed border-ink/25 bg-white/60"
        />
      ))}
    </div>
  );
}

export function NotificationEmpty() {
  return (
    <div className="border-2 border-dashed border-ink/40 px-5 py-10 text-center">
      <BellOff className="mx-auto h-8 w-8 text-ink/35" strokeWidth={2} />
      <p className="mt-3 font-blocky text-lg font-bold uppercase tracking-tight text-ink">
        Nothing yet
      </p>
      <p className="mx-auto mt-1.5 max-w-xs text-sm font-medium leading-relaxed text-ink/60">
        Audition calls, shortlist updates and showcase invites will land here —
        and in your inbox.
      </p>
      <Link
        href="/events/bihar-got-talent"
        className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5"
      >
        Explore Bihar Got Talent
      </Link>
    </div>
  );
}

export function NotificationError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="border-2 border-ink bg-[#fecaca] px-4 py-4" role="alert">
      <p className="text-sm font-bold text-ink">Couldn&apos;t load notifications.</p>
      <p className="mt-1 text-xs font-medium text-ink/70">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 inline-flex items-center gap-1.5 border-2 border-ink bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:bg-sun"
      >
        <RotateCw className="h-3.5 w-3.5" strokeWidth={2.5} />
        Retry
      </button>
    </div>
  );
}

export function NotificationLoadingRow() {
  return (
    <p className="flex items-center gap-2 px-1 py-3 text-xs font-bold uppercase tracking-widest text-ink/50">
      <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
      Loading…
    </p>
  );
}

type ListProps = {
  items: NotificationItem[];
  /** Called on row click (mark-read), before any link navigation. */
  onItemClick?: (item: NotificationItem) => void;
  compact?: boolean;
};

/**
 * Rows shared by the bell drawer and the full Notification Center page.
 * Unread rows get the yellow marker; clicking one marks it read and follows
 * its link when it has one.
 */
export default function NotificationList({ items, onItemClick, compact }: ListProps) {
  if (items.length === 0) return <NotificationEmpty />;

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const row = (
          <span className="block w-full text-left">
            <span className="flex items-start justify-between gap-3">
              <span className="font-blocky text-[13px] font-bold uppercase leading-snug tracking-tight text-ink">
                {item.title}
              </span>
              {!item.read && (
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-ink bg-sun" />
              )}
            </span>
            <span
              className={`mt-1.5 block text-sm font-medium leading-relaxed ${
                compact ? "line-clamp-3 text-ink/65" : "text-ink/70"
              }`}
            >
              {item.body}
            </span>
            <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
              {formatTimeAgo(item.createdAt)}
              {!item.read && <span className="text-ink/60"> · Unread</span>}
            </span>
          </span>
        );

        const className = `block w-full border-2 border-ink px-4 py-3.5 transition-colors ${
          item.read
            ? "bg-white"
            : "bg-sun/40 shadow-[3px_3px_0px_0px_var(--color-ink)] hover:bg-sun/60"
        }`;

        if (item.link) {
          return (
            <li key={item.id}>
              <Link
                href={item.link}
                className={className}
                onClick={() => onItemClick?.(item)}
              >
                {row}
              </Link>
            </li>
          );
        }

        return (
          <li key={item.id}>
            <button
              type="button"
              className={className}
              onClick={() => onItemClick?.(item)}
            >
              {row}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
