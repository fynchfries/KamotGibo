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
  venue: string;
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
    venue: "Community craft hub, Gubat",
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
    venue: "Weavers' cooperative studio, Sorsogon City",
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
    venue: "Basket makers' workshop, Bulan",
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
    venue: "Community learning center, Irosin",
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
