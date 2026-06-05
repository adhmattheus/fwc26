import { StatisticCard } from "@/components/shared/statistic-card";

interface MostRepresentedClub {
  club: string;
  percentage: number;
  playerCount: number;
  totalPlayers: number;
}

interface OverallStatsData {
  totalTeams: number;
  paniniAccuracyRate: number;
  errorRate: number;
  totalCalledUpPlayers: number;
  totalAlbumPlayers: number;
  totalInAlbumAndCalledUp: number;
  totalOnlyInAlbum: number;
  totalCalledUpWithoutSticker: number;
  mostRepresentedClub: MostRepresentedClub | null;
}

interface OverallStatisticsProps {
  stats: OverallStatsData;
}

export function OverallStatistics({ stats }: OverallStatisticsProps) {
  return (
    <section className="mb-8 bg-card rounded-xl shadow-lg p-6 border">
      <h2 className="text-lg font-bold text-foreground mb-4">
        📊 Overall Statistics
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Aggregate statistics across {stats.totalTeams} teams with data
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard
          value={stats.totalCalledUpPlayers}
          label="Total Called Up Players"
          description="Players called up for their national teams"
          isPercentage={false}
        />
        <StatisticCard
          value={stats.totalAlbumPlayers}
          label="Total Album Players"
          description="Players included in the album"
          isPercentage={false}
        />
        <StatisticCard
          value={stats.totalInAlbumAndCalledUp}
          label="Total In Album And Called Up"
          description="Players included in the album and called up"
          isPercentage={false}
        />

        <StatisticCard
          value={stats.totalOnlyInAlbum}
          label="Total Only In Album"
          description="Players included in the album but not called up"
          isPercentage={false}
        />

        <StatisticCard
          value={stats.totalCalledUpWithoutSticker}
          label="Called Up Without Sticker"
          description="Players called up but not in the album"
          isPercentage={false}
        />
        <StatisticCard
          value={stats.paniniAccuracyRate}
          label="StickerLab Accuracy"
          description={`${stats.totalInAlbumAndCalledUp}/${stats.totalAlbumPlayers} album players called up`}
          showBadge
        />
        <StatisticCard
          value={stats.errorRate}
          label="Error Rate"
          description={`${stats.totalOnlyInAlbum}/${stats.totalAlbumPlayers} not called up`}
        />
        {stats.mostRepresentedClub && (
          <StatisticCard
            value={stats.mostRepresentedClub.percentage}
            label="Most Represented Club"
            description={`${stats.mostRepresentedClub.club} • ${stats.mostRepresentedClub.playerCount}/${stats.mostRepresentedClub.totalPlayers} players`}
            showBadge
          />
        )}
      </div>
    </section>
  );
}
