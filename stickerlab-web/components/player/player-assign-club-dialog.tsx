"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { PlayerResponse } from "@/services/teams.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MOCK_CLUBS = [
  { id: "1", name: "Flamengo" },
  { id: "2", name: "Palmeiras" },
  { id: "3", name: "São Paulo" },
  { id: "4", name: "Corinthians" },
  { id: "5", name: "Grêmio" },
];

const schema = z.object({
  clubId: z.string().min(1, "Selecione um clube"),
});

type FormValues = z.infer<typeof schema>;

interface PlayerAssignClubDialogProps {
  player: PlayerResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (player: PlayerResponse, clubId: string) => Promise<void>;
}

export function PlayerAssignClubDialog({
  player,
  open,
  onOpenChange,
  onSubmit,
}: PlayerAssignClubDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { clubId: "" },
  });

  async function handleSubmit(values: FormValues) {
    await onSubmit(player, values.clubId);
    form.reset();
    onOpenChange(false);
  }

  function handleCancel() {
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar clube</DialogTitle>
          <DialogDescription>
            Selecione o clube para vincular ao jogador{" "}
            <span className="font-medium text-foreground">{player.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="clubId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clube</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um clube" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_CLUBS.map((club) => (
                        <SelectItem key={club.id} value={club.id}>
                          {club.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={form.formState.isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
