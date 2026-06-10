"use client";

import { TeamBadge } from "@/components/shared/team-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  useAlbumCollection,
  useToggleSticker,
} from "@/hooks/useAlbumCollection";
import { cn } from "@/lib/utils";
import type { GroupResponse } from "@/services/groups.service";

interface AlbumAccordionProps {
  groups: GroupResponse[];
}

export function AlbumAccordion({ groups }: AlbumAccordionProps) {
  const sorted = [...groups].sort((a, b) => a.displayOrder - b.displayOrder);
  const { data: collection = [] } = useAlbumCollection();
  const { mutate: toggle } = useToggleSticker();

  return (
    <div className="flex flex-col gap-4 mb-8">
      {sorted.map((group) => (
        <Card key={group.id} className="gap-0 py-0">
          <CardHeader className="p-4 gap-0">
            <h2 className="text-sm font-bold text-foreground">
              Group {group.name}
            </h2>
          </CardHeader>
          <CardContent className="p-3">
            <Accordion type="multiple" className="w-full flex flex-col gap-4">
              {group.teams.map((team) => {
                const stickers = Array.from({ length: 20 }, (_, i) => ({
                  code: `${team.fifaCode}-${i + 1}`,
                }));

                return (
                  <AccordionItem
                    key={team.id}
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
                      <div className="grid grid-cols-4 gap-6 p-4 lg:grid-cols-5">
                        {stickers.map((sticker) => {
                          const owned = collection.includes(sticker.code);
                          return (
                            <div
                              key={sticker.code}
                              onClick={() => toggle(sticker.code)}
                              className={cn(
                                "flex items-center justify-center rounded-lg border-2 p-2 text-center cursor-pointer select-none transition-colors hover:opacity-80 min-h-20",
                                owned
                                  ? "border-green-300 bg-green-100"
                                  : "border-red-300 bg-red-100",
                              )}
                            >
                              <span
                                className={cn(
                                  "text-[10px] font-bold sm:text-xs",
                                  owned ? "text-green-600" : "text-red-500",
                                )}
                              >
                                {sticker.code}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
