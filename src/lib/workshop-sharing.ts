import { WORKSHOPS, formatFee } from "@/data/sample";

const FALLBACK_IMAGE = "/social/kamotgibo-workshop.png";

function validOrigin(value: string) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password
      ? url.origin
      : undefined;
  } catch {
    return undefined;
  }
}

export function getPublicWorkshop(id: string) {
  return WORKSHOPS.find((workshop) => workshop.id === id);
}

export function isPublicShareOrigin(value: string) {
  const origin = validOrigin(value);
  if (!origin) return false;
  const host = new URL(origin).hostname.toLowerCase();
  return (
    host.includes(".") &&
    !/^(?:\d+\.){3}\d+$/.test(host) &&
    !host.includes(":") &&
    !["localhost", ".localhost", ".local", ".test", ".invalid"].some((suffix) =>
      host.endsWith(suffix),
    )
  );
}

export function getWorkshopShareData(id: string, value: string) {
  const workshop = getPublicWorkshop(id);
  const origin = validOrigin(value);
  if (!workshop || !origin) return undefined;
  const session = [workshop.nextDate, workshop.time].filter(Boolean).join(", ");
  return {
    title: `${workshop.title} · KamotGibo`,
    text: `Learn ${workshop.craft.toLowerCase()} with ${workshop.instructor} in ${workshop.town}. ${session ? `${session}. ` : ""}${formatFee(workshop.fee)}.`,
    url: new URL(`/workshops/${encodeURIComponent(workshop.id)}`, origin).href,
  };
}

export function getWorkshopMetadata(id: string, origin: string) {
  const workshop = getPublicWorkshop(id);
  const data = getWorkshopShareData(id, origin);
  if (!workshop || !data) return undefined;
  let image = new URL(FALLBACK_IMAGE, origin).href;
  let customImage = false;
  if (workshop.imageUrl) {
    try {
      const candidate = new URL(workshop.imageUrl, origin);
      // shortcut: URLs are checked structurally; validate image content when public uploads are added.
      if (
        isPublicShareOrigin(candidate.origin) &&
        /\.(png|jpe?g|webp)$/i.test(candidate.pathname) &&
        !candidate.username &&
        !candidate.password
      ) {
        candidate.hash = "";
        image = candidate.href;
        customImage = true;
      }
    } catch {
      // Use the shared branded preview if the record's image URL is invalid.
    }
  }
  const meta: (
    { title: string } | { name: string; content: string } | { property: string; content: string }
  )[] = [
    { title: data.title },
    { name: "description", content: data.text },
    { property: "og:title", content: data.title },
    { property: "og:description", content: data.text },
    { property: "og:url", content: data.url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "KamotGibo" },
    { property: "og:image", content: image },
    {
      property: "og:image:alt",
      content: customImage ? workshop.title : "KamotGibo · Hands-on craft workshops in Sorsogon",
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: data.title },
    { name: "twitter:description", content: data.text },
    { name: "twitter:image", content: image },
  ];
  if (!customImage)
    meta.push(
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/png" },
    );
  return { meta, links: [{ rel: "canonical", href: data.url }] };
}
