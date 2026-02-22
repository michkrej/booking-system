import { z } from "zod";
import type {
  NumericBookableKeys,
  TextBookableKeys,
} from "@/interfaces/interfaces";
import { BOOKABLE_ITEM_KEYS } from "@/utils/constants";

const NUMERIC_KEYS: NumericBookableKeys[] = [
  "bardiskar",
  "bankset-hg",
  "bankset-hoben",
  "bankset-k",
  "grillar",
];

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
        z
          .object({
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
            type: z.enum(["text", "numeric"]).optional(),
          })
          .transform((bookableItem) => {
            if (
              NUMERIC_KEYS.includes(bookableItem.key as NumericBookableKeys)
            ) {
              return {
                key: bookableItem.key as NumericBookableKeys,
                value: Number(bookableItem.value),
                startDate: bookableItem.startDate,
                endDate: bookableItem.endDate,
                type: "numeric" as const,
              };
            } else {
              return {
                key: bookableItem.key as TextBookableKeys,
                value: String(bookableItem.value),
                startDate: bookableItem.startDate,
                endDate: bookableItem.endDate,
                type: "text" as const,
              };
            }
          }),
      )
      .optional()
      .default([]),
  })
  .superRefine((booking, ctx) => {
    if (booking.startDate > booking.endDate) {
      ctx.addIssue({
        path: ["endDate"],
        code: "custom",
        values: [booking.endDate.toLocaleString()],
        message: "Sludatumet är före startdatumet",
      });
    }
  });

export type BookingSchemaInput = z.input<typeof BookingSchema>;
export type BookingSchemaOutput = z.infer<typeof BookingSchema>;
