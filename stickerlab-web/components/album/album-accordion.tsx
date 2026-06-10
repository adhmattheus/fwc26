"use client";

import { TeamBadge } from "@/components/shared/team-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  useAlbumCollection,
  useBulkAddStickers,
  useToggleSticker,
} from "@/hooks/useAlbumCollection";
import { cn } from "@/lib/utils";
import type { GroupResponse, TeamInGroup } from "@/services/groups.service";
import { CheckCheck } from "lucide-react";
import { memo, useMemo } from "react";

const FWC_STICKERS = Array.from({ length: 20 }, (_, i) => ({
  code: `FWC-${String(i).padStart(2, "0")}`,
}));

interface StickerCardProps {
  code: string;
  owned: boolean;
  onToggle: () => void;
}

const StickerCard = memo(function StickerCard({ code, owned, onToggle }: StickerCardProps) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "flex items-center justify-center rounded-lg border-2 p-2 text-center cursor-pointer select-none transition-all duration-200 hover:opacity-80 min-h-20",
        owned ? "border-green-300 bg-green-100" : "border-red-300 bg-red-100",
      )}
    >
      <span
        className={cn(
          "text-[10px] font-bold sm:text-xs transition-colors duration-200",
          owned ? "text-green-600" : "text-red-500",
        )}
      >
        {code}
      </span>
    </div>
  );
});

interface TeamAccordionItemProps {
  team: TeamInGroup;
  collection: string[];
  onToggle: (code: string) => void;
  onBulkAdd: (codes: string[]) => void;
}

const TeamAccordionItem = memo(function TeamAccordionItem({
  team,
  collection,
  onToggle,
  onBulkAdd,
}: TeamAccordionItemProps) {
  const stickers = useMemo(
    () => Array.from({ length: 20 }, (_, i) => ({ code: `${team.fifaCode}-${i + 1}` })),
    [team.fifaCode],
  );

  const missingCodes = useMemo(
    () => stickers.filter((s) => !collection.includes(s.code)).map((s) => s.code),
    [stickers, collection],
  );

  return (
    <AccordionItem
      value={team.id}
      className="border rounded-lg bg-white overflow-hidden last:border-b"
    >
      <AccordionTrigger className="hover:no-underline p-4 rounded-lg cursor-pointer transition-colors hover:bg-muted/60 group">
        <div className="flex items-center gap-3">
          <TeamBadge team={team} size="small" />
          <span className="font-medium text-foreground group-hover:text-primary transition-colors">
            {team.name}
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {missingCodes.length > 0 && (
          <div className="flex justify-end px-4 pt-3">
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-xs cursor-pointer"
              onClick={() => onBulkAdd(missingCodes)}
            >
              <CheckCheck className="h-3 w-3" />
              Complete all
            </Button>
          </div>
        )}
        <div className="grid grid-cols-4 gap-6 p-4 lg:grid-cols-5">
          {stickers.map((sticker) => (
            <StickerCard
              key={sticker.code}
              code={sticker.code}
              owned={collection.includes(sticker.code)}
              onToggle={() => onToggle(sticker.code)}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});

interface AlbumAccordionProps {
  groups: GroupResponse[];
}

export function AlbumAccordion({ groups }: AlbumAccordionProps) {
  const sorted = useMemo(
    () => [...groups].sort((a, b) => a.displayOrder - b.displayOrder),
    [groups],
  );
  const { data: collection = [] } = useAlbumCollection();
  const { mutate: toggle } = useToggleSticker();
  const { mutate: bulkAdd } = useBulkAddStickers();

  const fwcMissing = useMemo(
    () => FWC_STICKERS.filter((s) => !collection.includes(s.code)),
    [collection],
  );

  return (
    <div className="flex flex-col gap-4 mb-8">
      <Card className="gap-0 py-0">
        <CardHeader className="p-4 gap-0">
          <h2 className="text-sm font-bold text-foreground">FWC</h2>
        </CardHeader>
        <CardContent className="p-3">
          <Accordion type="multiple" className="w-full">
            <AccordionItem
              value="fwc"
              className="border rounded-lg bg-white overflow-hidden last:border-b"
            >
              <AccordionTrigger className="hover:no-underline p-4 rounded-lg cursor-pointer transition-colors hover:bg-muted/60 group">
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  FWC Stickers
                </span>
              </AccordionTrigger>
              <AccordionContent>
                {fwcMissing.length > 0 && (
                  <div className="flex justify-end px-4 pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1 text-xs cursor-pointer"
                      onClick={() => bulkAdd(fwcMissing.map((s) => s.code))}
                    >
                      <CheckCheck className="h-3 w-3" />
                      Complete all
                    </Button>
                  </div>
                )}
                <div className="grid grid-cols-4 gap-6 p-4 lg:grid-cols-5">
                  {FWC_STICKERS.map((sticker) => (
                    <StickerCard
                      key={sticker.code}
                      code={sticker.code}
                      owned={collection.includes(sticker.code)}
                      onToggle={() => toggle(sticker.code)}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {sorted.map((group) => (
        <Card key={group.id} className="gap-0 py-0">
          <CardHeader className="p-4 gap-0">
            <h2 className="text-sm font-bold text-foreground">
              Group {group.name}
            </h2>
          </CardHeader>
          <CardContent className="p-3">
            <Accordion type="multiple" className="w-full flex flex-col gap-4">
              {group.teams.map((team) => (
                <TeamAccordionItem
                  key={team.id}
                  team={team}
                  collection={collection}
                  onToggle={toggle}
                  onBulkAdd={bulkAdd}
                />
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
