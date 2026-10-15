import type { ReactElement } from "react";
import { sprites, palette, type SpriteName } from "./sprites";

type Props = {
  name: SpriteName;
  /** Size of one pixel, in CSS px. */
  scale?: number;
  className?: string;
  title?: string;
  colors?: Record<string, string>;
};

/** Renders a text-grid sprite as crisp SVG rectangles (one rect per horizontal run). */
export default function PixelArt({ name, scale = 4, className, title, colors }: Props) {
  const grid = sprites[name];
  const pal = { ...palette, ...colors };
  const width = Math.max(...grid.map((row) => row.length));
  const height = grid.length;

  const rects: ReactElement[] = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      let run = 1;
      while (x + run < row.length && row[x + run] === ch) run++;
      if (ch !== "." && pal[ch]) {
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={pal[ch]} />);
      }
      x += run;
    }
  });

  return (
    <svg
      className={className}
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {rects}
    </svg>
  );
}
