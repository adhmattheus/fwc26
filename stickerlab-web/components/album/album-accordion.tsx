"use client";

import { TeamBadge } from "@/components/shared/team-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GroupResponse } from "@/services/groups.service";

interface AlbumAccordionProps {
  groups: GroupResponse[];
}

export function AlbumAccordion({ groups }: AlbumAccordionProps) {
  const sorted = [...groups].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="flex flex-col gap-6 mb-8">
      {sorted.map((group) => {
        return (
          <Card key={group.id} className="p-4 gap-0">
            <CardHeader className="p-0">
              <h2 className="text-sm font-bold text-foreground p-0">
                Group {group.name}
              </h2>
            </CardHeader>
            <CardContent className="p-0">
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
                          {stickers.map((sticker) => (
                            <div
                              key={sticker.code}
                              className="flex items-center justify-center rounded-lg border-2 border-red-300 bg-red-100 p-2 text-center cursor-pointer select-none transition-colors hover:opacity-80 min-h-20"
                            >
                              <span className="text-[10px] font-bold text-red-500 sm:text-xs">
                                {sticker.code}
                              </span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
