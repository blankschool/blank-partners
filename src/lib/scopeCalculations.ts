// Scope status calculation utilities

export type ScopeStatus = 'OUT_OF_SCOPE' | 'BEHIND' | 'ON_TRACK' | 'OVERDELIVERY';

export type ChannelCode = 'instagram' | 'tiktok_posts' | 'linkedin_posts' | 'youtube_shorts' | 'youtube_videos' | 'recordings';

export interface ChannelData {
  code: ChannelCode;
  name: string;
  planned: number;
  actual: number;
}

export interface ClientScope {
  client_id: string;
  client_name: string;
  totals: { planned: number; actual: number };
  by_channel: ChannelData[];
}

export interface ChannelTotals {
  code: ChannelCode;
  name: string;
  planned: number;
  actual: number;
}

export interface ScopeData {
  period: { id: string; label: string; type: 'month' };
  lastUpdated: string | null;
  channels: ChannelTotals[];
  clients: ClientScope[];
}

// Channel configuration
export const CHANNEL_CONFIG: { code: ChannelCode; name: string; shortName: string }[] = [
  { code: 'instagram', name: 'Instagram', shortName: 'IG' },
  { code: 'tiktok_posts', name: 'TikTok', shortName: 'TT' },
  { code: 'linkedin_posts', name: 'LinkedIn', shortName: 'LI' },
  { code: 'youtube_shorts', name: 'YT Shorts', shortName: 'YTS' },
  { code: 'youtube_videos', name: 'YT Videos', shortName: 'YTV' },
  { code: 'recordings', name: 'Gravações', shortName: 'GRAV' },
];

/**
 * Calculate percentage of plan
 * Returns null if planned = 0 (out of scope)
 */
export function calculatePercentOfPlan(planned: number, actual: number): number | null {
  if (planned === 0) return null;
  return (actual / planned) * 100;
}

/**
 * Calculate status based on planned vs actual
 * Status rules:
 * - OUT_OF_SCOPE: planned = 0
 * - BEHIND: planned > 0 AND percent < 90%
 * - ON_TRACK: planned > 0 AND 90% <= percent <= 110%
 * - OVERDELIVERY: planned > 0 AND percent > 110%
 */
export function calculateStatus(planned: number, actual: number): ScopeStatus {
  if (planned === 0) return 'OUT_OF_SCOPE';
  const percent = (actual / planned) * 100;
  if (percent < 90) return 'BEHIND';
  if (percent <= 110) return 'ON_TRACK';
  return 'OVERDELIVERY';
}

/**
 * Calculate delta (difference between actual and planned)
 */
export function calculateDelta(planned: number, actual: number): number {
  return actual - planned;
}

/**
 * Format percentage for display
 */
export function formatPercent(percent: number | null): string {
  if (percent === null) return '—';
  return `${Math.round(percent)}%`;
}

/**
 * Format delta with sign for display
 */
export function formatDelta(delta: number): string {
  if (delta === 0) return '0';
  return delta > 0 ? `+${delta}` : `${delta}`;
}

/**
 * Status priority for sorting (lower = higher priority)
 */
const STATUS_PRIORITY: Record<ScopeStatus, number> = {
  BEHIND: 0,
  OVERDELIVERY: 1,
  ON_TRACK: 2,
  OUT_OF_SCOPE: 3,
};

/**
 * Sort clients by risk (decision-first ordering)
 * 1. BEHIND: ascending by percent (most critical first)
 * 2. OVERDELIVERY: descending by delta (biggest excess first)
 * 3. ON_TRACK: alphabetical
 * 4. OUT_OF_SCOPE: alphabetical
 */
export function sortByRisk(clients: ClientScope[]): ClientScope[] {
  return [...clients].sort((a, b) => {
    const statusA = calculateStatus(a.totals.planned, a.totals.actual);
    const statusB = calculateStatus(b.totals.planned, b.totals.actual);

    // First sort by status priority
    if (STATUS_PRIORITY[statusA] !== STATUS_PRIORITY[statusB]) {
      return STATUS_PRIORITY[statusA] - STATUS_PRIORITY[statusB];
    }

    // Within same status, apply specific sorting
    if (statusA === 'BEHIND') {
      // Ascending by percent (lowest first = most critical)
      const percentA = (a.totals.actual / a.totals.planned) * 100;
      const percentB = (b.totals.actual / b.totals.planned) * 100;
      return percentA - percentB;
    }

    if (statusA === 'OVERDELIVERY') {
      // Descending by delta (highest first = most excess)
      const deltaA = a.totals.actual - a.totals.planned;
      const deltaB = b.totals.actual - b.totals.planned;
      return deltaB - deltaA;
    }

    // For ON_TRACK and OUT_OF_SCOPE, sort alphabetically
    return a.client_name.localeCompare(b.client_name);
  });
}

/**
 * Get top N clients that are behind
 */
export function getTopBehind(clients: ClientScope[], limit: number = 5): ClientScope[] {
  return clients
    .filter((c) => {
      const status = calculateStatus(c.totals.planned, c.totals.actual);
      return status === 'BEHIND';
    })
    .sort((a, b) => {
      const percentA = (a.totals.actual / a.totals.planned) * 100;
      const percentB = (b.totals.actual / b.totals.planned) * 100;
      return percentA - percentB;
    })
    .slice(0, limit);
}

/**
 * Get top N clients with overdelivery
 */
export function getTopOverdelivery(clients: ClientScope[], limit: number = 5): ClientScope[] {
  return clients
    .filter((c) => {
      const status = calculateStatus(c.totals.planned, c.totals.actual);
      return status === 'OVERDELIVERY';
    })
    .sort((a, b) => {
      const deltaA = a.totals.actual - a.totals.planned;
      const deltaB = b.totals.actual - b.totals.planned;
      return deltaB - deltaA;
    })
    .slice(0, limit);
}

/**
 * Calculate overall totals from channel data
 */
export function calculateOverallTotals(channels: ChannelTotals[]): { planned: number; actual: number } {
  return channels.reduce(
    (acc, channel) => ({
      planned: acc.planned + channel.planned,
      actual: acc.actual + channel.actual,
    }),
    { planned: 0, actual: 0 }
  );
}
