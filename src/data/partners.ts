import partner1 from "@/assets/partner-1.png";
import partner2 from "@/assets/partner-2.png";
import partner3 from "@/assets/partner-3.png";
import partner4 from "@/assets/partner-4.png";

export type Partner = {
  id: string;
  name: string;
  logo: string;
  href: string;
};

const partners: Partner[] = [
  { id: "partner-1", name: "Rally Forward NYC", logo: partner1, href: "https://www.instagram.com/rallyforwardnyc/" },
  { id: "partner-2", name: "Next Steps", logo: partner2, href: "https://www.nextstepsjournal.org" },
  { id: "partner-3", name: "STEMise", logo: partner3, href: "https://www.stemise.org" },
  { id: "partner-4", name: "Ball Back Project", logo: partner4, href: "https://www.instagram.com/ballbackproject/" },
];

export default partners;
