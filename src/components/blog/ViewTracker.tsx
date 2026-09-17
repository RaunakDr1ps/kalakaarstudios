"use client";

import { useEffect } from "react";
import { incrementBlogViews } from "@/lib/blog";

// Count each post once per page load. A module-level set also swallows the
// double-invoke that React StrictMode does in dev so a single view can't
// inflate the counter.
const counted = new Set<string>();

export default function ViewTracker({ id }: { id: string }) {
  useEffect(() => {
    if (!id || counted.has(id)) return;
    counted.add(id);
    void incrementBlogViews(id);
  }, [id]);

  return null;
}