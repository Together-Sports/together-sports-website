import type { CSSProperties } from "react";

export type ImageFocalPoint = { x: number; y: number };

// A focal point is stored inline with the image value as a URL fragment,
// e.g. "https://.../photo.jpg#pos=50,20". Fragments never reach the server
// and are ignored by the browser when loading the image, so existing plain
// string values keep working everywhere.
const POS_MARKER = "#pos=";

const clampPercent = (value: number) =>
  Math.min(100, Math.max(0, Math.round(value)));

export const splitImageValue = (
  value: string
): { src: string; position: ImageFocalPoint | null } => {
  const markerIndex = value.indexOf(POS_MARKER);

  if (markerIndex === -1) {
    return { src: value, position: null };
  }

  const src = value.slice(0, markerIndex);
  const [x, y] = value
    .slice(markerIndex + POS_MARKER.length)
    .split(",")
    .map(Number);

  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return { src, position: null };
  }

  return { src, position: { x: clampPercent(x), y: clampPercent(y) } };
};

export const withImagePosition = (
  value: string,
  position: ImageFocalPoint | null
) => {
  const base = splitImageValue(value).src;

  if (!base || !position) {
    return base;
  }

  return `${base}${POS_MARKER}${clampPercent(position.x)},${clampPercent(position.y)}`;
};

export const imageObjectPosition = (
  position: ImageFocalPoint | null
): CSSProperties | undefined =>
  position ? { objectPosition: `${position.x}% ${position.y}%` } : undefined;

export const imgProps = (
  value: string | undefined | null
): { src: string; style?: CSSProperties } => {
  if (!value) {
    return { src: "" };
  }

  const { src, position } = splitImageValue(value);
  return position ? { src, style: imageObjectPosition(position) } : { src };
};
