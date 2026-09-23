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
    title: "Community Outreach & Event Gathering",
    category: "Events",
    imageUrl: "/gallery/event1.png",
    caption: "Open-air community gathering produced end-to-end by the crew.",
  },
  {
    id: "2",
    title: "Mall Production & Stage Setup",
    category: "Events",
    imageUrl: "/gallery/event2.png",
    caption: "Stage and audio systems rigged and focused for a mall production.",
  },
  {
    id: "3",
    title: "Team Strategy & Meetup",
    category: "Behind the Scenes",
    imageUrl: "/gallery/event3.png",
    caption: "The crew huddles on scope, sequence, and who runs which mic.",
  },
  {
    id: "4",
    title: "Kalakaar Core Team",
    category: "Behind the Scenes",
    imageUrl: "/gallery/event4.png",
    caption: "The core team that plans it, builds it, and runs it.",
  },
  {
    id: "5",
    title: "Corporate Meeting & Partner Briefing",
    category: "Events",
    imageUrl: "/gallery/event5.png",
    caption: "Briefing partners on delivery timelines ahead of show day.",
  },
  {
    id: "6",
    title: "Studio Lounge & Crew Night",
    category: "Behind the Scenes",
    imageUrl: "/gallery/event6.png",
    caption: "After-hours at the studio, where the next big idea takes shape.",
  },
  {
    id: "7",
    title: "Night Evening Gathering",
    category: "Events",
    imageUrl: "/gallery/event7.png",
    caption: "An evening gathering wrapped in lights, sound, and good chaos.",
  },
  {
    id: "8",
    title: "Festival Crew & Leadership Team",
    category: "Events",
    imageUrl: "/gallery/event8.png",
    caption: "Festival crew and leadership mid-load-in, ready to run.",
  },
];