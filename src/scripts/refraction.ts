/**
 * Progressive enhancement: refraction at the glass rim.
 * `backdrop-filter: url(#svg-filter)` is honoured by Chromium only, so the engine is checked first and every other
 * browser keeps the plain blur. Each glass surface gets its own filter, sized to the surface, whose displacement map
 * pushes the backdrop inward along the rim (a convex lens) and leaves the centre untouched.
 */
const SVG_NS = "http://www.w3.org/2000/svg";
const RIM = 20;
const SCALE = 22;

type BrandedNavigator = Navigator & { userAgentData?: { brands: Array<{ brand: string }> } };

const isChromium = (): boolean =>
  (navigator as BrandedNavigator).userAgentData?.brands.some((entry) => entry.brand === "Chromium") ?? false;

/** Neutral gray is no shift; red and blue channels carry the x and y offset. */
function displacementMap(width: number, height: number): string {
  const band = Math.min(RIM, width / 2, height / 2);
  const edge = (id: string, x: number, y: number, w: number, h: number, from: string, to: string, axis: "x" | "y"): string =>
    `<linearGradient id="${id}" ${axis === "x" ? 'x1="0" x2="1" y1="0" y2="0"' : 'x1="0" x2="0" y1="0" y2="1"'}>` +
    `<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>`;

  const svg =
    `<svg xmlns="${SVG_NS}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="${width}" height="${height}" fill="rgb(128,128,128)"/>` +
    edge("l", 0, 0, band, height, "rgb(255,128,128)", "rgb(128,128,128)", "x") +
    edge("r", width - band, 0, band, height, "rgb(128,128,128)", "rgb(0,128,128)", "x") +
    edge("t", 0, 0, width, band, "rgb(128,128,255)", "rgb(128,128,128)", "y") +
    edge("b", 0, height - band, width, band, "rgb(128,128,128)", "rgb(128,128,0)", "y") +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function initRefraction(): void {
  if (!isChromium()) return;
  const surfaces = document.querySelectorAll<HTMLElement>(".glass");
  if (!surfaces.length) return;

  const host = document.createElementNS(SVG_NS, "svg");
  host.setAttribute("width", "0");
  host.setAttribute("height", "0");
  host.setAttribute("aria-hidden", "true");
  host.style.position = "absolute";

  surfaces.forEach((surface, index) => {
    const id = `kk-refract-${index}`;
    const filter = document.createElementNS(SVG_NS, "filter");
    filter.setAttribute("id", id);
    filter.setAttribute("filterUnits", "userSpaceOnUse");
    filter.setAttribute("color-interpolation-filters", "sRGB");
    const map = document.createElementNS(SVG_NS, "feImage");
    map.setAttribute("preserveAspectRatio", "none");
    map.setAttribute("result", "map");
    const shift = document.createElementNS(SVG_NS, "feDisplacementMap");
    shift.setAttribute("in", "SourceGraphic");
    shift.setAttribute("in2", "map");
    shift.setAttribute("scale", String(SCALE));
    shift.setAttribute("xChannelSelector", "R");
    shift.setAttribute("yChannelSelector", "B");
    filter.append(map, shift);
    host.append(filter);

    new ResizeObserver(([entry]) => {
      const box = entry?.borderBoxSize[0];
      if (!box || box.inlineSize < 1 || box.blockSize < 1) return;
      const width = Math.round(box.inlineSize);
      const height = Math.round(box.blockSize);
      for (const node of [filter, map]) {
        node.setAttribute("x", "0");
        node.setAttribute("y", "0");
        node.setAttribute("width", String(width));
        node.setAttribute("height", String(height));
      }
      map.setAttribute("href", displacementMap(width, height));
    }).observe(surface);

    surface.style.setProperty("--refract", `url(#${id})`);
    surface.classList.add("glass--refract");
  });

  document.body.append(host);
}
