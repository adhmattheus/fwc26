"use client";

import { SIZES } from "@/lib/constants";
import { getTeamGradient } from "@/lib/styles";
import { getTeamColors, type Team } from "@/lib/team";
import Image from "next/image";
import { useState } from "react";

type BadgeSize = "small" | "medium" | "large" | "extraLarge";

interface TeamBadgeProps {
  team: Pick<
    Team,
    "badgeUrl" | "fifaCode" | "colorPrimary" | "colorSecondary" | "name"
  >;
  size?: BadgeSize;
  showFallback?: boolean;
}

const SIZE_MAP: Record<
  BadgeSize,
  { width: number; height: number; fontSize: string }
> = {
  small: { ...SIZES.BADGE.SMALL, fontSize: "text-xs" },
  medium: { ...SIZES.BADGE.MEDIUM, fontSize: "text-4xl" },
  large: { ...SIZES.BADGE.LARGE, fontSize: "text-5xl" },
  extraLarge: { ...SIZES.BADGE.EXTRA_LARGE, fontSize: "text-6xl" },
};

export function TeamBadge({
  team,
  size = "medium",
  showFallback = true,
}: TeamBadgeProps) {
  const [imgError, setImgError] = useState(false);
  const colors = getTeamColors(team);
  const dimensions = SIZE_MAP[size];

  if (team.badgeUrl && !imgError) {
    return (
      <div
        className="relative drop-shadow-lg"
        style={{ width: dimensions.width * 4, height: dimensions.height * 4 }}
      >
        <Image
          src={team.badgeUrl}
          alt={`${team.name} badge`}
          fill
          className="object-contain"
          onError={() => setImgError(true)}
          unoptimized
          priority
        />
      </div>
    );
  }

  if (!showFallback) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full ${dimensions.fontSize} font-bold text-white/80 drop-shadow-md`}
      style={{
        width: dimensions.width * 4,
        height: dimensions.height * 4,
        background: getTeamGradient(colors.primary, colors.secondary),
      }}
    >
      {team.fifaCode}
    </div>
  );
}
