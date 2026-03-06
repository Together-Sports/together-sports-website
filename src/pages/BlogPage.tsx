import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { blogPosts } from "@/data/blogPosts";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const BlogPage = () => {
  const [featured, ...posts] = blogPosts;

  return (
    <div className="overflow-hidden">
      <section className="relative py-24 md:py-32 bg-card scratchy-overlay">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4">Stories</p>
            <h1 className="font-heading text-6xl md:text-8xl font-black uppercase leading-[0.85] mb-4">
              The <span className="text-stroke">Blog</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Synced from Together Sports on Substack, rendered here as native website posts.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {featured ? (
        <>
          <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <Link
                  to={`/blog/${featured.slug}`}
                  className="group relative block overflow-hidden min-h-[420px] md:min-h-[520px] border border-border bg-deep-blue"
                >
                  {featured.image ? (
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-br from-deep-blue via-primary/80 to-primary/40" />
                  <div className="relative z-10 flex min-h-[420px] md:min-h-[520px] items-end p-8 md:p-12">
                    <div className="max-w-3xl">
                      <span className="inline-block px-3 py-1 bg-accent text-white font-heading font-bold text-xs uppercase tracking-wider mb-4">
                        Featured
                      </span>
                      <h2 className="font-heading text-3xl md:text-6xl font-black uppercase text-white group-hover:text-accent transition-colors mb-4">
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

          <section className="pb-20 md:pb-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {posts.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post, i) => (
                    <ScrollReveal key={post.slug} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                      <Link to={`/blog/${post.slug}`} className="group block border border-border bg-card overflow-hidden">
                        <div className="relative min-h-[280px]">
                          {post.image ? (
                            <img
                              src={post.image}
                              alt={post.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : null}
                          <div className="absolute inset-0 bg-gradient-to-br from-deep-blue via-primary/75 to-primary/35" />
                          <div className="relative z-10 flex min-h-[280px] items-end p-6 md:p-8">
                            <div>
                              <p className="text-white/50 text-xs font-body uppercase tracking-[0.18em] mb-3">
                                {formatDate(post.publishedAt)}
                              </p>
                              <h3 className="font-heading text-2xl md:text-3xl font-black uppercase text-white group-hover:text-accent transition-colors mb-3">
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
                    <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4">Synced Feed</p>
                    <h2 className="font-heading text-4xl md:text-5xl font-black uppercase mb-4">More Stories Coming Soon</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                      The blog is now connected to Together Sports on Substack and refreshes automatically. New articles
                      will appear here as internal posts after the next sync cycle.
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
                <h2 className="font-heading text-4xl md:text-5xl font-black uppercase mb-4">No Synced Posts Yet</h2>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  The placeholder posts are gone. Once Substack publishes a post into the feed, it will be pulled in
                  automatically and open here as an internal blog page.
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
