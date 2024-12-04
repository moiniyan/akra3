"use server"

import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"

import { db } from "@/config/db"
import {
  psGetBusinessHours,
  psGetDatesUnavailable,
} from "@/db/prepared-statements/clinic"
import {
  businessHours,
  type BusinessHours,
  type DateUnavailable,
} from "@/db/schema"
import {
  businessHoursSchema,
  updateBusinessHoursSchema,
  type AddBusinessHoursInput,
  type UpdateBusinessHoursInput,
} from "@/validations/availability"

import { generateId } from "@/lib/utils"

export async function addBusinessHours(
  rawInput: AddBusinessHoursInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = businessHoursSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const newBusinessHours = await db
      .insert(businessHours)
      .values({
        id: generateId(),
        mondayStatus: validatedInput.data.mondayStatus,
        tuesdayStatus: validatedInput.data.tuesdayStatus,
        wednesdayStatus: validatedInput.data.wednesdayStatus,
        thursdayStatus: validatedInput.data.thursdayStatus,
        fridayStatus: validatedInput.data.fridayStatus,
        saturdayStatus: validatedInput.data.saturdayStatus,
        sundayStatus: validatedInput.data.sundayStatus,
        mondayOpening: validatedInput.data.mondayOpening,
        tuesdayOpening: validatedInput.data.tuesdayOpening,
        wednesdayOpening: validatedInput.data.wednesdayOpening,
        thursdayOpening: validatedInput.data.thursdayOpening,
        fridayOpening: validatedInput.data.fridayOpening,
        saturdayOpening: validatedInput.data.saturdayOpening,
        sundayOpening: validatedInput.data.sundayOpening,
        mondayClosing: validatedInput.data.mondayClosing,
        tuesdayClosing: validatedInput.data.tuesdayClosing,
        wednesdayClosing: validatedInput.data.wednesdayClosing,
        thursdayClosing: validatedInput.data.thursdayClosing,
        fridayClosing: validatedInput.data.fridayClosing,
        saturdayClosing: validatedInput.data.saturdayClosing,
        sundayClosing: validatedInput.data.sundayClosing,
      })
      .returning()

    revalidatePath("/admin/clinic/hours")
    revalidatePath("/")

    return newBusinessHours ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error adding business hours")
  }
}

export async function getBusinessHours(): Promise<BusinessHours | null> {
  try {
    noStore()
    let [businessHours] = await psGetBusinessHours.execute()

    if (!businessHours) {
      const newBusinessHours = await addBusinessHours({
        mondayStatus: "open",
        tuesdayStatus: "open",
        wednesdayStatus: "open",
        thursdayStatus: "open",
        fridayStatus: "open",
        saturdayStatus: "open",
        sundayStatus: "closed",
        mondayOpening: "08:00",
        tuesdayOpening: "08:00",
        wednesdayOpening: "08:00",
        thursdayOpening: "08:00",
        fridayOpening: "08:00",
        saturdayOpening: "08:00",
        sundayOpening: "08:00",
        mondayClosing: "17:00",
        tuesdayClosing: "17:00",
        wednesdayClosing: "17:00",
        thursdayClosing: "17:00",
        fridayClosing: "17:00",
        saturdayClosing: "13:00",
        sundayClosing: "13:00",
      })

      if (newBusinessHours) {
        ;[businessHours] = await psGetBusinessHours.execute()
      }
    }

    return businessHours || null
  } catch (error) {
    console.error(error)
    // throw new Error("Error fetching business hours")
    // create dummy data
    return {
      id: "1",
      mondayStatus: "open",
      tuesdayStatus: "open",
      wednesdayStatus: "open",
      thursdayStatus: "open",
      fridayStatus: "open",
      saturdayStatus: "open",
      sundayStatus: "closed",
      mondayOpening: "08:00",
      tuesdayOpening: "08:00",
      wednesdayOpening: "08:00",
      thursdayOpening: "08:00",
      fridayOpening: "08:00",
      saturdayOpening: "08:00",
      sundayOpening: "08:00",
      mondayClosing: "17:00",
      tuesdayClosing: "17:00",
      wednesdayClosing: "17:00",
      thursdayClosing: "17:00",
      fridayClosing: "17:00",
      saturdayClosing: "13:00",
      sundayClosing: "13:00",
    }
  }
}

export async function updateBusinessHours(
  rawInput: UpdateBusinessHoursInput
): Promise<"invalid-input" | "error" | "success"> {
  try {
    const validatedInput = updateBusinessHoursSchema.safeParse(rawInput)
    if (!validatedInput.success) return "invalid-input"

    const businessHoursUpdated = await db
      .update(businessHours)
      .set({
        mondayStatus: validatedInput.data.mondayStatus,
        tuesdayStatus: validatedInput.data.tuesdayStatus,
        wednesdayStatus: validatedInput.data.wednesdayStatus,
        thursdayStatus: validatedInput.data.thursdayStatus,
        fridayStatus: validatedInput.data.fridayStatus,
        saturdayStatus: validatedInput.data.saturdayStatus,
        sundayStatus: validatedInput.data.sundayStatus,
        mondayOpening: validatedInput.data.mondayOpening,
        tuesdayOpening: validatedInput.data.tuesdayOpening,
        wednesdayOpening: validatedInput.data.wednesdayOpening,
        thursdayOpening: validatedInput.data.thursdayOpening,
        fridayOpening: validatedInput.data.fridayOpening,
        saturdayOpening: validatedInput.data.saturdayOpening,
        sundayOpening: validatedInput.data.sundayOpening,
        mondayClosing: validatedInput.data.mondayClosing,
        tuesdayClosing: validatedInput.data.tuesdayClosing,
        wednesdayClosing: validatedInput.data.wednesdayClosing,
        thursdayClosing: validatedInput.data.thursdayClosing,
        fridayClosing: validatedInput.data.fridayClosing,
        saturdayClosing: validatedInput.data.saturdayClosing,
        sundayClosing: validatedInput.data.sundayClosing,
      })
      .where(eq(businessHours.id, validatedInput.data.id))
      .returning()

    revalidatePath("/admin/clinic/hours")

    return businessHoursUpdated ? "success" : "error"
  } catch (error) {
    console.error(error)
    throw new Error("Error updating business hours")
  }
}

export async function getDatesUnavailable(): Promise<DateUnavailable[] | null> {
  try {
    noStore()
    const datesUnavailable = await psGetDatesUnavailable.execute()
    return datesUnavailable ?? null
  } catch (error) {
    console.error()
    throw new Error("Error loading unavailable dates")
  }
}

export async function getDatesUnavailableAsAnArrayOfDates(): Promise<Date[]> {
  try {
    const datesUnavailableObjects = await psGetDatesUnavailable.execute()

    console.log("datesUnavailableObjects", datesUnavailableObjects)
    if (!datesUnavailableObjects) return []

    const datesUnavailable = datesUnavailableObjects.map(
      (dateUnavailable) => new Date(dateUnavailable.date)
    )

    return datesUnavailable ?? []
  } catch (error) {
    console.error()
    // throw new Error("Error loading unavailable dates")
    // throw new Error("Error loading unavailable dates")
    // create dummy data
    return [
      new Date("2021-10-01"),
      new Date("2021-10-02"),
      new Date("2021-10-03"),
      new Date("2021-10-04"),
      new Date("2021-10-05"),
      new Date("2021-10-06"),
      new Date("2021-10-07"),
      new Date("2021-10-08"),
      new Date("2021-10-09"),
      new Date("2021-10-10"),
    ]
  }
}

// TODO
export async function addDateUnavailable() { }

// TODO
export async function updateDateUnavailable() { }

// TODO
export async function deleteDateUnavailable() { }