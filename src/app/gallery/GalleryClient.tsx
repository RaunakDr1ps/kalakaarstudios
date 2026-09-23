"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Camera, X } from "lucide-react";
import ImageWithFallback from "@/components/blog/ImageWithFallback";
import { galleryImages, type GalleryImage } from "@/data/gallery";

type Category = "All" | GalleryImage["category"];

const categories: Category[] = [
  "All",
  ...Array.from(new Set(galleryImages.map((img) => img.category))),
];

// Staggered aspect ratios give the grid a masonry-like rhythm.
const ratios = ["aspect-[4/3]", "aspect-square", "aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[3/4]"];

export default function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages = useMemo(
    () =>
      activeCategory === "All"
        ? galleryImages
        : galleryImages.filter((img) => img.category === activeCategory),
    [activeCategory]
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const step = useCallback(
    (dir: 1 | -1) => {
      setLightboxIndex((current) => {
        if (current === null) return current;
        const next = current + dir;
        return (next + filteredImages.length) % filteredImages.length;
      });
    },
    [filteredImages.length]
  );

  const stepForward = useCallback(() => step(1), [step]);
  const stepBack = useCallback(() => step(-1), [step]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") stepForward();
      if (e.key === "ArrowLeft") stepBack();
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, stepForward, stepBack]);

  const current = lightboxIndex !== null ? filteredImages[lightboxIndex] : null;

  return (
    <>
      <main className="bg-cream text-ink">
        <section className="border-b-2 border-ink bg-sun/30">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
            <span className="inline-flex -rotate-1 items-center gap-2 border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_var(--color-ink)]">
              <Camera className="h-3.5 w-3.5" strokeWidth={2.5} />
              The Gallery
            </span>
            <h1 className="mt-5 font-blocky text-4xl font-bold uppercase leading-[1.02] tracking-tight sm:text-5xl">
              Where the magic
              <br />
              gets photographed.
            </h1>
            <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-ink/70">
              Stages, crowds, rigs, and the chaos in between — shot by the
              crew that books and builds it.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category);
                    setLightboxIndex(null);
                  }}
                  className={`inline-flex items-center justify-center rounded-full border-2 border-ink px-5 py-2 text-xs font-bold uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--color-ink)] ${
                    isActive
                      ? "bg-sun shadow-[4px_4px_0px_0px_var(--color-ink)]"
                      : "bg-cream"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredImages.map((photo, i) => (
              <GalleryCard
                key={photo.id}
                photo={photo}
                ratio={ratios[i % ratios.length]}
                onOpen={() => setLightboxIndex(i)}
              />
            ))}
          </div>

          {filteredImages.length === 0 && (
            <p className="mt-16 text-center text-sm font-bold uppercase tracking-widest text-ink/50">
              No photos in this category yet.
            </p>
          )}
        </section>
      </main>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Lightbox: ${current.title}`}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="font-blocky text-lg font-bold uppercase tracking-tight text-cream sm:text-xl">
                {current.title}
              </p>
              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close lightbox"
                className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-cream text-cream transition-colors hover:bg-sun hover:text-ink"
              >
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="relative border-2 border-cream bg-ink">
              <ImageWithFallback
                src={current.imageUrl}
                alt={current.title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm font-medium leading-relaxed text-cream/70">
                {current.caption}
              </p>
              <p className="shrink-0 text-xs font-bold uppercase tracking-widest text-cream/50">
                {lightboxIndex! + 1} / {filteredImages.length}
              </p>
            </div>

            <button
              type="button"
              onClick={stepBack}
              aria-label="Previous photo"
              className="absolute -left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border-2 border-cream bg-cream text-ink transition-all hover:bg-sun sm:flex lg:-left-16"
            >
              <ArrowLeft className="h-6 w-6" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={stepForward}
              aria-label="Next photo"
              className="absolute -right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border-2 border-cream bg-cream text-ink transition-all hover:bg-sun sm:flex lg:-right-16"
            >
              <ArrowRight className="h-6 w-6" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function GalleryCard({
  photo,
  ratio,
  onOpen,
}: {
  photo: GalleryImage;
  ratio: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative flex flex-col overflow-hidden border-2 border-ink bg-cream text-left shadow-[6px_6px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-ink)]"
    >
      <div className={`relative overflow-hidden border-b-2 border-ink ${ratio}`}>
        <ImageWithFallback
          src={photo.imageUrl}
          alt={photo.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 border-2 border-ink bg-sun px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-[2px_2px_0px_0px_var(--color-ink)]">
          {photo.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-5">
        <p className="font-blocky text-base font-bold uppercase leading-snug tracking-tight">
          {photo.title}
        </p>
        <p className="mt-1 text-sm font-medium leading-relaxed text-ink/65">
          {photo.caption}
        </p>
      </div>
      <p className="mt-auto flex items-center gap-1.5 border-t-2 border-ink/10 px-5 py-3 text-xs font-bold uppercase tracking-widest text-ink/40 transition-colors group-hover:text-ink">
        <Camera className="h-3.5 w-3.5" strokeWidth={2.5} />
        Tap to view
      </p>
    </button>
  );
}