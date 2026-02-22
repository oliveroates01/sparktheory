import ReportsClient from "./ReportsClient";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) || {};
  const rawKey = params.key;
  const key = Array.isArray(rawKey) ? rawKey[0] : rawKey;
  const adminKeyValid = Boolean(process.env.ADMIN_KEY) && key === process.env.ADMIN_KEY;

  const adminEmails = String(process.env.ADMIN_REPORT_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return (
    <ReportsClient
      adminKeyValid={adminKeyValid}
      adminEmails={adminEmails}
    />
  );
}

