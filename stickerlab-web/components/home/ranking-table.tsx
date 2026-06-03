import { ROUTES, SIZES } from "@/lib/constants";
import { getAccuracyBadgeClasses } from "@/lib/styles";
import { formatPercentage } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface TeamStats {
  paniniAccuracyRate: number;
  errorRate: number;
}

interface RankingTeam {
  id: string;
  name: string;
  slug: string;
  badgeUrl: string | null;
}

interface RankingItem {
  rank: number;
  team: RankingTeam;
  statistics: TeamStats;
}

interface RankingTableProps {
  ranking: RankingItem[];
}

export function RankingTable({ ranking }: RankingTableProps) {
  return (
    <section className="mb-12 bg-card rounded-xl shadow-lg p-6 border">
      <h2 className="text-xl font-bold text-foreground mb-4">
        📊 StickerLab Accuracy Ranking
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Percentage of album players that were called up
      </p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 text-sm font-semibold text-foreground">
                Rank
              </th>
              <th className="text-left py-2 px-3 text-sm font-semibold text-foreground">
                Team
              </th>
              <th className="text-center py-2 px-3 text-sm font-semibold text-foreground">
                Accuracy
              </th>
              <th className="text-center py-2 px-3 text-sm font-semibold text-foreground">
                Error Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {ranking.map(({ team, statistics, rank }) => (
              <tr
                key={team.id}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-3 text-sm text-muted-foreground">
                  #{rank}
                </td>
                <td className="py-3 px-3">
                  <Link
                    href={ROUTES.TEAM(team.id)}
                    className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                    aria-label={`View details for ${team.name}`}
                  >
                    {team.badgeUrl && (
                      <div
                        className="relative shrink-0"
                        style={{
                          width: SIZES.BADGE.SMALL.width * 4,
                          height: SIZES.BADGE.SMALL.height * 4,
                        }}
                      >
                        <Image
                          src={team.badgeUrl}
                          alt={`${team.name} badge`}
                          fill
                          className="object-contain"
                          unoptimized
                          priority
                        />
                      </div>
                    )}
                    <span>{team.name}</span>
                  </Link>
                </td>
                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-semibold ${getAccuracyBadgeClasses(statistics.paniniAccuracyRate)}`}
                  >
                    {formatPercentage(statistics.paniniAccuracyRate)}
                  </span>
                </td>
                <td className="py-3 px-3 text-center text-sm text-muted-foreground">
                  {formatPercentage(statistics.errorRate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
