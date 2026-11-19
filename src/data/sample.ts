// Workshop and people data is fictional. Qualification references cite official sources.

export type Town = "Gubat" | "Sorsogon City" | "Bulan" | "Irosin";
export type Craft = "Shellcraft" | "Abaca weaving" | "Basketry" | "Pottery";
export type Level = "Beginner" | "Intermediate";
export type MaterialStatus = "Provided" | "Can borrow" | "Buy separately" | "Bring your own";

export interface Workshop {
  id: string;
  providerId: string;
  title: string;
  craft: Craft;
  town: Town;
  level: Level;
  fee: number; // 0 = free
  feeNote: string;
  instructor: string;
  instructorNote: string;
  imageUrl?: string;
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
export const LEVELS: Level[] = ["Beginner", "Intermediate"];

export const DISCOVER_COPY = {
  title: "Learn a local craft.",
  description: "In-person workshops with Sorsogon artisans.",
  steps: ["Find a workshop", "Reserve a seat", "Learn in person"],
} as const;

export const HOME_COPY = {
  eyebrow: "Sorsogon crafts, shared together",
  title: "For the hands that teach. For the hands that learn.",
  description:
    "KamotGibo brings artisans and learners together through hands-on workshops. Share a local craft, discover a new skill, and keep Sorsogon's traditions alive.",
  storyEyebrow: "A story in every stitch",
  storyTitle: "Craft traditions live when they are shared.",
  storyDescription:
    "Every workshop connects a maker's experience with a learner's curiosity. Passing skills from hand to hand keeps Sorsogon's crafts part of everyday life.",
  craftsHeading: "Crafts we keep alive together",
  stepsHeading: "How KamotGibo works",
  rolePrompt: "Choose your path",
  learner: {
    title: "For learners",
    description:
      "Discover hands-on workshops, learn from local makers, and grow your craft skills.",
    cta: "I'm a learner",
  },
  artisan: {
    title: "For artisans",
    description:
      "Share your skills, welcome curious learners, and pass your craft on to your community.",
    cta: "I'm an artisan",
  },
  steps: [
    {
      title: "Artisans share their craft",
      description: "Local makers plan a workshop and open their doors to learners.",
    },
    {
      title: "Learners find a workshop",
      description: "Curious hands choose a craft, reserve a seat, and get ready to make.",
    },
    {
      title: "Learn and create together",
      description: "Meet in person, share skills, and keep a living tradition growing.",
    },
  ],
} as const;

export const LEARNER_DASHBOARD_COPY = {
  title: "Learner dashboard",
  description: "Your next workshop, your growing skills, and the crafts you are discovering.",
  sidebarHeading: "Your learning space",
  sidebarTitle: "Learn by making",
  sidebarDescription: "Find your next craft and learn from the hands that know it best.",
} as const;

export const CRAFTS: { name: Craft; local: string; blurb: string }[] = [
  { name: "Shellcraft", local: "kaligay & buskay", blurb: "Shell jewelry and ornaments" },
  { name: "Abaca weaving", local: "abaca", blurb: "Coasters, mats and bags" },
  { name: "Basketry", local: "rattan", blurb: "Woven baskets and trays" },
  { name: "Pottery", local: "clay", blurb: "Hand-built clay pieces" },
];

export const WORKSHOPS: Workshop[] = [
  {
    id: "shell-jewelry-basics",
    providerId: "nanay-rosa",
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
    providerId: "kuya-ben",
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
    providerId: "tay-ramon",
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
    providerId: "ate-liza",
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

export const LEARNER_PROFILE = {
  fullName: "Mika Dela Cruz",
  municipality: "Gubat" as Town,
  bio: "Learning local crafts, one handmade piece at a time.",
  interests: ["Shellcraft", "Abaca weaving"] as Craft[],
  photo: null as string | null,
};

/** Booking reference shown on the confirmation for each bookable workshop. */
const BOOKING_REFS: Record<string, string> = {
  "shell-jewelry-basics": "BK-GUB-1121",
  "abaca-weaving-101": "BK-SOR-1122",
  "rattan-basketry": "BK-BUL-1120",
  "clay-pottery-starter": "BK-IRO-1121",
};

export function bookingRef(w: Pick<Workshop, "id">) {
  return BOOKING_REFS[w.id] ?? `BK-${w.id.slice(-8).toUpperCase()}`;
}

/** What to do before the session, built from the materials list and fee. */
export function prepNotes(w: Workshop): string[] {
  const notes = ["Arrive 15 minutes early so the session can start on time."];
  for (const m of w.materials) {
    if (m.status === "Bring your own") {
      notes.push(`Bring your own ${m.item.toLowerCase()}.`);
    }
    if (m.status === "Buy separately") {
      notes.push(`Buy ${m.item.toLowerCase()} before the session.`);
    }
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
    {
      label: "Attended your first workshop",
      hint: "Abaca Weaving 101",
      done: PAST_SESSIONS.length > 0,
    },
    {
      label: "Booked your next session",
      hint: "Reserve a seat at any workshop",
      done: p.booked.length > 0,
    },
    {
      label: "Passed your first skill check",
      hint: "Checked in person by your instructor",
      done: p.badgeIssued,
    },
    { label: "Learned 2 different crafts", hint: "Abaca weaving + one more", done: p.badgeIssued },
  ];
}

// ---------- Stage 4: instructor roster and admin review (sample) ----------

export const INSTRUCTOR = {
  name: "Nanay Rosa (sample)",
  providerId: "nanay-rosa",
  workshopId: "shell-jewelry-basics",
};

/** Six existing reservations; Mika joins this roster after booking in the demo. */
export const ROSTER = [
  { id: "joy", name: "Joy (sample)", ref: "BK-GUB-1101" },
  { id: "jun", name: "Jun (sample)", ref: "BK-GUB-1104" },
  { id: "ana", name: "Ana (sample)", ref: "BK-GUB-1107" },
  { id: "carlo", name: "Carlo (sample)", ref: "BK-GUB-1110" },
  { id: "bea", name: "Bea (sample)", ref: "BK-GUB-1113" },
  { id: "lito", name: "Lito (sample)", ref: "BK-GUB-1116" },
];

const SAMPLE_LEARNERS = [
  ...ROSTER,
  { id: "nico", name: "Nico (sample)" },
  { id: "ella", name: "Ella (sample)" },
  { id: "luis", name: "Luis (sample)" },
  { id: "mia", name: "Mia (sample)" },
];

export const SESSION_ROSTERS: Record<string, { id: string; name: string; ref: string }[]> =
  Object.fromEntries(
    WORKSHOPS.map((w) => [
      w.id,
      w.id === INSTRUCTOR.workshopId
        ? ROSTER
        : SAMPLE_LEARNERS.slice(0, w.capacity - w.seatsLeft).map((r, i) => ({
            id: r.id,
            name: r.name,
            ref: `${bookingRef(w)}-${i + 1}`,
          })),
    ]),
  );

export const APPLICATION_DEFAULTS = {
  name: "",
  kind: "Artisan" as const,
  craft: "Shellcraft" as Craft,
  town: "Gubat" as Town,
  venue: "",
  workshop: "",
};

export const WORKSHOP_FORM_DEFAULTS = {
  title: "",
  craft: "Shellcraft" as Craft,
  town: "Gubat" as Town,
  level: "Beginner" as Level,
  venue: "",
  venueNote: "",
  date: "",
  startTime: "09:00",
  endTime: "12:00",
  capacity: 10,
  fee: 0,
  learn: "",
  providedMaterials: "",
  bringMaterials: "",
};

export const ARTISAN_SECTIONS = {
  dashboard: {
    label: "Dashboard",
    title: "Artisan dashboard",
    description: "A place for your craft, your workshops, and the people learning from you.",
  },
  workshops: {
    label: "My workshops",
    title: "My workshops",
    description: "Plan hands-on sessions, save your drafts, and publish when you are ready.",
  },
  bookings: {
    label: "Bookings",
    title: "Bookings & attendance",
    description: "See who is joining, manage your sessions, and check skills in person.",
  },
  application: {
    label: "Application",
    title: "Your application",
    description: "Check your provider status or apply to share a new craft with your community.",
  },
} as const;

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

// ---------- Upskilling: qualification references and existing curriculum relationships ----------

export interface CurriculumActivity {
  id: string;
  workshopId: string;
  outcome: string;
}

export interface QualificationCompetency {
  id: string;
  code?: string;
  title: string;
  description: string;
  activityIds: string[];
}

export interface LearningReference {
  title: string;
  description: string;
  source: string;
  url: string;
}

export interface Qualification {
  id: string;
  title: string;
  organization: string;
  level: string;
  sector: string;
  description: string;
  about: string;
  referenceNote: string;
  competencies: QualificationCompetency[];
  references: LearningReference[];
}

export const UPSKILLING_COPY = {
  title: "Take your craft skills further",
  description:
    "Explore skill pathways, microcredentials, and recognized qualifications related to the crafts you are learning.",
  sectionTitle: "Microcredentials & Qualifications",
  sectionDescription:
    "Explore recognized skills pathways that can help you continue developing your craft skills.",
  certification:
    "KamotGibo helps learners discover and prepare for recognized skills pathways. Completion of KamotGibo workshops does not automatically grant TESDA NC II certification.",
};

export const CURRICULUM_ACTIVITIES: CurriculumActivity[] = [
  { id: "abaca-preparation", workshopId: "abaca-weaving-101", outcome: "Prepare abaca fiber" },
  { id: "abaca-weaving", workshopId: "abaca-weaving-101", outcome: "Plain weave on a small frame" },
  { id: "abaca-finishing", workshopId: "abaca-weaving-101", outcome: "Finish a coaster set" },
  { id: "rattan-preparation", workshopId: "rattan-basketry", outcome: "Soak and shape rattan" },
  { id: "rattan-base", workshopId: "rattan-basketry", outcome: "Build a sturdy base" },
  {
    id: "rattan-weaving-finishing",
    workshopId: "rattan-basketry",
    outcome: "Weave and finish the rim",
  },
];

const WEAVING_STANDARD =
  "https://www.tesda.gov.ph/Downloadables/CS/CS-Artisanal%20Weaving%20Level%20II.pdf";

export const QUALIFICATIONS: Qualification[] = [
  {
    id: "artisanal-weaving-level-ii",
    title: "Artisanal Weaving Level II",
    organization: "TESDA",
    level: "Level II",
    sector: "Creative Sector",
    description:
      "Develop the competencies needed to prepare, perform, and complete artisanal weaving activities.",
    about:
      "This qualification describes the preparation, practical weaving, product-quality checks, and finishing involved in artisanal weaving. The three core competencies below are part of a wider standard that also includes basic and common competencies. KamotGibo workshop outcomes are related learning experiences, not equivalent official assessment results.",
    referenceNote:
      "TESDA lists this as an Artisanal Weaving Level II competency standard. Its PDF cover uses ‘Level NC II’. Confirm current training, assessment, and certification requirements directly with TESDA.",
    competencies: [
      {
        id: "pre-weaving",
        code: "AB-CRE1804528265301",
        title: "Conduct Pre-Weaving Activities",
        description:
          "Explore job requirements and the preparation of raw materials, tools, and accessories before weaving.",
        activityIds: ["abaca-preparation", "rattan-preparation"],
      },
      {
        id: "artisanal-weaving",
        code: "AB-CRE1804528265302",
        title: "Perform Artisanal Weaving",
        description:
          "Practise weaving techniques, work to a design, and check the quality of the woven output.",
        activityIds: ["abaca-weaving", "rattan-base", "rattan-weaving-finishing"],
      },
      {
        id: "post-weaving",
        code: "AB-CRE1804528265303",
        title: "Conduct Post-Weaving Activities",
        description:
          "Build on finishing practice and explore product handling, packaging, storage, and a safe, clean work area.",
        activityIds: ["abaca-finishing", "rattan-weaving-finishing"],
      },
    ],
    references: [
      {
        title: "Official qualification reference",
        description:
          "Read TESDA's full competency standard, including the basic, common, and core competencies.",
        source: "TESDA",
        url: WEAVING_STANDARD,
      },
      {
        title: "Weaving terminology",
        description: "Explore the glossary of artisanal weaving terms in the official standard.",
        source: "TESDA",
        url: `${WEAVING_STANDARD}#page=86`,
      },
      {
        title: "Materials and preparation guide",
        description:
          "Review the pre-weaving unit's material, tool, and job-preparation requirements.",
        source: "TESDA",
        url: `${WEAVING_STANDARD}#page=72`,
      },
      {
        title: "Safety reference",
        description:
          "Review the occupational safety and health competency in the official standard.",
        source: "TESDA",
        url: `${WEAVING_STANDARD}#page=29`,
      },
    ],
  },
];
