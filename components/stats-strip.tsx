"use client";

import useSWR from "swr";
import type { LinkResult } from "@/lib/types";

type LinksResponse = { links?: LinkResult[] };
type AnalyticsResponse = { monthlyVisitors?: number };

const fetcher = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function StatsStrip() {
  const { data } = useSWR<LinksResponse>("/api/links", fetcher, {
    revalidateOnFocus: false,
  });
  const { data: analytics } = useSWR<AnalyticsResponse>("/api/analytics", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const links = data?.links ?? [];
  const totalClicks = links.reduce((sum, link) => sum + (Number(link.clicks) || 0), 0);

  const stats = [
    { index: "01", label: "URLS CREATED", value: links.length },
    { index: "02", label: "TOTAL CLICKS", value: totalClicks },
    { index: "03", label: "MONTHLY VISITORS", value: analytics?.monthlyVisitors ?? null },
  ];

  return (
    <section className="stats-strip" aria-label="Platform statistics">
      {stats.map((stat) => (
        <div className="stat" key={stat.label}>
          <span className="stat-index">{stat.index}</span>
          <span className="stat-label">{stat.label}</span>
          <strong className="stat-value">
            {stat.value === null ? "—" : formatNumber(stat.value)}
          </strong>
        </div>
      ))}
    </section>
  );
}

export const statsAnalyticsContract = {
  endpoint: "/api/analytics",
  response: { monthlyVisitors: 0 },
};

export default StatsStrip;
