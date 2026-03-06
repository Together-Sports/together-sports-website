import { Link, useParams } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) {
    return (
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4">Blog</p>
          <h1 className="font-heading text-5xl md:text-7xl font-black uppercase mb-6">Post Not Found</h1>
          <p className="text-muted-foreground text-lg mb-8">
            That article is not available in the current synced Substack feed.
          </p>
          <Link
            to="/blog"
            className="inline-block px-8 py-4 bg-primary text-white font-heading font-bold text-lg uppercase tracking-wider hover:scale-105 transition-all duration-200"
          >
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  return (
    <article className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center text-sm font-body font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          Back to Blog
        </Link>

        <header className="mb-12">
          <p className="font-body font-bold uppercase tracking-[0.3em] text-accent text-sm mb-4">Together Sports</p>
          <h1 className="font-heading text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-6">{post.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-body uppercase tracking-[0.18em] text-muted-foreground">
            <span>{formatDate(post.publishedAt)}</span>
            <span>{post.author}</span>
          </div>
        </header>

        {post.image ? (
          <div className="mb-12 overflow-hidden border border-border bg-card">
            <img src={post.image} alt={post.title} className="w-full h-[260px] md:h-[420px] object-cover" />
          </div>
        ) : null}

        <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </div>
    </article>
  );
};

export default BlogPostPage;
