import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import heroImg from "@/assets/hero-sports.jpg";
import tennisAction from "@/assets/tennis-action.jpg";
import basketballAction from "@/assets/basketball-action.jpg";

const featured = {
  title: "Why Every Kid Needs a Second Serve",
  excerpt: "Inside our flagship tennis program that's changing lives across 15 communities.",
  image: heroImg,
  date: "Feb 20, 2026",
  slug: "#",
};

const posts = [
  {
    title: "Summer Camp Registration Now Open",
    excerpt: "Spots are filling fast for our 2026 summer athletic camps.",
    image: tennisAction,
    date: "Feb 15, 2026",
  },
  {
    title: "Meet Coach Rodriguez",
    excerpt: "From the streets to the sidelines — a story of transformation.",
    image: basketballAction,
    date: "Feb 10, 2026",
  },
  {
    title: "Basketball Tournament Recap",
    excerpt: "Our youth squad took home the trophy. Here's how they did it.",
    image: basketballAction,
    date: "Feb 5, 2026",
  },
  {
    title: "The Power of Mentorship in Sports",
    excerpt: "Why pairing young athletes with mentors changes everything.",
    image: tennisAction,
    date: "Jan 28, 2026",
  },
];

const BlogPage = () => {
  return (
    <div className="overflow-hidden">
      <section className="relative py-24 md:py-32 bg-card scratchy-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4">Stories</p>
            <h1 className="font-heading text-6xl md:text-8xl font-black uppercase leading-[0.85]">
              The <span className="text-stroke">Blog</span>
            </h1>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <Link to="#" className="group relative block overflow-hidden h-[400px] md:h-[500px]">
              <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-blue via-deep-blue/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12 max-w-2xl">
                <span className="inline-block px-3 py-1 bg-accent text-white font-heading font-bold text-xs uppercase tracking-wider mb-4">
                  Featured
                </span>
                <h2 className="font-heading text-3xl md:text-5xl font-black uppercase text-white group-hover:text-accent transition-colors mb-3">
                  {featured.title}
                </h2>
                <p className="text-white/70 text-lg">{featured.excerpt}</p>
                <p className="text-white/40 text-sm mt-3 font-body">{featured.date}</p>
              </div>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post, i) => (
              <ScrollReveal key={post.title} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                <Link to="#" className={`group block overflow-hidden ${i === 0 ? "md:row-span-2" : ""}`}>
                  <div className={`relative overflow-hidden ${i === 0 ? "h-[300px] md:h-full" : "h-[250px]"}`}>
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-blue via-deep-blue/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6">
                      <p className="text-white/40 text-xs font-body mb-2">{post.date}</p>
                      <h3 className="font-heading text-xl md:text-2xl font-black uppercase text-white group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-white/60 text-sm mt-1">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
