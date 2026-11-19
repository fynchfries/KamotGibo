import { useSyncExternalStore } from "react";
import { z } from "zod";
import { LEARNER_PROFILE } from "@/data/sample";
import { craftSchema, townSchema } from "./artisan-forms";

export const learnerProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Enter your full name.")
    .max(80, "Use 80 characters or fewer."),
  municipality: townSchema,
  bio: z.string().trim().max(300, "Use 300 characters or fewer."),
  interests: z.array(craftSchema).max(4),
  photo: z
    .string()
    .max(1_400_000)
    .regex(/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/)
    .nullable(),
});
export type LearnerProfile = z.infer<typeof learnerProfileSchema>;

const KEY = "kamotgibo-learner-profile-v1";
let profile: LearnerProfile = LEARNER_PROFILE;
let loaded = false;
const listeners = new Set<() => void>();

function snapshot() {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    try {
      const raw = window.localStorage.getItem(KEY);
      profile = raw ? learnerProfileSchema.parse(JSON.parse(raw)) : LEARNER_PROFILE;
    } catch {
      profile = LEARNER_PROFILE;
    }
  }
  return profile;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLearnerProfile(): LearnerProfile {
  return useSyncExternalStore(subscribe, snapshot, () => LEARNER_PROFILE);
}

export function saveLearnerProfile(input: LearnerProfile): void {
  const next = learnerProfileSchema.parse(input);
  // Publish only after storage succeeds so a failed save never claims persistence.
  window.localStorage.setItem(KEY, JSON.stringify(next));
  profile = next;
  loaded = true;
  listeners.forEach((listener) => listener());
}
