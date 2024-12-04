import { type AdapterAccount } from "@auth/core/adapters"
import { relations, sql } from "drizzle-orm"
import {
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

// Enum for user roles
export const userRoleEnum = pgEnum("user_role", ["client", "administrator"])

// Enum for operating status
export const operatingStatusEnum = pgEnum("operating_status", [
  "open",
  "closed",
])

// Enum for service types
export const serviceTypeEnum = pgEnum("service_type", [
  "veterinarian",
  "hair salon",
])

// Enum for booking status
export const bookingStatusEnum = pgEnum("booking_status", [
  "unconfirmed",
  "confirmed",
  "canceled",
  "rejected",
])

// Accounts table
export const accounts = pgTable(
  "accounts",
  {
    userId: varchar("userId", { length: 512 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 256 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 256 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 512 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 512 }),
    access_token: varchar("access_token", { length: 512 }),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 256 }),
    scope: varchar("scope", { length: 256 }),
    id_token: varchar("id_token", { length: 512 }),
    session_state: varchar("session_state", { length: 256 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

// Accounts relations
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

// Sessions table
export const sessions = pgTable("sessions", {
  sessionToken: varchar("sessionToken", { length: 512 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 512 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

// Sessions relations
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

// Users table
export const users = pgTable("users", {
  id: varchar("id", { length: 128 }).notNull().primaryKey(),
  role: userRoleEnum("role").notNull().default("client"),
  name: varchar("name", { length: 64 }),
  email: varchar("email", { length: 64 }).unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  emailVerificationToken: varchar("emailVerificationToken", {
    length: 512,
  }).unique(),
  passwordHash: varchar("passwordHash", { length: 256 }),
  resetPasswordToken: varchar("resetPasswordToken", { length: 512 }).unique(),
  resetPasswordTokenExpiry: timestamp("resetPasswordTokenExpires", {
    mode: "date",
  }),
  image: varchar("image", { length: 512 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

// User relations
export const userRelations = relations(users, ({ one, many }) => ({
  account: one(accounts, {
    fields: [users.id],
    references: [accounts.userId],
  }),
  session: many(sessions),
}))

// Verification Tokens table
export const verificationTokens = pgTable(
  "verificationTokens",
  {
    identifier: varchar("identifier", { length: 512 }).notNull(),
    token: varchar("token", { length: 512 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({
      columns: [vt.identifier, vt.token],
    }),
  })
)

// Clinics table
export const clinics = pgTable("clinics", {
  id: varchar("id", { length: 128 }).notNull().primaryKey(),
  longitude: varchar("longitude", { length: 24 }).notNull(),
  latitude: varchar("latitude", { length: 24 }).notNull(),
  address: varchar("address", { length: 128 }).notNull(),
  phone_1: varchar("phone_1", { length: 16 }).notNull(),
  phone_2: varchar("phone_2", { length: 16 }).notNull(),
  email: varchar("email", { length: 64 }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

// Business Hours table
export const businessHours = pgTable("business_hours", {
  id: varchar("id", { length: 128 }).notNull().primaryKey(),
  mondayPeriods: jsonb("monday_periods").$type<object[]>().notNull(),
  tuesdayPeriods: jsonb("tuesday_periods").$type<object[]>().notNull(),
  wednesdayPeriods: jsonb("wednesday_periods").$type<object[]>().notNull(),
  thursdayPeriods: jsonb("thursday_periods").$type<object[]>().notNull(),
  fridayPeriods: jsonb("friday_periods").$type<object[]>().notNull(),
  saturdayPeriods: jsonb("saturday_periods").$type<object[]>().notNull(),
  sundayPeriods: jsonb("sunday_periods").$type<object[]>().notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

// Bookings table
export const bookings = pgTable("bookings", {
  id: varchar("id", { length: 128 }).notNull().primaryKey(),
  type: serviceTypeEnum("type").notNull().default("veterinarian"),
  date: date("date", { mode: "date" }).notNull(),
  time: varchar("time", { length: 5 }).notNull(),
  firstName: varchar("firstName", { length: 32 }).notNull(),
  lastName: varchar("lastName", { length: 64 }).notNull(),
  email: varchar("email", { length: 64 }).notNull(),
  phone: varchar("phone", { length: 16 }).notNull(),
  message: varchar("message", { length: 10240 }),
  status: bookingStatusEnum("status").notNull().default("unconfirmed"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

// Dates Unavailable table
export const datesUnavailable = pgTable("datesUnavailable", {
  id: varchar("id", { length: 128 }).notNull().primaryKey(),
  date: date("date", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).default(
    sql`current_timestamp`
  ),
})

// Type exports for tables
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

export type VerificationToken = typeof verificationTokens.$inferSelect
export type NewVerificationToken = typeof verificationTokens.$inferInsert

export type Clinic = typeof clinics.$inferSelect
export type NewClinic = typeof clinics.$inferInsert

export type Booking = typeof bookings.$inferSelect
export type NewBooking = typeof bookings.$inferInsert

export type BusinessHours = typeof businessHours.$inferSelect
export type NewBusinessHours = typeof businessHours.$inferInsert

export type DateUnavailable = typeof datesUnavailable.$inferSelect
export type NewDateUnavailable = typeof datesUnavailable.$inferInsert
