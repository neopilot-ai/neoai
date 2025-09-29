"use client";

import { useTransactionParams } from "@/hooks/use-transaction-params";
import { Button } from "@neoai/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@neoai/ui/dropdown-menu";
import { Icons } from "@neoai/ui/icons";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";

export function AddTransactions() {
  const [_, setParams] = useQueryStates({
    step: parseAsString,
    hide: parseAsBoolean,
  });

  const { setParams: setTransactionParams } = useTransactionParams();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Icons.Add size={17} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={10} align="end">
        <DropdownMenuItem
          onClick={() => setParams({ step: "connect" })}
          className="space-x-2"
        >
          <Icons.Accounts size={18} />
          <span>Connect account</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setParams({ step: "import", hide: true })}
          className="space-x-2"
        >
          <Icons.Import size={18} />
          <span>Import/backfill</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTransactionParams({ createTransaction: true })}
          className="space-x-2"
        >
          <Icons.CreateTransaction size={18} />
          <span>Create transaction</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
