import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Carousel opts={{ loop: true }} setApi={setApi}>
        <CarouselContent className="flex">
          {images.map((src, idx) => (
            <CarouselItem key={idx} className="h-[300px] md:h-[350px]">
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
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
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

const PhotoCard = ({ item, index }: { item: Experience; index: number }) => {
  return (
    <ScrollReveal direction="scale" delay={index * 0.12}>
      <div className="text-center">
        {item.images && item.images.length > 1 ? (
          <AutoPhotoCarousel
            images={item.images}
            altPrefix={item.caption || "Experience photo"}
          />
        ) : (
          <img
            {...imgProps(item.image)}
            alt={item.caption || "Experience photo"}
            className="w-full h-[300px] md:h-[350px] object-cover"
            loading="lazy"
            decoding="async"
          />
        )}

        {item.caption ? (
          <p className="mt-3 text-muted-foreground text-sm font-body italic">
            {item.caption}
          </p>
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
      <section className="relative overflow-hidden bg-[#87cb4a]">
        <div className="absolute left-4 top-10 h-12 w-12 rounded-full bg-white/10 sm:left-8 sm:top-12 sm:h-[4.5rem] sm:w-[4.5rem] md:h-24 md:w-24" />
        <div className="absolute left-[20%] top-8 hidden h-14 w-14 bg-white/10 scrapbook-rotate-2 sm:block" />
        <div className="absolute right-6 top-10 h-12 w-12 rotate-45 bg-white/10 sm:right-10 sm:h-20 sm:w-20 md:h-24 md:w-24" />
        <div className="absolute right-[22%] top-28 hidden h-12 w-12 rounded-full bg-white/10 sm:block" />
        <div className="absolute right-12 bottom-8 hidden h-0 w-0 border-l-[22px] border-r-[22px] border-b-[38px] border-l-transparent border-r-transparent border-b-white/10 md:block" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-14 md:pt-28 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl sm:text-6xl md:text-[5.25rem] font-black uppercase leading-[0.95] mb-4 text-white">
              <span className="text-balance">{t("moments.heroTitle")}</span>
            </h1>
            <p className="text-white font-bold text-lg md:text-xl max-w-2xl mx-auto font-body">
              {t("moments.heroSubtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {photos.length > 0 ? (
        <section className="pt-14 pb-10 md:pt-28 md:pb-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
