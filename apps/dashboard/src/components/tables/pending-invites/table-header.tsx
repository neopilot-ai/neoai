"use client";

import { InviteTeamMembersModal } from "@/components/modals/invite-team-members-modal";
import type { RouterOutputs } from "@api/trpc/routers/_app";
import { Button } from "@neoai/ui/button";
import { Dialog } from "@neoai/ui/dialog";
import { Input } from "@neoai/ui/input";
import type { Table } from "@tanstack/react-table";
import { useState } from "react";

type Props = {
  table?: Table<RouterOutputs["team"]["teamInvites"][number]>;
};

export function DataTableHeader({ table }: Props) {
  const [isOpen, onOpenChange] = useState(false);

  return (
    <div className="flex items-center pb-4 space-x-4">
      <Input
        className="flex-1"
        placeholder="Search..."
        value={(table?.getColumn("email")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table?.getColumn("email")?.setFilterValue(event.target.value)
        }
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck="false"
      />
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <Button onClick={() => onOpenChange(true)}>Invite member</Button>
        <InviteTeamMembersModal onOpenChange={onOpenChange} />
      </Dialog>
    </div>
  );
}
