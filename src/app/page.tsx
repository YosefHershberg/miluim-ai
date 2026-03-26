import { getAuthenticatedUser } from "@/lib/auth";
import { LandingPage } from "@/components/landing/landing-page";

export default async function HomePage() {
  const user = await getAuthenticatedUser();
  return <LandingPage isAuthenticated={!!user} />;
}
