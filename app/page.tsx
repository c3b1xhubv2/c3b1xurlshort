import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { ShortenForm } from "@/components/shorten-form";
import { StatsStrip } from "@/components/stats-strip";
import { RecentLinks } from "@/components/recent-links";
import { Credits } from "@/components/credits";

export default function Home() {
  return (
    <div className="page">
      <SiteHeader />
      <main>
        <Hero />
        <StatsStrip />
        <ShortenForm />
        <RecentLinks />
      </main>
      <Credits />
    </div>
  );
}
