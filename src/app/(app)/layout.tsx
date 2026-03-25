import { requireAuth } from "@/lib/auth";
import { getUserProfileByUserId } from "@/data-access/user-profile";
import { Navbar } from "@/components/layout/navbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();
  const profile = await getUserProfileByUserId(user.id);

  const userName = profile?.fullName || user.email || "User";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar userName={userName} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
