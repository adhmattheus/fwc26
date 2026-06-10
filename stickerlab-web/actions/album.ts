"use server";

import { apiServer } from "@/services/api.server";

export interface CollectionResponse {
  albumCodes: string[];
}

export interface ToggleResponse {
  albumCode: string;
  owned: boolean;
}

export async function getCollectionAction(): Promise<CollectionResponse> {
  return apiServer.get<CollectionResponse>("/album/collection");
}

export async function toggleStickerAction(albumCode: string): Promise<ToggleResponse> {
  return apiServer.post<ToggleResponse>("/album/collection/toggle", { albumCode });
}
