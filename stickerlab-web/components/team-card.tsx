"use client";

import { StatusBadge } from "@/components/shared/status-badge";
import { TeamBadge } from "@/components/shared/team-badge";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES, SIZES } from "@/lib/constants";
import { getTeamGradient } from "@/lib/styles";
import { getTeamColors, hasTeamData } from "@/lib/team";
import { cn } from "@/lib/utils";
import type { TeamInGroup } from "@/services/groups.service";
import Link from "next/link";
import { memo } from "react";

interface TeamCardProps {
  team: TeamInGroup;
  basePath?: string;
}

function TeamCardComponent({ team, basePath }: TeamCardProps) {
  const colors = getTeamColors(team);
  const dataExists = hasTeamData(team.comparison);

  const cardContent = (
    <Card
      className={cn(
        "p-0 gap-0 h-full overflow-hidden transition-all duration-200 group",
        "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
      )}
    >
      <div
        className={`${SIZES.BANNER.SMALL} w-full relative flex items-center justify-center`}
        style={{
          background: getTeamGradient(colors.primary, colors.secondary),
        }}
      >
        <TeamBadge team={team} size="medium" />
      </div>

      <CardContent className="p-3">
        <h3 className="font-semibold text-sm leading-tight text-foreground mb-2 min-h-10">
          {team.name}
        </h3>

        {dataExists ? (
          <div className="flex flex-wrap gap-1">
            <StatusBadge
              variant="success"
              count={team.comparison.inAlbumAndCalledUp}
            />
            <StatusBadge
              variant="warning"
              count={team.comparison.onlyInAlbum}
            />
            <StatusBadge
              variant="error"
              count={team.comparison.calledUpWithoutSticker}
            />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">No data</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Link
      href={basePath ? `${basePath}/${team.id}` : ROUTES.TEAM(team.id)}
      aria-label={`View details for ${team.name}`}
    >
      {cardContent}
    </Link>
  );
}

export const TeamCard = memo(TeamCardComponent);
