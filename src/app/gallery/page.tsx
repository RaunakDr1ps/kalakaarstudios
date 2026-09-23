import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery | Kalakaar Studios",
  description:
    "Photos from a decade of live event production — concerts, corporate galas, esports arenas, and the behind-the-scenes crew work that makes it all happen.",
};

export default function GalleryPage() {
  return (
    <>
      <Header />
      <GalleryClient />
      <Footer />
    </>
  );
}