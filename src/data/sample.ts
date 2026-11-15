// All data here is fictional sample data for the look-only prototype.

export type Town = "Gubat" | "Sorsogon City" | "Bulan" | "Irosin";
export type Craft = "Shellcraft" | "Abaca weaving" | "Basketry" | "Pottery";
export type Level = "Beginner" | "Intermediate";
export type MaterialStatus = "Provided" | "Can borrow" | "Buy separately" | "Bring your own";

export interface Workshop {
  id: string;
  title: string;
  craft: Craft;
  town: Town;
  level: Level;
  fee: number; // 0 = free
  feeNote: string;
  instructor: string;
  instructorNote: string;
  venue: string;
  venueNote: string;
  day: string;
  time: string;
  nextDate: string;
  capacity: number;
  seatsLeft: number;
  learn: string[];
  materials: { item: string; status: MaterialStatus }[];
}

export const TOWNS: Town[] = ["Gubat", "Sorsogon City", "Bulan", "Irosin"];

export const CRAFTS: { name: Craft; local: string; blurb: string }[] = [
  { name: "Shellcraft", local: "kaligay & buskay", blurb: "Shell jewelry and ornaments" },
  { name: "Abaca weaving", local: "abaca", blurb: "Coasters, mats and bags" },
  { name: "Basketry", local: "rattan", blurb: "Woven baskets and trays" },
  { name: "Pottery", local: "clay", blurb: "Hand-built clay pieces" },
];

export const WORKSHOPS: Workshop[] = [
  {
    id: "shell-jewelry-basics",
    title: "Shell Jewelry Basics: Make Your First Buskay Bracelet",
    craft: "Shellcraft",
    town: "Gubat",
    level: "Beginner",
    fee: 300,
    feeNote: "Covers materials",
    instructor: "Nanay Rosa (sample)",
    instructorNote: "Shell crafter from Gubat. Makes kaligay and buskay jewelry.",
    venue: "Community craft hub, Gubat",
    venueNote: "Near the town plaza. Look for the blue gate.",
    day: "Sat",
    time: "9:00 AM – 12:00 PM",
    nextDate: "Sat, Nov 21",
    capacity: 10,
    seatsLeft: 4,
    learn: [
      "Sort and pick shells for a bracelet",
      "Basic stringing and knotting",
      "Finish and close a bracelet you can wear home",
    ],
    materials: [
      { item: "Shells", status: "Provided" },
      { item: "Thread", status: "Provided" },
      { item: "Pliers", status: "Can borrow" },
      { item: "Apron", status: "Bring your own" },
    ],
  },
  {
    id: "abaca-weaving-101",
    title: "Abaca Weaving 101: Coasters and Mats",
    craft: "Abaca weaving",
    town: "Sorsogon City",
    level: "Beginner",
    fee: 0,
    feeNote: "Free (sponsored)",
    instructor: "Kuya Ben (sample)",
    instructorNote: "Abaca weaver and cooperative member.",
    venue: "Weavers' cooperative studio, Sorsogon City",
    venueNote: "Ground floor studio, enter from the side door.",
    day: "Sun",
    time: "1:00 PM – 4:00 PM",
    nextDate: "Sun, Nov 22",
    capacity: 12,
    seatsLeft: 7,
    learn: ["Prepare abaca fiber", "Plain weave on a small frame", "Finish a coaster set"],
    materials: [
      { item: "Abaca fiber", status: "Provided" },
      { item: "Weaving frame", status: "Can borrow" },
      { item: "Small scissors", status: "Bring your own" },
    ],
  },
  {
    id: "rattan-basketry",
    title: "Basketry Techniques: Rattan Basket",
    craft: "Basketry",
    town: "Bulan",
    level: "Intermediate",
    fee: 500,
    feeNote: "Pay at the venue",
    instructor: "Tay Ramon (sample)",
    instructorNote: "Basket maker working with rattan.",
    venue: "Basket makers' workshop, Bulan",
    venueNote: "Open-air work shed behind the main house.",
    day: "Fri",
    time: "2:00 PM – 5:00 PM",
    nextDate: "Fri, Nov 20",
    capacity: 8,
    seatsLeft: 2,
    learn: ["Soak and shape rattan", "Build a sturdy base", "Weave and finish the rim"],
    materials: [
      { item: "Rattan strips", status: "Provided" },
      { item: "Awl and cutter", status: "Can borrow" },
      { item: "Work gloves", status: "Buy separately" },
    ],
  },
  {
    id: "clay-pottery-starter",
    title: "Clay Pottery Starter Session",
    craft: "Pottery",
    town: "Irosin",
    level: "Beginner",
    fee: 350,
    feeNote: "Pay at the venue",
    instructor: "Ate Liza (sample)",
    instructorNote: "Potter running a community clay corner.",
    venue: "Community learning center, Irosin",
    venueNote: "Room 2 of the learning center, ask at the front desk.",
    day: "Sat",
    time: "8:00 AM – 11:00 AM",
    nextDate: "Sat, Nov 21",
    capacity: 10,
    seatsLeft: 0,
    learn: ["Wedge and prepare clay", "Pinch and coil methods", "Shape a small bowl"],
    materials: [
      { item: "Clay", status: "Provided" },
      { item: "Shaping tools", status: "Can borrow" },
      { item: "Old shirt or apron", status: "Bring your own" },
    ],
  },
];

export function formatFee(fee: number) {
  return fee === 0 ? "Free" : `PHP ${fee.toLocaleString("en-PH")}`;
}

export function seatsLabel(w: Pick<Workshop, "seatsLeft" | "capacity">) {
  if (w.seatsLeft === 0) return "Full";
  return `${w.seatsLeft} of ${w.capacity} seats left`;
}

export type ScheduleFilter = "weekend" | "weekday";
export type CostFilter = "free" | "paid";

export interface WorkshopFilters {
  q?: string | undefined;
  town?: Town | undefined;
  craft?: Craft | undefined;
  level?: Level | undefined;
  when?: ScheduleFilter | undefined;
  cost?: CostFilter | undefined;
}

const WEEKEND = ["Sat", "Sun"];

export function filterWorkshops(list: Workshop[], f: WorkshopFilters): Workshop[] {
  const q = f.q?.trim().toLowerCase();
  return list.filter((w) => {
    if (f.town && w.town !== f.town) return false;
    if (f.craft && w.craft !== f.craft) return false;
    if (f.level && w.level !== f.level) return false;
    if (f.when === "weekend" && !WEEKEND.includes(w.day)) return false;
    if (f.when === "weekday" && WEEKEND.includes(w.day)) return false;
    if (f.cost === "free" && w.fee !== 0) return false;
    if (f.cost === "paid" && w.fee === 0) return false;
    if (q) {
      const hay = `${w.title} ${w.craft} ${w.town} ${w.instructor}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export const MATERIAL_STATUSES: MaterialStatus[] = [
  "Provided",
  "Can borrow",
  "Buy separately",
  "Bring your own",
];

// ---------- Stage 3: learner, bookings and badges (sample) ----------

export const LEARNER = { name: "Mika", age: 19 };

/** Booking reference shown on the confirmation for each bookable workshop. */
const BOOKING_REFS: Record<string, string> = {
  "shell-jewelry-basics": "BK-GUB-1121",
  "abaca-weaving-101": "BK-SOR-1122",
  "rattan-basketry": "BK-BUL-1120",
  "clay-pottery-starter": "BK-IRO-1121",
};

export function bookingRef(w: Pick<Workshop, "id">) {
  return BOOKING_REFS[w.id] ?? `BK-${w.id.slice(0, 3).toUpperCase()}`;
}

/** What to do before the session, built from the materials list and fee. */
export function prepNotes(w: Workshop): string[] {
  const notes = ["Arrive 15 minutes early so the session can start on time."];
  for (const m of w.materials) {
    if (m.status === "Bring your own") notes.push(`Bring your own ${m.item.toLowerCase()}.`);
    if (m.status === "Buy separately") notes.push(`Buy ${m.item.toLowerCase()} before the session.`);
  }
  notes.push(
    w.fee === 0
      ? "No fee to pay. This session is sponsored."
      : `Bring ${formatFee(w.fee)} in cash. Pay at the venue.`,
  );
  return notes;
}

/** Mika's past session (before the demo). */
export const PAST_SESSIONS = [
  {
    workshopId: "abaca-weaving-101",
    date: "Sun, Nov 8",
    attended: true,
    skillCheck: "Not yet" as const,
    note: "Kuya Ben suggests one more practice session on finishing the edges.",
  },
];

export const BADGE = {
  code: "KG-4F7A-21",
  title: "Shellcraft: Basic Stringing",
  craft: "Shellcraft" as Craft,
  issuedBy: "Nanay Rosa (sample)",
  workshopId: "shell-jewelry-basics",
  issuedOn: "Sat, Nov 21",
  skills: [
    "Sorts and picks shells for a bracelet",
    "Ties secure stringing knots",
    "Finishes and closes a wearable bracelet",
  ],
};

export interface LearnerProgress {
  booked: string[];
  badgeIssued: boolean;
}

export function milestones(p: LearnerProgress) {
  return [
    { label: "Attended your first workshop", hint: "Abaca Weaving 101", done: PAST_SESSIONS.length > 0 },
    { label: "Booked your next session", hint: "Reserve a seat at any workshop", done: p.booked.length > 0 },
    { label: "Passed your first skill check", hint: "Checked in person by your instructor", done: p.badgeIssued },
    { label: "Learned 2 different crafts", hint: "Abaca weaving + one more", done: p.badgeIssued },
  ];
}

// ---------- Stage 4: instructor roster and admin review (sample) ----------

export const INSTRUCTOR = { name: "Nanay Rosa (sample)", workshopId: "shell-jewelry-basics" };

/** Learners booked into Nanay Rosa's Sat, Nov 21 session (6 of 10 seats). First names only. */
export const ROSTER = [
  { id: "mika", name: "Mika", ref: "BK-GUB-1121" },
  { id: "jun", name: "Jun (sample)", ref: "BK-GUB-1104" },
  { id: "ana", name: "Ana (sample)", ref: "BK-GUB-1107" },
  { id: "carlo", name: "Carlo (sample)", ref: "BK-GUB-1110" },
  { id: "bea", name: "Bea (sample)", ref: "BK-GUB-1113" },
  { id: "lito", name: "Lito (sample)", ref: "BK-GUB-1116" },
];

export type SkillResult = "pass" | "not-yet" | null;

export interface RosterMark {
  present: boolean;
  skill: SkillResult;
  issued: boolean;
}

/** A badge can only be issued to a learner who attended and passed the skill check. */
export function canIssueBadge(m: RosterMark) {
  return m.present && m.skill === "pass" && !m.issued;
}

export type ProviderStatus = "Pending" | "Approved" | "Changes requested";

export interface Provider {
  id: string;
  name: string;
  kind: "Artisan" | "Cooperative" | "Learning center";
  craft: Craft;
  town: Town;
  venue: string;
  workshop: string;
  submitted: string;
  status: ProviderStatus;
  adminNote?: string;
}

export const PROVIDERS: Provider[] = [
  {
    id: "bulan-shell-collective",
    name: "Bulan Shellcraft Collective (sample)",
    kind: "Cooperative",
    craft: "Shellcraft",
    town: "Bulan",
    venue: "Barangay multi-purpose hall, Bulan",
    workshop: "Buskay Keychains for Beginners",
    submitted: "Nov 12",
    status: "Pending",
  },
  {
    id: "nanay-rosa",
    name: "Nanay Rosa (sample)",
    kind: "Artisan",
    craft: "Shellcraft",
    town: "Gubat",
    venue: "Community craft hub, Gubat",
    workshop: "Shell Jewelry Basics: Make Your First Buskay Bracelet",
    submitted: "Oct 28",
    status: "Approved",
  },
  {
    id: "gubat-youth-center",
    name: "Gubat Youth Learning Center (sample)",
    kind: "Learning center",
    craft: "Abaca weaving",
    town: "Gubat",
    venue: "Youth center activity room, Gubat",
    workshop: "Abaca Bag Weaving",
    submitted: "Nov 9",
    status: "Changes requested",
    adminNote: "Please add the venue address and list which materials learners must bring.",
  },
];

/** Current status after the admin's approvals in this demo. */
export function providerStatus(p: Provider, approvedIds: string[]): ProviderStatus {
  return approvedIds.includes(p.id) ? "Approved" : p.status;
}
