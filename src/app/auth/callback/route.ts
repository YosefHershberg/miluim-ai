import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserProfileByUserId } from "@/data-access/user-profile";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const profile = await getUserProfileByUserId(user.id);
        if (!profile) {
          return NextResponse.redirect(`${origin}/profile/create`);
        }
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
