/**
 * Standalone layout for /analytics — bypasses the main site layout
 * so the dashboard has full control over its own styling/background.
 */
export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
