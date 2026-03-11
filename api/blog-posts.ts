import { createClient } from "@supabase/supabase-js";
import { fetchSubstackPosts } from "../scripts/substack-feed.mjs";

const BLOG_CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=300";
const BLOG_CACHE_TABLE = "blog_feed_cache";
const BLOG_CACHE_ROW_ID = "substack";
const DEFAULT_HIDE_AFTER_MINUTES = 720;

type LiveBlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  author: string;
  sourceUrl: string;
  image: string | null;
  contentHtml: string;
  featured?: boolean;
  tag?: string;
};

type CachedBlogPost = LiveBlogPost & {
  lastSeenAt: string | null;
  missingSince: string | null;
  hidden: boolean;
};

type BlogCacheRow = {
  id: string;
  posts: CachedBlogPost[];
  updated_at?: string;
};

const toValidUrl = (value: string | undefined) => {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};

const supabaseUrl = toValidUrl(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const blogCacheClient =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

const hideAfterMinutes = Number.parseInt(process.env.BLOG_CACHE_HIDE_AFTER_MINUTES || "", 10);
const hideAfterMs =
  Number.isFinite(hideAfterMinutes) && hideAfterMinutes > 0
    ? hideAfterMinutes * 60 * 1000
    : DEFAULT_HIDE_AFTER_MINUTES * 60 * 1000;

const asCachedPost = (post: LiveBlogPost, nowIso: string): CachedBlogPost => ({
  ...post,
  featured: post.featured ?? false,
  tag: post.tag ?? "",
  lastSeenAt: nowIso,
  missingSince: null,
  hidden: false,
});

const coerceCachedPosts = (value: unknown): CachedBlogPost[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Partial<CachedBlogPost> & { slug: string; title: string } => Boolean(item) && typeof item === "object" && typeof (item as { slug?: unknown }).slug === "string" && typeof (item as { title?: unknown }).title === "string")
    .map((item) => ({
      title: item.title,
      slug: item.slug,
      excerpt: typeof item.excerpt === "string" ? item.excerpt : "",
      publishedAt: typeof item.publishedAt === "string" ? item.publishedAt : "",
      author: typeof item.author === "string" ? item.author : "Together Sports",
      sourceUrl: typeof item.sourceUrl === "string" ? item.sourceUrl : "",
      image: typeof item.image === "string" ? item.image : null,
      contentHtml: typeof item.contentHtml === "string" ? item.contentHtml : "",
      featured: Boolean(item.featured),
      tag: typeof item.tag === "string" ? item.tag : "",
      lastSeenAt: typeof item.lastSeenAt === "string" ? item.lastSeenAt : null,
      missingSince: typeof item.missingSince === "string" ? item.missingSince : null,
      hidden: Boolean(item.hidden),
    }));
};

const sortPosts = <T extends { publishedAt: string }>(posts: T[]) =>
  [...posts].sort((left, right) => {
    const leftTime = Number.isNaN(Date.parse(left.publishedAt)) ? 0 : Date.parse(left.publishedAt);
    const rightTime = Number.isNaN(Date.parse(right.publishedAt)) ? 0 : Date.parse(right.publishedAt);
    return rightTime - leftTime;
  });

const mergePosts = (cachedPosts: CachedBlogPost[], livePosts: LiveBlogPost[], nowIso: string) => {
  const liveBySlug = new Map(livePosts.map((post) => [post.slug, post]));
  const cachedBySlug = new Map(cachedPosts.map((post) => [post.slug, post]));

  const merged = livePosts.map((post) => {
    const previous = cachedBySlug.get(post.slug);

    return {
      ...post,
      featured: previous?.featured ?? false,
      tag: previous?.tag ?? "",
      lastSeenAt: nowIso,
      missingSince: null,
      hidden: false,
    } satisfies CachedBlogPost;
  });

  for (const cachedPost of cachedPosts) {
    if (liveBySlug.has(cachedPost.slug)) {
      continue;
    }

    const missingSince = cachedPost.missingSince || nowIso;
    const missingAge = Date.now() - Date.parse(missingSince);

    merged.push({
      ...cachedPost,
      missingSince,
      hidden: missingAge >= hideAfterMs,
    });
  }

  return sortPosts(merged);
};

const readCachedPosts = async () => {
  if (!blogCacheClient) {
    return [] as CachedBlogPost[];
  }

  const { data, error } = await blogCacheClient
    .from(BLOG_CACHE_TABLE)
    .select("id, posts, updated_at")
    .eq("id", BLOG_CACHE_ROW_ID)
    .maybeSingle<BlogCacheRow>();

  if (error) {
    throw error;
  }

  return coerceCachedPosts(data?.posts);
};

const writeCachedPosts = async (posts: CachedBlogPost[]) => {
  if (!blogCacheClient) {
    return;
  }

  const { error } = await blogCacheClient.from(BLOG_CACHE_TABLE).upsert(
    {
      id: BLOG_CACHE_ROW_ID,
      posts,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    throw error;
  }
};

const visiblePosts = (posts: CachedBlogPost[]): LiveBlogPost[] =>
  posts
    .filter((post) => !post.hidden)
    .map(({ lastSeenAt: _lastSeenAt, missingSince: _missingSince, hidden: _hidden, ...post }) => post);

export async function GET() {
  try {
    const [cachedPosts, livePosts] = await Promise.all([readCachedPosts(), fetchSubstackPosts()]);

    if (!Array.isArray(livePosts) || livePosts.length === 0) {
      if (cachedPosts.length > 0) {
        return Response.json(
          { posts: visiblePosts(cachedPosts), source: "cache" },
          {
            status: 200,
            headers: {
              "Cache-Control": BLOG_CACHE_CONTROL,
            },
          },
        );
      }

      throw new Error("Substack feed returned no posts.");
    }

    const nowIso = new Date().toISOString();
    const mergedPosts = mergePosts(cachedPosts, livePosts, nowIso);
    await writeCachedPosts(mergedPosts);

    return Response.json(
      { posts: visiblePosts(mergedPosts), source: "live" },
      {
        status: 200,
        headers: {
          "Cache-Control": BLOG_CACHE_CONTROL,
        },
      },
    );
  } catch (error) {
    try {
      const cachedPosts = await readCachedPosts();
      if (cachedPosts.length > 0) {
        return Response.json(
          { posts: visiblePosts(cachedPosts), source: "cache" },
          {
            status: 200,
            headers: {
              "Cache-Control": BLOG_CACHE_CONTROL,
            },
          },
        );
      }
    } catch (cacheError) {
      console.error(cacheError);
    }

    const message = error instanceof Error ? error.message : "Unable to fetch blog posts.";
    return Response.json(
      { error: message },
      {
        status: 502,
        headers: {
          "Cache-Control": BLOG_CACHE_CONTROL,
        },
      },
    );
  }
}
