import { z } from "zod";

const text = z
  .string()
  .trim()
  .min(1, "This field is required.")
  .max(200, "Use 200 characters or fewer.");
export const craftSchema = z.enum(["Shellcraft", "Abaca weaving", "Basketry", "Pottery"]);
export const townSchema = z.enum(["Gubat", "Sorsogon City", "Bulan", "Irosin"]);
const lines = z
  .string()
  .trim()
  .min(1, "Add at least one item.")
  .max(2000, "Use 2,000 characters or fewer.");
const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid time.");

export const applicationSchema = z.object({
  name: text,
  kind: z.enum(["Artisan", "Cooperative", "Learning center"]),
  craft: craftSchema,
  town: townSchema,
  venue: text,
  workshop: text,
});
export type ApplicationInput = z.infer<typeof applicationSchema>;

export const workshopSchema = z
  .object({
    title: text,
    craft: craftSchema,
    town: townSchema,
    level: z.enum(["Beginner", "Intermediate"]),
    venue: text,
    venueNote: z.string().trim().max(500),
    date: z.string().date("Enter a valid session date."),
    startTime: time,
    endTime: time,
    capacity: z
      .number()
      .int("Use a whole number.")
      .min(1, "At least one seat is required.")
      .max(50, "Use 50 seats or fewer."),
    fee: z
      .number()
      .finite()
      .min(0, "The fee cannot be negative.")
      .max(100000, "Use PHP 100,000 or less."),
    learn: lines,
    providedMaterials: z.string().trim().max(2000),
    bringMaterials: z.string().trim().max(2000),
  })
  .refine((w) => w.endTime > w.startTime, {
    path: ["endTime"],
    message: "End time must be after start time.",
  });
export type WorkshopInput = z.infer<typeof workshopSchema>;
