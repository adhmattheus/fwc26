import { PlayerSection } from "@/components/player-section";
import { StatisticCard } from "@/components/shared/statistic-card";
import { TeamBadge } from "@/components/shared/team-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES, SIZES } from "@/lib/constants";
import { getTeamGradient } from "@/lib/styles";
import { getTeamColors } from "@/lib/team";
import { teamsService } from "@/services/teams.service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function TeamPage({ params }: PageProps) {
  const { id } = await params;
  const data = await teamsService.getById(id);

  if (!data) {
    notFound();
  }

  const { team, comparison, statistics } = data;
  const colors = getTeamColors(team);

  return (
    <main className="min-h-screen bg-background">
      <div
        className={SIZES.BANNER.MEDIUM + " w-full"}
        style={{
          background: getTeamGradient(colors.primary, colors.secondary),
        }}
      />

      <div className="container mx-auto px-4 ">
        <div className="py-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-muted-foreground hover:text-foreground"
          >
            <Link href={ROUTES.HOME}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>

        <header className="mb-8">
          <div className="bg-card rounded-xl shadow-lg p-6 border inline-flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <TeamBadge team={team} size="large" />
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">
                  {team.name}
                </h1>
                <Badge
                  className="text-xs"
                  style={{ backgroundColor: colors.primary, color: "#fff" }}
                >
                  {team.fifaCode}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {comparison.inAlbumAndCalledUp.total +
                  comparison.onlyInAlbum.total}{" "}
                stickers in album
              </p>
            </div>
          </div>
        </header>

        <section className="mb-8 bg-card rounded-xl shadow-lg p-6 border">
          <h2 className="text-lg font-bold text-foreground mb-4">
            📊 Team Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatisticCard
              value={statistics.paniniAccuracyRate}
              label="StickerLab Accuracy"
              description={`${comparison.inAlbumAndCalledUp.total}/${comparison.inAlbumAndCalledUp.total + comparison.onlyInAlbum.total} album players called up`}
              showBadge
            />

            <StatisticCard
              value={statistics.errorRate}
              label="Error Rate"
              description={`${comparison.onlyInAlbum.total}/${comparison.inAlbumAndCalledUp.total + comparison.onlyInAlbum.total} not called up`}
            />

            {statistics.mostRepresentedClub && (
              <StatisticCard
                value={statistics.mostRepresentedClub.percentage}
                label="Most Represented Club"
                description={`${statistics.mostRepresentedClub.club} • ${statistics.mostRepresentedClub.playerCount}/${statistics.mostRepresentedClub.totalPlayers} players called up and in album`}
                showBadge
              />
            )}
          </div>
        </section>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 rounded-xl bg-status-success/10 border border-status-success/20">
            <p className="text-3xl font-bold text-status-success">
              {comparison.inAlbumAndCalledUp.total}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              In album & called up
            </p>
          </div>
          <div className="text-center p-4 rounded-xl bg-status-warning/10 border border-status-warning/20">
            <p className="text-3xl font-bold text-status-warning">
              {comparison.onlyInAlbum.total}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Only in album</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-status-error/10 border border-status-error/20">
            <p className="text-3xl font-bold text-status-error">
              {comparison.calledUpWithoutSticker.total}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Called up without sticker
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <PlayerSection
            title="In Album and Called Up"
            count={comparison.inAlbumAndCalledUp.total}
            players={comparison.inAlbumAndCalledUp.players}
            variant="green"
          />
          <PlayerSection
            title="Only in Album"
            count={comparison.onlyInAlbum.total}
            players={comparison.onlyInAlbum.players}
            variant="amber"
          />
          <PlayerSection
            title="Called Up Without Sticker"
            count={comparison.calledUpWithoutSticker.total}
            players={comparison.calledUpWithoutSticker.players}
            variant="red"
            showCode={false}
          />
        </div>
      </div>
    </main>
  );
}
