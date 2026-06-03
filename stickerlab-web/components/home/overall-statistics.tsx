import { StatisticCard } from "@/components/shared/statistic-card";

interface OverallStatsData {
  totalTeams: number;
  paniniAccuracyRate: number;
  errorRate: number;
  totalInAlbumAndCalledUp: number;
  totalAlbumPlayers: number;
  totalOnlyInAlbum: number;
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatisticCard
          value={stats.paniniAccuracyRate}
          label="Panini Accuracy"
          description={`${stats.totalInAlbumAndCalledUp}/${stats.totalAlbumPlayers} album players called up`}
          showBadge
        />
        <StatisticCard
          value={stats.errorRate}
          label="Error Rate"
          description={`${stats.totalOnlyInAlbum}/${stats.totalAlbumPlayers} not called up`}
        />
      </div>
    </section>
  );
}
