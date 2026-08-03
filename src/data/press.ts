export type PressArticle = {
  id: string;
  // Publication name, e.g. "The Riverdale Press".
  outlet: string;
  title: string;
  // Free-text date label, e.g. "July 2026".
  date: string;
  // Link to the article.
  href: string;
  // Short pull-quote or summary shown on the card.
  excerpt?: string;
  // Optional photo or clipping image.
  image?: string;
  // Optional video clip (uploaded MP4 or a YouTube link). When set, it plays
  // in place of the photo, with the photo used as the video's cover image.
  video?: string;
  // Optional publication logo, shown in place of the outlet name tag.
  logo?: string;
};

const pressArticles: PressArticle[] = [];

export default pressArticles;
