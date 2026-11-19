import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { WORKSHOPS } from "@/data/sample";
import {
  getPublicWorkshop,
  getWorkshopMetadata,
  getWorkshopShareData,
  isPublicShareOrigin,
} from "./workshop-sharing";

const ORIGIN = "https://kamotgibo.lovable.app";
afterEach(() => {
  delete WORKSHOPS[0]!.imageUrl;
  localStorage.clear();
});

function metadata(id = "shell-jewelry-basics") {
  const head = getWorkshopMetadata(id, ORIGIN)!;
  return Object.fromEntries(
    head.meta.map((tag) => {
      if ("property" in tag) return [tag.property, tag.content];
      if ("name" in tag) return [tag.name, tag.content];
      return ["title", tag.title];
    }),
  );
}

describe("public workshop sharing", () => {
  it("builds a canonical payload from the public catalogue without query/hash/private state", () => {
    localStorage.setItem(
      "kamotgibo-demo-v1",
      JSON.stringify({
        workshops: [{ id: "shell-jewelry-basics", title: "Private title" }],
        email: "private@example.test",
      }),
    );
    expect(
      getWorkshopShareData("shell-jewelry-basics", `${ORIGIN}/learning?booking=private#profile`),
    ).toEqual({
      title: "Shell Jewelry Basics: Make Your First Buskay Bracelet · KamotGibo",
      text: "Learn shellcraft with Nanay Rosa (sample) in Gubat. Sat, Nov 21, 9:00 AM – 12:00 PM. PHP 300.",
      url: `${ORIGIN}/workshops/shell-jewelry-basics`,
    });
  });

  it.each(["workshop-local-only", "unknown", "__proto__"])(
    "does not create public links or metadata for %s",
    (id) => {
      expect(getPublicWorkshop(id)).toBeUndefined();
      expect(getWorkshopShareData(id, ORIGIN)).toBeUndefined();
      expect(getWorkshopMetadata(id, ORIGIN)).toBeUndefined();
    },
  );

  it.each(["", "javascript:alert(1)", "https://user:password@kamotgibo.lovable.app"])(
    "rejects an invalid origin: %s",
    (origin) => {
      expect(getWorkshopShareData("shell-jewelry-basics", origin)).toBeUndefined();
    },
  );

  it.each([
    "http://localhost:4184",
    "http://127.0.0.1:4184",
    "http://[::1]:4184",
    "http://192.168.1.3:4184",
    "http://10.0.0.2",
    "https://craft.local",
    "https://craft.localhost",
  ])("does not promote a development/private origin: %s", (origin) => {
    expect(isPublicShareOrigin(origin)).toBe(false);
  });

  it("allows a public site while still allowing truthful local-link copying", () => {
    expect(isPublicShareOrigin(ORIGIN)).toBe(true);
    expect(getWorkshopShareData("abaca-weaving-101", "http://localhost:4184")?.url).toBe(
      "http://localhost:4184/workshops/abaca-weaving-101",
    );
  });

  it("emits per-record social previews and an absolute canonical URL", () => {
    const tags = metadata();
    expect(tags["og:title"]).toBe(
      "Shell Jewelry Basics: Make Your First Buskay Bracelet · KamotGibo",
    );
    expect(tags["og:description"]).toContain("Nanay Rosa (sample) in Gubat");
    expect(tags["og:description"]).toContain("Sat, Nov 21");
    expect(tags["og:url"]).toBe(`${ORIGIN}/workshops/shell-jewelry-basics`);
    expect(tags["og:type"]).toBe("website");
    expect(tags["og:site_name"]).toBe("KamotGibo");
    expect(tags["og:image"]).toBe(`${ORIGIN}/social/kamotgibo-workshop.png`);
    expect(tags["twitter:card"]).toBe("summary_large_image");
    expect(tags["twitter:image"]).toBe(`${ORIGIN}/social/kamotgibo-workshop.png`);
    expect(getWorkshopMetadata("shell-jewelry-basics", ORIGIN)!.links).toEqual([
      { rel: "canonical", href: `${ORIGIN}/workshops/shell-jewelry-basics` },
    ]);
    expect(metadata("abaca-weaving-101")["og:description"]).toContain(
      "Kuya Ben (sample) in Sorsogon City",
    );
  });

  it("prefers an available public-record raster image URL", () => {
    WORKSHOPS[0]!.imageUrl = "https://cdn.example.org/crafts/shells.jpg";
    expect(metadata()["og:image"]).toBe("https://cdn.example.org/crafts/shells.jpg");
  });

  it.each([
    "data:image/png;base64,AA==",
    "blob:https://site/photo",
    "javascript:alert(1)",
    "https://cdn.example.org/photo.svg",
    "http://localhost/photo.png",
  ])("uses the branded fallback for an unsuitable image URL: %s", (imageUrl) => {
    WORKSHOPS[0]!.imageUrl = imageUrl;
    expect(metadata()["og:image"]).toBe(`${ORIGIN}/social/kamotgibo-workshop.png`);
  });

  it("ships a real 1200×630 PNG, not a missing/relative social image", () => {
    const png = readFileSync("public/social/kamotgibo-workshop.png");
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });
});
