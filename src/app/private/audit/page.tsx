import type { Metadata } from "next";
import AuditAdminDashboard from "@/components/private/AuditAdminDashboard";

export const metadata: Metadata = {
  title: "Audit Admin",
  robots: { index: false, follow: false },
};

export default function PrivateAuditPage() {
  return <AuditAdminDashboard />;
}
