import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { and, asc, desc, gte, inArray, like, lte, sql } from "drizzle-orm";

import { db } from "@/config/db";
import { DEFAULT_UNAUTHENTICATED_REDIRECT } from "@/config/defaults";
import { bookings, type Booking } from "@/db/schema";

import auth from "@/lib/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateRangePicker } from "@/components/date-range-picker";
import { BookingsTableShell } from "@/components/shells/bookings-table-shell";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL),
  title: "Bookings",
  description: "Manage your bookings",
};

interface ClinicBookingsPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function ClinicBookingsPage({
  searchParams,
}: Readonly<ClinicBookingsPageProps>): Promise<JSX.Element> {
  const session = await auth();
  if (!session) redirect(DEFAULT_UNAUTHENTICATED_REDIRECT);

  // Extract search parameters
  const { page, per_page, sort, from, to, lastName, type, email } =
    searchParams ?? {};

  // Pagination parameters
  const limit = typeof per_page === "string" ? parseInt(per_page) : 10;
  const offset =
    typeof page === "string"
      ? parseInt(page) > 0
        ? (parseInt(page) - 1) * limit
        : 0
      : 0;

  // Sorting parameters
  const [column, order] =
    typeof sort === "string"
      ? (sort.split(".") as [
          keyof Booking | undefined,
          "asc" | "desc" | undefined
        ])
      : [];

  // Filters
  const types =
    typeof type === "string" ? (type.split(".") as Booking["type"][]) : [];
  const fromDay = typeof from === "string" ? new Date(from) : undefined;
  const toDay = typeof to === "string" ? new Date(to) : undefined;

  const { items, count } = await db.transaction(async (tx) => {
    // Fetch booking items
    const items = await tx
      .select()
      .from(bookings)
      .limit(limit)
      .offset(offset)
      .where(
        and(
          // Filter by last name
          typeof lastName === "string"
            ? like(bookings.lastName, `%${lastName}%`)
            : undefined,

          // Filter by type
          types.length > 0 ? inArray(bookings.type, types) : undefined,

          // Filter by email
          typeof email === "string"
            ? like(bookings.email, `%${email}%`)
            : undefined,

          // Filter by creation date
          fromDay && toDay
            ? and(
                gte(bookings.createdAt, fromDay),
                lte(bookings.createdAt, toDay)
              )
            : undefined
        )
      )
      .orderBy(
        column && column in bookings
          ? order === "asc"
            ? asc(bookings[column])
            : desc(bookings[column])
          : desc(bookings.createdAt)
      );

    // Fetch total count
    const count = await tx
      .select({
        count: sql<number>`count(${bookings.id})`,
      })
      .from(bookings)
      .where(
        and(
          typeof lastName === "string"
            ? like(bookings.lastName, `%${lastName}%`)
            : undefined,
          types.length > 0 ? inArray(bookings.type, types) : undefined,
          typeof email === "string"
            ? like(bookings.email, `%${email}%`)
            : undefined,
          fromDay && toDay
            ? and(
                gte(bookings.createdAt, fromDay),
                lte(bookings.createdAt, toDay)
              )
            : undefined
        )
      )
      .then((res) => res[0]?.count ?? 0);

    return {
      items,
      count,
    };
  });

  const pageCount = Math.ceil(count / limit);

  return (
    <Card>
      <CardHeader className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-2xl">Bookings</CardTitle>
          <CardDescription>Manage your bookings</CardDescription>
        </div>

        <DateRangePicker align="end" />
      </CardHeader>
      <CardContent>
        <BookingsTableShell data={items} pageCount={pageCount} />
      </CardContent>
    </Card>
  );
}
