"use client";

import { useTrackerParams } from "@/hooks/use-tracker-params";
import { Button } from "@neoai/ui/button";
import { Icons } from "@neoai/ui/icons";

export function OpenTrackerSheet() {
  const { setParams } = useTrackerParams();

  return (
    <div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setParams({ create: true })}
      >
        <Icons.Add />
      </Button>
    </div>
  );
}
