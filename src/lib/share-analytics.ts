import { WORKSHOPS } from "@/data/sample";
import { getPublicWorkshop } from "./workshop-sharing";

const KEY = "kamotgibo-share-counts-v1";
const ACTIONS = ["share_opened", "facebook_selected", "native_share_used", "link_copied"] as const;
export type ShareAction = (typeof ACTIONS)[number];
type Counts = Record<ShareAction, number>;

export function getShareCounts(): Record<string, Counts> {
  try {
    const raw: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
    const counts: Record<string, Counts> = {};
    for (const workshop of WORKSHOPS) {
      const row: unknown = Object.getOwnPropertyDescriptor(raw, workshop.id)?.value;
      if (!row || typeof row !== "object" || Array.isArray(row)) continue;
      const clean = { share_opened: 0, facebook_selected: 0, native_share_used: 0, link_copied: 0 };
      for (const action of ACTIONS) {
        const value: unknown = Object.getOwnPropertyDescriptor(row, action)?.value;
        if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0)
          clean[action] = value;
      }
      counts[workshop.id] = clean;
    }
    return counts;
  } catch {
    return {};
  }
}

export function recordShareAction(id: string, action: ShareAction): void {
  if (!getPublicWorkshop(id) || !ACTIONS.includes(action) || typeof window === "undefined") return;
  try {
    const counts = getShareCounts();
    const row = counts[id] ?? {
      share_opened: 0,
      facebook_selected: 0,
      native_share_used: 0,
      link_copied: 0,
    };
    row[action] = Math.min(Number.MAX_SAFE_INTEGER, row[action] + 1);
    counts[id] = row;
    window.localStorage.setItem(KEY, JSON.stringify(counts));
  } catch {
    // Best-effort demo counts must never block the user's sharing action.
  }
}
