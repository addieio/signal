"use client";

import { useSyncExternalStore } from "react";
import { repository, BASE_SNAPSHOT } from "@/lib/repository";
import type { CatalogSnapshot } from "@/lib/types";

/** Keeps browser-owned catalogue state in React with referential stability. */
export function useCatalog(): CatalogSnapshot {
  return useSyncExternalStore(
    repository.subscribe,
    repository.getSnapshot,
    () => BASE_SNAPSHOT
  );
}
