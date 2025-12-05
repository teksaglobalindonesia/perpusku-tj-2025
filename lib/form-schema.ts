import * as z from 'zod';

export const selectSchema = ({
  requiredMsg = 'This is required',
  isRequired = false
}) =>
  z
    .object({
      value: z.union([z.number(), z.string()]).optional(),
      label: z.string().optional()
    })
    .nullable()
    .refine(
      (data) => {
        if (!isRequired) return true;
        return data && (data.value || data.label);
      },
      {
        message: requiredMsg
      }
    );

export const inputCurrencySchema = ({
  requiredMsg = 'This is required',
  isRequired = false
}) =>
  z
    .object({
      value: z.number().nonnegative().nullable().optional(),
      formatted: z.string().optional()
    })
    .nullable()
    .refine(
      (data) => {
        if (!isRequired) return true;
        return data && (data.value || data.formatted);
      },
      {
        message: requiredMsg
      }
    );

export const inputNumberSchema = ({
  requiredMsg = 'This is required',
  isRequired = false
}) =>
  z
    .object({
      value: z.number().nonnegative().nullable().optional(),
      formatted: z.string().nullable().optional(),
    })
    .nullable()
    .refine(
      (data) => {
        if (!isRequired) return true;
        return (
          data && (data.value !== undefined || data.formatted !== undefined)
        );
      },
      {
        message: requiredMsg
      }
    );

export const datePickerSchema = ({
  requiredMsg = 'This is required',
  isRequired = false
}) =>
  z
    .object({
      readable: z.string().optional(),
      system: z.string().optional()
    })
    .nullable()
    .refine(
      (data) => {
        if (!isRequired) return true;
        return data && (data.readable || data.system);
      },
      {
        message: requiredMsg
      }
    );
