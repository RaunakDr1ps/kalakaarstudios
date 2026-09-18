"use client";

import { useState } from "react";

// On-brand "no image" placeholder rendered when a cover URL fails to load —
// covers Unsplash/Imgur/Supabase CDN/PostImage URLs that may block hotlinks.
const FALLBACK_SRC =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="#F2EE07"/><rect x="4" y="4" width="632" height="352" fill="none" stroke="#111827" stroke-width="8"/><circle cx="320" cy="180" r="56" fill="none" stroke="#111827" stroke-width="18"/><path d="M242 258 L398 102" stroke="#111827" stroke-width="18" stroke-linecap="round"/><rect x="260" y="300" width="120" height="14" fill="#111827"/></svg>`
  );

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export default function ImageWithFallback({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false);

  const usable = !failed && /^(https?:\/\/|data:|\.?\/)/i.test(src.trim());

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={usable ? src : FALLBACK_SRC}
      alt={usable ? alt : "Image unavailable"}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}