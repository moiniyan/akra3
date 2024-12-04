import { eq, sql } from "drizzle-orm"

import { db } from "@/config/db"
import { bookings } from "@/db/schema"

// Prepare query to get all doctor bookings (type: "vet")
export const psGetAllDoctorBookings = db
  .select()
  .from(bookings)
  .where(eq(bookings.type, "vet"))
  .prepare("psGetAllDoctorBookings")

// Prepare query to get all groomer bookings (type: "hair salon")
export const psGetAllGroomerBookings = db
  .select()
  .from(bookings)
  .where(eq(bookings.type, "hair salon"))
  .prepare("psGetAllGroomerBookings")

// Prepare query to get all bookings
export const psGetAllBookings = db
  .select()
  .from(bookings)
  .prepare("psGetAllBookings")

// Prepare query to delete a booking by ID
export const psDeleteBookingById = db
  .delete(bookings)
  .where(eq(bookings.id, sql.placeholder("id")))
  .prepare("psDeleteBookingById")

// Prepare query to check if a booking exists by ID
export const psCheckIfBookingExists = db.query.bookings
  .findFirst({
    columns: {
      id: true,
    },
    where: eq(bookings.id, sql.placeholder("id")),
  })
  .prepare("psCheckIfBookingExists")
