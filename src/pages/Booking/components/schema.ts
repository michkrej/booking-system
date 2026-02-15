import { z } from "zod";
import { BOOKABLE_ITEM_KEYS } from "@/utils/CONSTANTS";

export const BookingSchema = z
  .object({
    title: z.string().min(1, "Bokningen måste ha ett namn"),
    description: z.string().optional().default(""),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    rooms: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .min(1, "Bokningen måste ha minst en rum"),
    food: z.boolean(),
    alcohol: z.boolean(),
    link: z.string(),
    bookableItems: z
      .array(
        z.object({
          key: z.enum(BOOKABLE_ITEM_KEYS),
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
      )
      .optional()
      .default([]),
  })
  .superRefine((booking, ctx) => {
    if (booking.startDate > booking.endDate) {
      ctx.addIssue({
        path: ["endDate"],
        code: z.ZodIssueCode.custom,
        message: "Sludatumet är före startdatumet",
      });
    }
  });
