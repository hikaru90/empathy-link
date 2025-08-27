CREATE TABLE "memories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"confidence" text NOT NULL,
	"type" text NOT NULL,
	"priority" real DEFAULT 1 NOT NULL,
	"key" text,
	"value" text NOT NULL,
	"embedding" text,
	"chat_id" text,
	"relevance_score" real DEFAULT 1 NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"last_accessed" timestamp DEFAULT now(),
	"expires_at" timestamp,
	"created" timestamp DEFAULT now() NOT NULL,
	"updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "user_type_idx" ON "memories" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX "user_relevance_idx" ON "memories" USING btree ("user_id","relevance_score");--> statement-breakpoint
CREATE INDEX "expiry_idx" ON "memories" USING btree ("expires_at");