export type GalleryImage = {
  id: string;
  title: string;
  category: "Events" | "Esports" | "Behind the Scenes";
  imageUrl: string;
  caption: string;
};

export const galleryImages: GalleryImage[] = [
  {
    id: "1",
    title: "Live Concert Production",
    category: "Events",
    imageUrl: "/gallery/event-1.jpg",
    caption: "Stage lighting and sound setup for a headline live concert.",
  },
  {
    id: "2",
    title: "Crowd Moment — Festival Headliner",
    category: "Events",
    imageUrl: "/gallery/event-2.jpg",
    caption: "8,600+ hands in the air during the festival's closing set.",
  },
  {
    id: "3",
    title: "Corporate Gala Stage Build",
    category: "Events",
    imageUrl: "/gallery/event-3.jpg",
    caption: "Full stage rig and LED wall for a corporate awards night.",
  },
  {
    id: "4",
    title: "Brand Activation Pop-Up",
    category: "Events",
    imageUrl: "/gallery/event-4.jpg",
    caption: "Immersive set design from a high-traffic brand product unveiling.",
  },
  {
    id: "5",
    title: "Esports Arena — Grand Finals",
    category: "Esports",
    imageUrl: "/gallery/esports-1.jpg",
    caption: "Competitor stations under broadcast-grade arena lighting.",
  },
  {
    id: "6",
    title: "Main Stage Casting",
    category: "Esports",
    imageUrl: "/gallery/esports-2.jpg",
    caption: "Direktor's chair and desk setup prepped for the caster desk.",
  },
  {
    id: "7",
    title: "Audience Cam Sweep",
    category: "Esports",
    imageUrl: "/gallery/esports-3.jpg",
    caption: "Pack-out crowd reaction shot from the finals main event.",
  },
  {
    id: "8",
    title: "On-Screen Graphics Wall",
    category: "Esports",
    imageUrl: "/gallery/esports-4.jpg",
    caption: "Live bracket and stats rendered across the giant LED wall.",
  },
  {
    id: "9",
    title: "Load-In Morning",
    category: "Behind the Scenes",
    imageUrl: "/gallery/bts-1.jpg",
    caption: "Crew rigging truss for a stage build the night before showtime.",
  },
  {
    id: "10",
    title: "Audio Console Seat",
    category: "Behind the Scenes",
    imageUrl: "/gallery/bts-2.jpg",
    caption: "The FOH desk mid-soundcheck — where the show actually starts.",
  },
  {
    id: "11",
    title: "Crew Huddle",
    category: "Behind the Scenes",
    imageUrl: "/gallery/bts-3.jpg",
    caption: "Last-minute production call with the on-ground ops team.",
  },
  {
    id: "12",
    title: "Load-Out at Midnight",
    category: "Behind the Scenes",
    imageUrl: "/gallery/bts-4.jpg",
    caption: "Spotless strike and teardown long after the final applause.",
  },
];