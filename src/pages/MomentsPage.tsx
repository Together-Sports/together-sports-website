import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IS_SERVER } from "@/lib/ssr";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";
import { useEditableContent } from "@/lib/editable-content";
import { imgProps } from "@/lib/image-position";
import type { Experience } from "@/data/experiences";
import { useSiteText } from "@/lib/use-site-text";

const AUTOPLAY_INTERVAL_MS = 4000;

const AutoPhotoCarousel = ({
  images,
  altPrefix
}: {
  images: string[];
  altPrefix: string;
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [api, current, paused]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* [&>div]:h-full reaches the embla viewport div inside Carousel;
          ml-0/pl-0 strip the slide gutters so images bleed edge to edge. */}
      <Carousel opts={{ loop: true }} setApi={setApi} className="h-full [&>div]:h-full">
        <CarouselContent className="ml-0 flex h-full">
          {images.map((src, idx) => (
            <CarouselItem key={idx} className="h-full pl-0">
              <img
                {...imgProps(src)}
                alt={`${altPrefix} ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {images.length > 1 ? (
        // Dots sit top-right so they never collide with the tag/caption
        // that lives along the bottom of the tile.
        <div className="absolute right-3 top-3 z-10 flex gap-1.5">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to photo ${idx + 1}`}
              onClick={() => api?.scrollTo(idx)}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                idx === current ? "w-5 bg-white" : "w-1.5 bg-white/60"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

// Small green label above the caption, e.g. "CHIANG MAI · SOCCER",
// composed from the optional location and sport fields.
const photoTag = (item: Experience) =>
  [item.location, item.sport]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" · ")
    .toUpperCase();

const PhotoCard = ({ item, index }: { item: Experience; index: number }) => {
  const tag = photoTag(item);

  return (
    <ScrollReveal direction="scale" delay={index * 0.12}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[3px]">
        {item.images && item.images.length > 1 ? (
          <AutoPhotoCarousel
            images={item.images}
            altPrefix={item.caption || "Experience photo"}
          />
        ) : (
          <img
            {...imgProps(item.image)}
            alt={item.caption || "Experience photo"}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        )}

        {tag || item.caption ? (
          <>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(20,26,55,0.82)_0%,rgba(20,26,55,0.35)_32%,rgba(20,26,55,0)_55%)]" />
            <div className="pointer-events-none absolute bottom-3.5 left-4 right-4 flex flex-col gap-1.5">
              {tag ? (
                <p className="font-body text-[10px] font-bold uppercase tracking-[1.5px] text-[#b5e36a]">
                  {tag}
                </p>
              ) : null}
              {item.caption ? (
                <p className="font-body text-sm font-semibold leading-snug text-white [text-wrap:pretty]">
                  {item.caption}
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </ScrollReveal>
  );
};

const VideoCard = ({ item, index }: { item: Experience; index: number }) => (
  <ScrollReveal direction="up" delay={index * 0.15}>
    <div className="border border-border bg-background overflow-hidden">
      <div className="relative w-full aspect-video">
        <iframe
          src={item.videoUrl}
          title={item.videoTitle || "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
      {item.videoTitle ? (
        <div className="p-4 text-center">
          <p className="font-heading font-bold uppercase text-sm">
            {item.videoTitle}
          </p>
        </div>
      ) : null}
    </div>
  </ScrollReveal>
);

const MomentsPage = () => {
  const t = useSiteText();
  const { experiences } = useEditableContent();
  const photos = experiences.filter((e) => e.type === "photo" && e.image);
  const videos = experiences.filter((e) => e.type === "video" && e.videoUrl);

  return (
    <div className="overflow-hidden">
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 md:pt-24">
          <motion.div
            initial={IS_SERVER ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-2 flex items-center gap-3.5">
              <span aria-hidden className="h-[3px] w-8 shrink-0 bg-accent" />
              <h1 className="font-heading text-3xl sm:text-4xl md:text-[2.5rem] font-black uppercase tracking-wide text-foreground">
                {t("moments.heroTitle")}
              </h1>
            </div>
            <p className="max-w-2xl font-body text-[15px] leading-relaxed text-muted-foreground md:ml-[46px]">
              {t("moments.heroSubtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {photos.length > 0 ? (
        <section className="pt-10 pb-10 md:pt-12 md:pb-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((p, i) => (
                <PhotoCard key={p.id} item={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 text-center">
          <p className="text-muted-foreground text-lg">
            Photos are on the way — check back soon!
          </p>
        </section>
      )}

      {videos.length > 0 ? (
        <section className="pb-14 md:pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="font-heading text-5xl md:text-7xl font-black uppercase mb-8 md:mb-12 text-center">
                {t("moments.videosHeading")}
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

      <section className="bg-card py-14 md:py-20 scratchy-overlay">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <ScrollReveal direction="scale">
            <h2 className="mb-4 font-heading text-4xl md:text-5xl font-black uppercase">
              {t("moments.ctaHeading")}
            </h2>
            <p className="mx-auto mb-8 max-w-md text-lg text-muted-foreground">
              {t("moments.ctaBody")}
            </p>
            <Link
              to="/experiences"
              className="inline-block bg-primary px-8 py-4 font-heading font-bold uppercase tracking-wider text-white transition-all duration-200 hover:scale-105"
            >
              {t("moments.ctaButton")}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default MomentsPage;
