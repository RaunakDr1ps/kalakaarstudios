"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  fetchNotifications,
  getArtistSessionSnapshot,
  postNotificationAction,
  subscribeArtistSession,
  type ArtistSession,
  type NotificationItem,
} from "@/lib/artist";

const subscribeNoop = () => () => {};

/**
 * Shared state for the bell badge and the /notifications page.
 *
 * The artist session comes from `localStorage` through `useSyncExternalStore`,
 * so the static HTML always renders the anonymous state (server snapshot) and
 * React swaps in the registered state after hydration — no mismatch warnings.
 *
 * `loaded` starts false, which means "still waiting on the first fetch";
 * every state transition happens inside a promise continuation, never
 * synchronously inside the effect.
 */
export function useArtistNotifications() {
  const session = useSyncExternalStore(
    subscribeArtistSession,
    getArtistSessionSnapshot,
    () => null
  );
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((email: string) => {
    return fetchNotifications(email)
      .then((data) => {
        setItems(data.notifications);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Could not load notifications."
        );
      })
      .then(() => {
        setLoaded(true);
      });
  }, []);

  const email = session?.email ?? null;

  useEffect(() => {
    if (email) void load(email);
  }, [email, load]);

  const markRead = useCallback(
    async (id: string) => {
      if (!email) return;
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, read: true } : item))
      );
      try {
        await postNotificationAction({ action: "mark-read", email, id });
      } catch {
        void load(email);
      }
    },
    [email, load]
  );

  const markAllRead = useCallback(async () => {
    if (!email) return;
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
    try {
      await postNotificationAction({ action: "mark-all-read", email });
    } catch {
      void load(email);
    }
  }, [email, load]);

  const refresh = useCallback(() => {
    if (!email) return;
    setError(null);
    setLoaded(false);
    void load(email);
  }, [email, load]);

  const unread = items.filter((item) => !item.read).length;
  const loading = Boolean(email) && !loaded && !error;

  return {
    session: session as ArtistSession | null,
    ready: hydrated,
    items,
    unread,
    loading,
    error,
    refresh,
    markRead,
    markAllRead,
  };
}
