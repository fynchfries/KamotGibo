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
