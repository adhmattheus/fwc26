export interface TeamColors {
  primary: string;
  secondary: string;
}

export interface Team {
  colorPrimary: string;
  colorSecondary: string;
  badgeUrl?: string | null;
  fifaCode: string;
  name: string;
}

export function getTeamColors(
  team: Pick<Team, "colorPrimary" | "colorSecondary">,
): TeamColors {
  return {
    primary: team.colorPrimary,
    secondary: team.colorSecondary,
  };
}

export function hasTeamData(comparison: {
  inAlbumAndCalledUp: number;
  onlyInAlbum: number;
  calledUpWithoutSticker: number;
}): boolean {
  return (
    comparison.inAlbumAndCalledUp > 0 ||
    comparison.onlyInAlbum > 0 ||
    comparison.calledUpWithoutSticker > 0
  );
}
