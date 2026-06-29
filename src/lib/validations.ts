import { z } from "zod";

export const predictionSchema = z.object({
  matchId: z.string().min(1),
  homeScore: z.coerce.number().int().min(0).max(20),
  awayScore: z.coerce.number().int().min(0).max(20),
});

export const adminRoundSchema = z.object({
  starId: z.string().min(1),
  number: z.coerce.number().int().positive(),
  competition: z.string().min(3),
  startsAt: z.string().min(1),
  closesAt: z.string().min(1),
});

const contactMethodSchema = z.enum(["email", "sms"]);
const optionalContactSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() ? value.trim() : undefined),
  z.string().optional(),
);
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/, "Usa formato internacional, por ejemplo +5493511234567.");

const authFieldsSchema = z.object({
  contactMethod: contactMethodSchema,
  email: optionalContactSchema,
  phone: optionalContactSchema,
  password: z.string().min(6, "La contrasena necesita al menos 6 caracteres."),
});

function validateContactMethod(
  value: z.infer<typeof authFieldsSchema>,
  ctx: z.RefinementCtx,
) {
  if (value.contactMethod === "email") {
    const parsedEmail = z.string().email().safeParse(value.email);

    if (!parsedEmail.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Ingresa un email valido.",
      });
    }
  }

  if (value.contactMethod === "sms") {
    const parsedPhone = phoneSchema.safeParse(value.phone);

    if (!parsedPhone.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Usa formato internacional, por ejemplo +5493511234567.",
      });
    }
  }
}

export const loginSchema = authFieldsSchema.superRefine(validateContactMethod);

export const registerSchema = authFieldsSchema
  .extend({
    fullName: z.string().trim().min(2, "Ingresa tu nombre."),
    nickname: z.string().trim().min(2, "Ingresa tu apodo."),
  })
  .superRefine(validateContactMethod);

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Ingresa tu nombre."),
  nickname: z.string().trim().min(2, "Ingresa tu apodo."),
});

export type AdminRoundFormValues = z.infer<typeof adminRoundSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
