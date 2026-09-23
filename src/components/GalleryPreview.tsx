import Link from "next/link";
import { ArrowRight, Camera } from "lucide-react";
import ImageWithFallback from "@/components/blog/ImageWithFallback";
import { galleryImages } from "@/data/gallery";

const preview = galleryImages.slice(0, 4);

export default function GalleryPreview() {
  return (
    <section className="border-t-2 border-ink bg-cream">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex -rotate-1 items-center gap-2 border-2 border-ink bg-sun px-3 py-1.5 text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_var(--color-ink)]">
              <Camera className="h-3.5 w-3.5" strokeWidth={2.5} />
              Gallery
            </span>
            <h2 className="mt-5 font-blocky text-3xl font-bold uppercase tracking-tight sm:text-4xl">
              Moments from{" "}
              <span className="relative z-0 inline-block whitespace-nowrap">
                <svg
                  viewBox="0 0 120 26"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute left-0 top-[30%] -z-10 h-[115%] w-full"
                >
                  <path
                    d="M3 20 C 30 5, 90 5, 117 14"
                    stroke="#F2EE07"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                the floor.
              </span>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 border-2 border-ink bg-red px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[4px_4px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_var(--color-ink)]"
          >
            View All Photos
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              strokeWidth={2.5}
            />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((photo) => (
            <Link
              key={photo.id}
              href="/gallery"
              className="group relative block border-2 border-ink bg-cream shadow-[6px_6px_0px_0px_var(--color-ink)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_var(--color-ink)]"
            >
              <div className="overflow-hidden border-b-2 border-ink">
                <ImageWithFallback
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-1 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/50">
                  {photo.category}
                </p>
                <p className="font-blocky text-sm font-bold uppercase leading-snug tracking-tight">
                  {photo.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}