import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserProfileByUserId } from "@/data-access/user-profile";

export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAuth() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireProfile() {
  const user = await requireAuth();
  const profile = await getUserProfileByUserId(user.id);
  if (!profile) redirect("/profile/create");
  return { user, profile };
}
