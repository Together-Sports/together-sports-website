import { z } from "zod";

export const contactTopicOptions = [
  "General Inquiry",
  "Volunteer",
  "Partnerships",
  "Donations",
  "Media",
] as const;

export const contactFormSchema = z.object({
  firstName: z.string().trim().min(2, "First name is too short.").max(60, "First name is too long."),
  lastName: z.string().trim().min(2, "Last name is too short.").max(60, "Last name is too long."),
  email: z.string().trim().email("Enter a valid email address.").max(254, "Email is too long."),
  topic: z.enum(contactTopicOptions, {
    error: () => ({ message: "Choose a valid topic." }),
  }),
  message: z
    .string()
    .trim()
    .min(20, "Message must be at least 20 characters.")
    .max(2000, "Message must be under 2000 characters."),
  website: z.string().max(0).optional().default(""),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const CONTACT_MESSAGE_MAX_CHARS = 2000;
