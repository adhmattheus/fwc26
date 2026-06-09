import { SIZES } from "@/lib/constants";
import { formatPercentage } from "@/lib/utils";
import type { ClubRankingItem } from "@/services/clubs.service";
import Image from "next/image";

interface ClubsRankingTableProps {
  ranking: ClubRankingItem[];
}

export function ClubsRankingTable({ ranking }: ClubsRankingTableProps) {
  return (
    <section className="bg-card rounded-xl shadow-lg p-6 border">
      <h2 className="text-xl font-bold text-foreground mb-4">
        ⚽ Clubs Ranking
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Clubs ranked by players called up and in the album
      </p>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 text-sm font-semibold text-foreground">
                Rank
              </th>
              <th className="text-left py-2 px-3 text-sm font-semibold text-foreground">
                Club
              </th>
              <th className="text-center py-2 px-3 text-sm font-semibold text-foreground">
                Country
              </th>
              <th className="text-center py-2 px-3 text-sm font-semibold text-foreground">
                Players
              </th>
              <th className="text-center py-2 px-3 text-sm font-semibold text-foreground">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((club, index) => (
              <tr
                key={club.id}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-3 text-sm text-muted-foreground">
                  #{index + 1}
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {club.badgeUrl && (
                      <div
                        className="relative shrink-0"
                        style={{
                          width: SIZES.BADGE.SMALL.width * 4,
                          height: SIZES.BADGE.SMALL.height * 4,
                        }}
                      >
                        <Image
                          src={club.badgeUrl}
                          alt={`${club.name} badge`}
                          fill
                          className="object-contain"
                          unoptimized
                          priority
                        />
                      </div>
                    )}
                    <span>{club.name}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-center text-sm font-medium text-foreground">
                  {club.countryCode}
                </td>
                <td className="py-3 px-3 text-center text-sm font-medium text-foreground">
                  {club.playerCount}
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded text-xs font-semibold bg-primary/10 text-primary">
                    {formatPercentage(club.percentage)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
