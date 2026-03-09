import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { useEditableContent } from "@/lib/editable-content";
import type { Experience } from "@/data/experiences";

const sportAccent: Record<string, string> = {
  Tennis: "text-[hsl(var(--sport-tennis))]",
  Basketball: "text-[hsl(var(--sport-basketball))]",
  Football: "text-[hsl(var(--sport-football))]",
  Golf: "text-[hsl(var(--sport-golf))]",
};

const QuoteCard = ({ item, index }: { item: Experience; index: number }) => {
  return (
    <ScrollReveal direction="up" delay={index * 0.1}>
      <div className="p-8 bg-background border border-border hover:border-accent transition-colors duration-300 h-full">
        <p className={`font-heading font-bold uppercase text-sm mb-4 ${sportAccent[item.sport || ""] || "text-accent"}`}>
          {item.sport || "Together Sports"}
        </p>
        <p className="text-foreground text-xl leading-relaxed mb-6 font-body italic">
          "{item.quote}"
        </p>
        <p className="text-muted-foreground font-heading font-bold uppercase">
          {item.age ? `— ${item.name}, ${item.age}` : `— ${item.name}`}
        </p>
      </div>
    </ScrollReveal>
  );
};

const PhotoCard = ({ item, index }: { item: Experience; index: number }) => {
  return (
    <ScrollReveal direction="scale" delay={index * 0.12}>
      <div>
        <img
          src={item.image || ""}
          alt={item.caption || "Experience photo"}
          className="w-full h-[300px] md:h-[350px] object-cover"
          loading="lazy"
        />
        {item.caption ? (
          <p className="mt-3 text-muted-foreground text-sm font-body italic">{item.caption}</p>
        ) : null}
      </div>
    </ScrollReveal>
  );
};

const VideoCard = ({ item, index }: { item: Experience; index: number }) => (
  <ScrollReveal direction="up" delay={index * 0.15}>
    <div className="border border-border bg-background overflow-hidden">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={item.videoUrl}
          title={item.videoTitle || "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          loading="lazy"
        />
      </div>
      {item.videoTitle ? (
        <div className="p-4">
          <p className="font-heading font-bold uppercase text-sm">{item.videoTitle}</p>
        </div>
      ) : null}
    </div>
  </ScrollReveal>
);

const ExperiencesPage = () => {
  const { experiences } = useEditableContent();
  const quotes = experiences.filter((e) => e.type === "quote");
  const parentQuotes = experiences.filter((e) => e.type === "parent");
  const photos = experiences.filter((e) => e.type === "photo" && e.image);
  const videos = experiences.filter((e) => e.type === "video" && e.videoUrl);

  return (
    <div className="overflow-hidden">
      <section className="relative overflow-hidden bg-[#84a6ff]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 md:pt-28 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl md:text-7xl font-black uppercase leading-[0.95] mb-4 text-white">
              <span className="whitespace-nowrap">Our </span>
              <span className="whitespace-nowrap">Experiences</span>
            </h1>
            <p className="text-foreground text-lg md:text-xl max-w-2xl mx-auto font-body">
              Hear from the athletes, families, and coaches who make Together Sports what it is. These are their words, their moments, and their stories.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-12">
              In Their <span className="brush-underline">Words</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotes.map((q, i) => (
              <QuoteCard key={q.id} item={q} index={i} />
            ))}
          </div>
        </div>
      </section>

      {parentQuotes.length > 0 ? (
        <section className="py-20 md:py-28 bg-card scratchy-overlay">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4">
                From the Families
              </p>
              <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-12">
                Parents <span className="text-stroke">Speak</span>
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parentQuotes.map((q, i) => (
                <QuoteCard key={q.id} item={q} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {photos.length > 0 ? (
        <section className="py-20 md:py-28 bg-card scratchy-overlay">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-12">
                Moments <span className="text-stroke">Captured</span>
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {photos.map((p, i) => (
                <PhotoCard key={p.id} item={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {videos.length > 0 ? (
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-12">
                Watch <span className="brush-underline">Us Play</span>
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((v, i) => (
                <VideoCard key={v.id} item={v} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default ExperiencesPage;
