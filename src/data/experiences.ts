import heroImage from "@/assets/hero-sports.jpg";
import image0903 from "@/assets/IMG_0903.jpg";
import image3782 from "@/assets/IMG_3782.jpg";
import julian from "@assests/julian.jpg";

export type ExperienceType = "quote" | "parent" | "photo" | "video";

export type Experience = {
  id: string;
  type: ExperienceType;
  sport?: string;
  quote?: string;
  name?: string;
  age?: string;
  rating?: number;
  image?: string;
  caption?: string;
  videoUrl?: string;
  videoTitle?: string;
};

const experiences: Experience[] = [
  {
    id: "quote-1",
    type: "quote",
    sport: "Tennis",
    quote:
      "My 4-year-old had her first tennis lesson with Coach Harry, and it could not have gone better. He met her where she was, encouraging, kind, and full of energy. Together Tennis makes tennis feel welcoming for families at every level.",
    name: "Leigh H.",
    age: "Parent",
    rating: 5,
  },
  {
    id: "quote-2",
    type: "quote",
    sport: "Tennis",
    quote:
      "Zoe had a great experience practicing tennis with Harry. He did an excellent job teaching her techniques to improve her game. I would highly recommend Harry to any students who are looking to become better tennis players.",
    name: "Michael B.",
    age: "Parent",
    rating: 5,
  },
  {
    id: "quote-3",
    type: "quote",
    sport: "Tennis",
    quote:
      "Theo has always been quite shy, especially in new environments where he would normally stay close to me. Seeing him open up with you has been truly special, thank you for helping him come out of his shell!",
    name: "Rachel L.",
    age: "Parent",
    rating: 5,
  },
  {
    id: "parent-1",
    type: "parent",
    sport: "Basketball",
    quote:
      "We have seen so much confidence grow through the program. The coaches make the environment feel positive, focused, and welcoming for families.",
    name: "Parent Name",
    rating: 5,
  },
  {
    id: "photo-1",
    type: "photo",
    image: image0903,
    caption: "Practice moments that turn into confidence.",
  },
  {
    id: "photo-2",
    type: "photo",
    image: image3782,
    caption: "Community, connection, and a lot of joy on court.",
  },
  {
    id: "photo-3",
    type: "photo",
    image: mentorshipImg,
    caption: "Mentorship is part of the experience too.",
  },

  {
    id: "photo-4",
    type: "photo",
    image: heroImage,
    caption: "The bigger picture is always community.",
  },
];

export default experiences;
