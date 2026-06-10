"use client";

import { getCollectionAction, toggleStickerAction } from "@/actions/album";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const QUERY_KEY = ["album-collection"];

export function useAlbumCollection() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { albumCodes } = await getCollectionAction();
      return albumCodes;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useToggleSticker() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (albumCode: string) => toggleStickerAction(albumCode),
    onMutate: async (albumCode) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      const previous = queryClient.getQueryData<string[]>(QUERY_KEY);

      queryClient.setQueryData<string[]>(QUERY_KEY, (old = []) =>
        old.includes(albumCode)
          ? old.filter((c) => c !== albumCode)
          : [...old, albumCode],
      );

      return { previous };
    },
    onError: (_err, _albumCode, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
