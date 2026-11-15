import { useSyncExternalStore } from "react";
import type { LearnerProgress } from "@/data/sample";

// Click-through demo state kept in this browser only (no backend).
const KEY = "kamotgibo-demo-v1";
export const DEFAULT_PROGRESS: LearnerProgress = { booked: [], badgeIssued: false };

let state: LearnerProgress = DEFAULT_PROGRESS;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...DEFAULT_PROGRESS, ...(JSON.parse(raw) as Partial<LearnerProgress>) };
  } catch {
    state = DEFAULT_PROGRESS;
  }
}

function set(next: LearnerProgress) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // storage unavailable: keep in memory only
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useDemoProgress() {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return state;
    },
    () => DEFAULT_PROGRESS,
  );
}

export const demoActions = {
  book(id: string) {
    load();
    if (state.booked.includes(id)) return;
    set({ ...state, booked: [...state.booked, id] });
  },
  issueBadge() {
    load();
    set({ ...state, badgeIssued: true });
  },
  reset() {
    set(DEFAULT_PROGRESS);
  },
};
