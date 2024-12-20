import * as z from "zod"

export const hourSchema = z
  .string({
    required_error: "Podaj godzinę otwarcia",
    invalid_type_error: "Nieprawidłowy typ danych",
  })
  .length(5)
  .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
    message: "Nieprawidłowy format godziny. Poprawny format to HH:MM",
  })
  .nullable()

export const businessHoursIdSchema = z
  .string({
    required_error: "Id jest wymagane",
    invalid_type_error: "Dane wejściowe muszą być tekstem",
  })
  .min(1, {
    message: "Id musi mieć przynajmniej 1 znak",
  })
  .max(128, {
    message: "Id może mieć maksymalnie 32 znaki",
  })

export const singlePeriodSchema = z.object({
  opening: hourSchema,
  closing: hourSchema,
})

export const dayPeriodsSchema = z.array(singlePeriodSchema).default([])

export const businessHoursSchema = z.object({
  mondayPeriods: dayPeriodsSchema,
  tuesdayPeriods: dayPeriodsSchema,
  wednesdayPeriods: dayPeriodsSchema,
  thursdayPeriods: dayPeriodsSchema,
  fridayPeriods: dayPeriodsSchema,
  saturdayPeriods: dayPeriodsSchema,
  sundayPeriods: dayPeriodsSchema,
})

export const addBusinessHoursSchema = businessHoursSchema

export const updateBusinessHoursSchema = businessHoursSchema.extend({
  id: businessHoursIdSchema,
})

export type AddBusinessHoursInput = z.infer<typeof addBusinessHoursSchema>

export type UpdateBusinessHoursInput = z.infer<typeof updateBusinessHoursSchema>
