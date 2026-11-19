import { useSyncExternalStore } from "react";
import { z } from "zod";
import {
  INSTRUCTOR,
  LEARNER,
  PROVIDERS,
  SESSION_ROSTERS,
  WORKSHOPS,
  bookingRef,
  canIssueBadge,
  type LearnerProgress,
  type Provider,
  type RosterMark,
  type Workshop,
} from "@/data/sample";
import {
  applicationSchema,
  craftSchema,
  townSchema,
  workshopSchema,
  type ApplicationInput,
  type WorkshopInput,
} from "./artisan-forms";

// All submissions and progress stay in this browser; this is not a reservation service.
const KEY = "kamotgibo-demo-v1";
export interface DemoWorkshop extends Workshop {
  published: boolean;
}
export interface DemoState extends LearnerProgress {
  approvedProviders: string[];
  activeProviderId: string;
  applications: Provider[];
  workshops: DemoWorkshop[];
  marks: Record<string, Record<string, RosterMark>>;
}

export const DEFAULT_PROGRESS: DemoState = {
  booked: [],
  badgeIssued: false,
  approvedProviders: [],
  activeProviderId: INSTRUCTOR.providerId,
  applications: [],
  workshops: [],
  marks: {},
};
const EMPTY_MARK: RosterMark = { present: false, skill: null, issued: false };
const ISSUED_MARK: RosterMark = { present: true, skill: "pass", issued: true };
const markSchema = z
  .object({
    present: z.boolean(),
    skill: z.enum(["pass", "not-yet"]).nullable(),
    issued: z.boolean(),
  })
  .refine((m) => (!m.skill || m.present) && (!m.issued || (m.present && m.skill === "pass")));
const storedWorkshopSchema = z
  .object({
    id: z.string(),
    providerId: z.string(),
    published: z.boolean(),
    title: z.string(),
    craft: craftSchema,
    town: townSchema,
    level: z.enum(["Beginner", "Intermediate"]),
    fee: z.number().finite().nonnegative(),
    feeNote: z.string(),
    instructor: z.string(),
    instructorNote: z.string(),
    venue: z.string(),
    venueNote: z.string(),
    day: z.string(),
    time: z.string(),
    nextDate: z.string(),
    capacity: z.number().int().min(1).max(50),
    seatsLeft: z.number().int().nonnegative(),
    learn: z.array(z.string()),
    materials: z.array(
      z.object({
        item: z.string(),
        status: z.enum(["Provided", "Can borrow", "Buy separately", "Bring your own"]),
      }),
    ),
  })
  .refine((w) => w.seatsLeft <= w.capacity);
const storageSchema = z.object({
  booked: z.array(z.string()).catch([]),
  badgeIssued: z.boolean().catch(false),
  approvedProviders: z.array(z.string()).catch([]),
  activeProviderId: z.string().catch(INSTRUCTOR.providerId),
  applications: z
    .array(
      applicationSchema.extend({
        id: z.string(),
        submitted: z.string(),
        status: z.enum(["Pending", "Approved", "Changes requested"]),
      }),
    )
    .catch([]),
  workshops: z.array(storedWorkshopSchema).catch([]),
  marks: z.record(z.record(markSchema)).catch({}),
});

let state: DemoState = DEFAULT_PROGRESS;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    state = storageSchema.parse(raw ? JSON.parse(raw) : {});
    // Older demos could issue Mika's badge without first recording the booking.
    if (state.badgeIssued && !state.booked.includes(INSTRUCTOR.workshopId)) {
      state = { ...state, booked: [...state.booked, INSTRUCTOR.workshopId] };
    }
  } catch {
    state = DEFAULT_PROGRESS;
  }
}

function set(next: DemoState) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* Storage unavailable: keep this session usable in memory. */
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
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

export function getProviders(progress: DemoState): Provider[] {
  return [...PROVIDERS, ...progress.applications].map((p) => ({
    ...p,
    status: progress.approvedProviders.includes(p.id) ? "Approved" : p.status,
  }));
}
function allWorkshops(progress: DemoState): DemoWorkshop[] {
  return [...WORKSHOPS.map((w) => ({ ...w, published: true })), ...progress.workshops].map((w) => ({
    ...w,
    seatsLeft: Math.max(0, w.seatsLeft - (progress.booked.includes(w.id) ? 1 : 0)),
  }));
}
export function getWorkshops(progress: DemoState): Workshop[] {
  const approved = getProviders(progress)
    .filter((p) => p.status === "Approved")
    .map((p) => p.id);
  return allWorkshops(progress).filter(
    (w) =>
      w.published &&
      (WORKSHOPS.some((seed) => seed.id === w.id) || approved.includes(w.providerId)),
  );
}
export function getProviderWorkshops(progress: DemoState, providerId: string): DemoWorkshop[] {
  return allWorkshops(progress).filter((w) => w.providerId === providerId);
}
export function getRoster(progress: DemoState, workshopId: string) {
  const w = getWorkshops(progress).find((item) => item.id === workshopId);
  if (!w) return [];
  const seeded = SESSION_ROSTERS[workshopId] ?? [];
  return progress.booked.includes(workshopId)
    ? [...seeded, { id: "mika", name: LEARNER.name, ref: bookingRef(w) }]
    : seeded;
}
export function getRosterMark(
  progress: DemoState,
  workshopId: string,
  learnerId: string,
): RosterMark {
  if (workshopId === INSTRUCTOR.workshopId && learnerId === "mika" && progress.badgeIssued)
    return ISSUED_MARK;
  return progress.marks[workshopId]?.[learnerId] ?? EMPTY_MARK;
}
function saveMark(
  workshopId: string,
  learnerId: string,
  mark: RosterMark,
  badgeIssued = state.badgeIssued,
) {
  set({
    ...state,
    badgeIssued,
    marks: {
      ...state.marks,
      [workshopId]: { ...state.marks[workshopId], [learnerId]: mark },
    },
  });
}
const splitLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

export const demoActions = {
  selectProvider(id: string) {
    load();
    if (getProviders(state).some((p) => p.id === id)) set({ ...state, activeProviderId: id });
  },
  submitApplication(input: ApplicationInput): string {
    load();
    const details = applicationSchema.parse(input);
    const id = `provider-${crypto.randomUUID()}`;
    const provider: Provider = {
      ...details,
      id,
      status: "Pending",
      submitted: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    set({ ...state, applications: [...state.applications, provider], activeProviderId: id });
    return id;
  },
  createWorkshop(providerId: string, input: WorkshopInput): string {
    load();
    const details = workshopSchema.parse(input);
    const provider = getProviders(state).find((p) => p.id === providerId);
    if (!provider) throw new Error("Choose a demo artisan before creating a workshop.");
    const id = `workshop-${crypto.randomUUID()}`;
    const date = new Date(`${details.date}T12:00:00`);
    const formatTime = (value: string) =>
      new Date(`${details.date}T${value}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    const draft: DemoWorkshop = {
      id,
      providerId,
      published: false,
      title: details.title,
      craft: details.craft,
      town: details.town,
      level: details.level,
      venue: details.venue,
      venueNote: details.venueNote,
      instructor: provider.name,
      instructorNote: `${provider.kind} teaching ${details.craft.toLowerCase()} in ${details.town}.`,
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      nextDate: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: `${formatTime(details.startTime)} – ${formatTime(details.endTime)}`,
      capacity: details.capacity,
      seatsLeft: details.capacity,
      fee: details.fee,
      feeNote: details.fee === 0 ? "Free workshop" : "Pay at the venue",
      learn: splitLines(details.learn),
      materials: [
        ...splitLines(details.providedMaterials).map((item) => ({
          item,
          status: "Provided" as const,
        })),
        ...splitLines(details.bringMaterials).map((item) => ({
          item,
          status: "Bring your own" as const,
        })),
      ],
    };
    set({ ...state, workshops: [...state.workshops, draft] });
    return id;
  },
  publishWorkshop(id: string): boolean {
    load();
    const draft = state.workshops.find((w) => w.id === id);
    if (
      !draft ||
      !getProviders(state).some((p) => p.id === draft.providerId && p.status === "Approved")
    )
      return false;
    set({
      ...state,
      workshops: state.workshops.map((w) => (w.id === id ? { ...w, published: true } : w)),
    });
    return true;
  },
  book(id: string): boolean {
    load();
    const workshop = getWorkshops(state).find((w) => w.id === id);
    if (!workshop) return false;
    if (state.booked.includes(id)) return true;
    if (workshop.seatsLeft === 0) return false;
    set({ ...state, booked: [...state.booked, id] });
    return true;
  },
  markLearner(
    workshopId: string,
    learnerId: string,
    patch: Partial<Pick<RosterMark, "present" | "skill">>,
  ) {
    load();
    if (!getRoster(state, workshopId).some((r) => r.id === learnerId)) return;
    const current = getRosterMark(state, workshopId, learnerId);
    if (current.issued) return;
    const values = z
      .object({
        present: z.boolean().optional(),
        skill: z.enum(["pass", "not-yet"]).nullable().optional(),
      })
      .parse(patch);
    const mark: RosterMark = {
      ...current,
      present: values.present ?? current.present,
      skill: values.skill === undefined ? current.skill : values.skill,
    };
    if (!mark.present) mark.skill = null;
    saveMark(workshopId, learnerId, mark);
  },
  issueBadge(workshopId = INSTRUCTOR.workshopId, learnerId = "mika"): boolean {
    load();
    if (
      workshopId !== INSTRUCTOR.workshopId ||
      !getRoster(state, workshopId).some((r) => r.id === learnerId)
    )
      return false;
    const mark = getRosterMark(state, workshopId, learnerId);
    if (!canIssueBadge(mark)) return false;
    saveMark(
      workshopId,
      learnerId,
      { ...mark, issued: true },
      state.badgeIssued || learnerId === "mika",
    );
    return true;
  },
  approveProvider(id: string) {
    load();
    if (state.approvedProviders.includes(id) || !getProviders(state).some((p) => p.id === id))
      return;
    set({ ...state, approvedProviders: [...state.approvedProviders, id] });
  },
  reset() {
    loaded = true;
    set(DEFAULT_PROGRESS);
  },
};
