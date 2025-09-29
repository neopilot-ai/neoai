"use client";

import { useInboxParams } from "@/hooks/use-inbox-params";
import { Button } from "@neoai/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@neoai/ui/dropdown-menu";
import { Icons } from "@neoai/ui/icons";

export function InboxOrdering() {
  const { params, setParams } = useInboxParams();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Icons.Sort size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem
          checked={params.sort === "date" && params.order === "asc"}
          onCheckedChange={() => setParams({ sort: "date", order: "asc" })}
        >
          Most recent
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={params.sort === "date" && params.order === "desc"}
          onCheckedChange={() => setParams({ sort: "date", order: "desc" })}
        >
          Oldest first
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={params.sort === "alphabetical"}
          onCheckedChange={() =>
            setParams({ sort: "alphabetical", order: "asc" })
          }
        >
          Alphabetically
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
