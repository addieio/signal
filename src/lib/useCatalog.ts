"use client";

import { useSyncExternalStore } from "react";
import { repository } from "@/lib/repository";
import { INITIAL_CATALOG } from "@/lib/initialCatalog";
import type { CatalogSnapshot } from "@/lib/types";

/** Keeps browser-owned catalogue state in React with referential stability. */
export function useCatalog(): CatalogSnapshot {
  return useSyncExternalStore(
    repository.subscribe,
    repository.getSnapshot,
    () => INITIAL_CATALOG
  );
}
