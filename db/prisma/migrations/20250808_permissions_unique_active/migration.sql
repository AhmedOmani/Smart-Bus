CREATE UNIQUE INDEX IF NOT EXISTS permissions_unique_active
ON "permissions" ("studentId","type","date")
WHERE ("status" <> 'REJECTED');