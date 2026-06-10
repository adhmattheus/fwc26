"use client";

import { StatisticCard } from "@/components/shared/statistic-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAlbumCollection } from "@/hooks/useAlbumCollection";

const ALBUM_TOTAL = 994;

export function AlbumStats() {
  const { data: collection = [] } = useAlbumCollection();

  const owned = collection.length;
  const missing = ALBUM_TOTAL - owned;
  const percentage = parseFloat(((owned / ALBUM_TOTAL) * 100).toFixed(1));

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">📒 Album Statistics</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track your sticker collection progress
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatisticCard
            value={owned}
            label="Owned"
            description="Stickers you already have"
            isPercentage={false}
          />
          <StatisticCard
            value={missing}
            label="Missing"
            description="Stickers you still need"
            isPercentage={false}
          />
          <StatisticCard
            value={ALBUM_TOTAL}
            label="Total"
            description="Total stickers in the album"
            isPercentage={false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Album progress</span>
            <span className="font-medium text-foreground">{percentage}%</span>
          </div>
          <Progress value={percentage} />
        </div>
      </CardContent>
    </Card>
  );
}
