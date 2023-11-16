import * as z from "zod";

enum MinMaxEnum {
  MIN,
  MAX,
}

function genMinMaxMessage(minMax: MinMaxEnum, fieldName?: string) {
  return `${fieldName ? fieldName + " is t" : "T"}oo ${
    minMax === MinMaxEnum.MIN ? "short" : "long"
  }`;
}

const genStr2Validator = (
  minMax?: [min: number, max?: number],
  fieldName?: string
) => {
  const min = minMax?.[0] || 2;
  const max = minMax?.[1];
  const validator = z
    .string()
    .min(min, { message: genMinMaxMessage(MinMaxEnum.MIN, fieldName) });
  if (max) {
    validator.max(max, {
      message: genMinMaxMessage(MinMaxEnum.MAX, fieldName),
    });
  }
  return validator;
};

export const signupValidation = z
  .object({
    name: genStr2Validator(),
    username: genStr2Validator(),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    passwordConfirmation: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

export const signinValidation = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createPostValidation = z.object({
  file: z.custom<File[]>(),
  caption: genStr2Validator([5, 2200]),
  location: genStr2Validator([2, 100]),
  tags: z.string(),
});
