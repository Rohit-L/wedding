import type { Route } from "./+types/home";

import { Faq } from "~/components/Faq";
import { Footer } from "~/components/Footer";
import { Hero } from "~/components/Hero";
import { Registry } from "~/components/Registry";
import { Schedule } from "~/components/Schedule";
import { SiteNav } from "~/components/SiteNav";
import { Story } from "~/components/Story";
import { Travel } from "~/components/Travel";
import { requireUnlocked } from "~/lib/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  await requireUnlocked(request);
  return null;
}

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero />
        <Schedule />
        <Travel />
        <Registry />
        <Story />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
