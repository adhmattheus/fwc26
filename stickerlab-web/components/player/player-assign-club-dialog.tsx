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
import { useClubs } from "@/hooks/useClubs";
import { useAssignPlayerClub } from "@/hooks/usePlayers";
import type { PlayerResponse } from "@/services/teams.service";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  clubId: z.string().min(1, "Selecione um clube"),
});

type FormValues = z.infer<typeof schema>;

interface PlayerAssignClubDialogProps {
  player: PlayerResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (player: PlayerResponse) => void;
}

export function PlayerAssignClubDialog({
  player,
  open,
  onOpenChange,
  onSuccess,
}: PlayerAssignClubDialogProps) {
  const { mutateAsync } = useAssignPlayerClub();
  const { data: clubs = [], isLoading } = useClubs();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { clubId: "" },
  });

  async function handleSubmit(values: FormValues) {
    try {
      const updated = await mutateAsync({
        playerId: player.id,
        clubId: values.clubId,
      });
      toast.success("Clube vinculado ao jogador com sucesso.");
      form.reset();
      onOpenChange(false);
      onSuccess?.(updated);
    } catch (error) {
      toast.error(
        "Não foi possível vincular o clube ao jogador. Tente novamente.",
      );
    }
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
                      {isLoading ? (
                        <SelectItem value="loading" disabled>
                          Carregando clubes...
                        </SelectItem>
                      ) : (
                        clubs.map((club) => (
                          <SelectItem key={club.id} value={club.id}>
                            <div className="flex items-center gap-2">
                              {club.badgeUrl && (
                                <Image
                                  src={club.badgeUrl}
                                  alt={`${club.name} badge`}
                                  width={16}
                                  height={16}
                                  className="object-contain shrink-0"
                                  unoptimized
                                />
                              )}
                              <span>{club.name}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
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
