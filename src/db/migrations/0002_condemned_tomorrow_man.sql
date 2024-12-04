ALTER TYPE "booking_status" ADD VALUE 'unconfirmed';--> statement-breakpoint
ALTER TYPE "booking_status" ADD VALUE 'confirmed';--> statement-breakpoint
ALTER TYPE "booking_status" ADD VALUE 'canceled';--> statement-breakpoint
ALTER TYPE "booking_status" ADD VALUE 'rejected';--> statement-breakpoint
ALTER TYPE "operating_status" ADD VALUE 'open';--> statement-breakpoint
ALTER TYPE "operating_status" ADD VALUE 'closed';--> statement-breakpoint
ALTER TYPE "service_type" ADD VALUE 'veterinarian';--> statement-breakpoint
ALTER TYPE "service_type" ADD VALUE 'hair salon';--> statement-breakpoint
ALTER TYPE "user_role" ADD VALUE 'client';--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "type" SET DEFAULT 'veterinarian';--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'unconfirmed';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'client';