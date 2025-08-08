CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "absences"
ADD CONSTRAINT absences_no_overlap
EXCLUDE USING gist (
  "studentId" WITH =,
  tsrange("startDate", "endDate", '[]') WITH &&
)
WHERE ("status" <> 'REJECTED'::"AbsenceStatus");