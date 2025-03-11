import { z } from "zod";

export const BookingSchema = z.object({
  title: z.string().min(1, "Bokningen måste ha ett namn"),
  startDate: z.date(),
  endDate: z.date(),
  rooms: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .min(1, "Bokningen måste ha minst en rum"),
  food: z.boolean(),
  alcohol: z.boolean(),
  link: z.string(),
  bookableItems: z.array(
    z.object({
      key: z.string(),
      value: z
        .string()
        .min(1, {
          message: "Fältet är obligatoriskt",
        })
        .or(
          z.number().min(1, {
            message: "Fältet är obligatoriskt",
          }),
        ),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    }),
  ),
});
