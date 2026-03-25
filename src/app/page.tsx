import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { getUserProfileByUserId } from "@/data-access/user-profile";

export default async function HomePage() {
  const user = await getAuthenticatedUser();

  if (user) {
    const profile = await getUserProfileByUserId(user.id);
    if (profile) redirect("/dashboard");
    redirect("/profile/create");
  }

  redirect("/login");
}
