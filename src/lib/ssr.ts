// True while rendering on the server (the build-time prerender pass).
// Used to render motion-wrapped content in its final, fully visible state so
// the static HTML never ships hidden text — the client bundle still animates.
export const IS_SERVER = typeof window === "undefined";
