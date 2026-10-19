import { z } from "zod";
import { getPasswordFromLocalStorage } from "./passwordFunction";
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const getFormSchema = (showChangePassword) => {
  return z
    .object({
      profilePicture: z.object({
        image: z
          .any()
          .optional()
          .refine((file) => {
            if (file) {
              ACCEPTED_IMAGE_TYPES.includes(file?.type),
                {
                  message:
                    "Only .jpg, .jpeg, .png and .webp formats are supported.",
                };
            }
            return true;
          }),
        url: z.string().optional(),
      }),
      name: z
        .string()
        .min(1, {
          message: "Name is required",
        })
        .max(40),
      email: z.string().email(),
      oldPassword: z
        .string()
        .optional()
        .superRefine((val, ctx) => {
          if (showChangePassword && !val) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Old Password required when changing password",
            });
            return false;
          }
          if (showChangePassword && val.length < 6) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              maximum: 6,
              type: "string",
              inclusive: true,
              message: "Password must be at least 6 characters long.",
            });
            return false;
          }
        }),
      newPassword: z
        .string()
        .optional()
        .superRefine((val, ctx) => {
          if (showChangePassword && !val) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "New Password required when changing password",
            });
            return false;
          }
          if (showChangePassword && val.length < 6) {
            ctx.addIssue({
              code: z.ZodIssueCode.too_small,
              maximum: 6,
              type: "string",
              inclusive: true,
              message: "Password must be at least 6 characters long.",
            });
            return false;
          }
        }),
      confirmNewPassword: z
        .string()
        .optional()
        .superRefine((val, ctx) => {
          if (showChangePassword && !val) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Confirm New Password required when changing password",
            });
            return false;
          }
        }),
    })
    .refine(
      (data) => {
        if (
          showChangePassword &&
          data.newPassword !== data.confirmNewPassword
        ) {
          return false;
        }
        return true;
      },
      {
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
      }
    )
    .refine(
      (data) => {
        if (
          showChangePassword &&
          data.oldPassword !== getPasswordFromLocalStorage()
        ) {
          return false;
        }
        return true;
      },
      {
        message: "Old Password is incorrect",
        path: ["oldPassword"],
      }
    );
};
