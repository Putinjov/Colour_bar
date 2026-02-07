import { z } from "zod";

export const bookingCreateSchema = z.object({
  serviceId: z.string().min(1),
  startAt: z.string().datetime(),
  clientName: z.string().min(2).max(60),
  phone: z.string().min(6).max(30),
  notes: z.string().max(300).optional(),
});

export const adminBlockSchema = z.object({
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
  notes: z.string().max(200).optional(),
});
