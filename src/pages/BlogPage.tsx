import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { useEditableContent } from "@/lib/editable-content";

const BLOG_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const BlogPage = () => {
  const { blogPosts, refreshContent, isLoadingContent } = useEditableContent();
  const featured = blogPosts.find((post) => post.featured) ?? blogPosts[0];
  const posts = featured ? blogPosts.filter((post) => post.slug !== featured.slug) : blogPosts;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      refreshContent().catch(console.error);
    }, BLOG_REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [refreshContent]);

  if (isLoadingContent) {
    return (
      <div className="overflow-hidden">
        <section className="relative overflow-hidden bg-[#ab9bfa]">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 md:pt-28 md:pb-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-heading text-5xl sm:text-6xl md:text-[5.25rem] font-black uppercase leading-[0.95] mb-4 text-white">
                <span className="sm:whitespace-nowrap">The </span>
                <span className="sm:whitespace-nowrap">Blog</span>
              </h1>
              <p className="text-white font-bold text-lg md:text-xl max-w-2xl mx-auto font-body">
                Stories, updates, and moments from Together Sports, all in one place on the site.
              </p>
            </div>
          </div>
        </section>
        <section className="py-16 md:py-18">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border border-border bg-card p-8 md:p-12">
              <p className="text-muted-foreground text-lg">Loading latest stories...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <section className="relative overflow-hidden bg-[#ab9bfa]">
        <div className="absolute left-6 top-10 h-10 w-10 rotate-45 bg-white/10 sm:left-12 sm:h-14 sm:w-14" />
        <div className="absolute left-[24%] top-24 hidden h-20 w-20 rounded-full bg-white/10 sm:block" />
        <div className="absolute right-6 top-8 h-12 w-12 bg-white/10 scrapbook-rotate-1 sm:right-10 sm:h-16 sm:w-16" />
        <div className="absolute right-[18%] top-24 hidden h-0 w-0 border-l-[24px] border-r-[24px] border-b-[42px] border-l-transparent border-r-transparent border-b-white/10 md:block" />
        <div className="absolute left-10 bottom-8 h-8 w-8 rounded-full bg-white/10 sm:left-20 sm:h-10 sm:w-10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 md:pt-28 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl sm:text-6xl md:text-[5.25rem] font-black uppercase leading-[0.95] mb-4 text-white">
              <span className="sm:whitespace-nowrap">The </span>
              <span className="sm:whitespace-nowrap">Blog</span>
            </h1>
            <p className="text-white font-bold text-lg md:text-xl max-w-2xl mx-auto font-body">
              Stories, updates, and moments from Together Sports, all in one place on the site.
            </p>
          </motion.div>
        </div>
      </section>

      {featured ? (
        <>
          <section className="py-16 md:py-18">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <Link
                  to={`/blog/${featured.slug}`}
                  className="group relative block overflow-hidden min-h-[340px] sm:min-h-[420px] md:min-h-[460px] border border-border bg-deep-blue"
                >
                  {featured.image ? (
                    <img
                      src={featured.image}
                      alt={featured.title}
                      loading="eager"
                      decoding="async"
                      fetchpriority="high"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-br from-deep-blue via-primary/80 to-primary/40" />
                  <div className="relative z-10 flex min-h-[340px] sm:min-h-[420px] md:min-h-[460px] items-end p-6 sm:p-8 md:p-10">
                    <div className="max-w-3xl">
                      {featured.tag || featured.featured ? (
                        <span className="inline-block px-3 py-1 bg-accent text-white font-heading font-bold text-xs uppercase tracking-wider mb-4">
                          {featured.tag?.trim() || "Featured"}
                        </span>
                      ) : null}
                      <h2 className="font-heading text-2xl sm:text-3xl md:text-6xl font-black uppercase text-white mb-4">
                        {featured.title}
                      </h2>
                      <p className="text-white/75 text-lg md:text-xl max-w-2xl">{featured.excerpt}</p>
                      <p className="text-white/50 text-sm mt-4 font-body uppercase tracking-[0.18em]">
                        {formatDate(featured.publishedAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          </section>

          <section className="pb-20 md:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {posts.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post, i) => (
                    <ScrollReveal key={post.slug} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                      <Link to={`/blog/${post.slug}`} className="group block border border-border bg-card overflow-hidden">
                        <div className="relative min-h-[240px] sm:min-h-[280px]">
                          {post.image ? (
                            <img
                              src={post.image}
                              alt={post.title}
                              loading="lazy"
                              decoding="async"
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : null}
                          <div className="absolute inset-0 bg-gradient-to-br from-deep-blue via-primary/75 to-primary/35" />
                          <div className="relative z-10 flex min-h-[240px] sm:min-h-[280px] items-end p-5 sm:p-6 md:p-8">
                            <div>
                              {post.tag?.trim() ? (
                                <span className="inline-block px-3 py-1 mb-3 bg-white/15 text-white font-heading font-bold text-[11px] uppercase tracking-[0.18em]">
                                  {post.tag.trim()}
                                </span>
                              ) : null}
                              <p className="text-white/50 text-xs font-body uppercase tracking-[0.18em] mb-3">
                                {formatDate(post.publishedAt)}
                              </p>
                              <h3 className="font-heading text-2xl md:text-3xl font-black uppercase text-white mb-3">
                                {post.title}
                              </h3>
                              <p className="text-white/70 text-sm md:text-base max-w-xl">{post.excerpt}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                <ScrollReveal>
                  <div className="border border-border bg-card p-8 md:p-12">
                    <h2 className="font-heading text-4xl md:text-5xl font-black uppercase mb-4">More Stories Are On The Way</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                      New stories, updates, and community moments will be shared here soon. Check back for the latest
                      from Together Sports.
                    </p>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </section>
        </>
      ) : (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="border border-border bg-card p-8 md:p-12">
                <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4">Blog</p>
                <h2 className="font-heading text-4xl md:text-5xl font-black uppercase mb-4">Stories Are Coming Soon</h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Fresh stories and updates will appear here soon. Visit again to see what Together Sports has been up to.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPage;
