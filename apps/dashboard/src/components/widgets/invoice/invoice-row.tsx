"use client";

import { FormatAmount } from "@/components/format-amount";
import { InvoiceStatus } from "@/components/invoice-status";
import { useInvoiceParams } from "@/hooks/use-invoice-params";
import { getDueDateStatus } from "@/utils/format";
import { formatDate } from "@/utils/format";
import type { RouterOutputs } from "@api/trpc/routers/_app";
import { cn } from "@neoai/ui/cn";

type Props = {
  invoice: NonNullable<RouterOutputs["invoice"]["get"]["data"]>[number];
};

export function InvoiceRow({ invoice }: Props) {
  const { setParams } = useInvoiceParams();
  const showDate = invoice.status === "unpaid" || invoice.status === "overdue";

  return (
    <>
      <li
        key={invoice.id}
        className="h-[57px] flex items-center w-full"
        onClick={() => setParams({ invoiceId: invoice.id, type: "details" })}
      >
        <div className="flex items-center w-full">
          <div className="flex flex-col space-y-1 w-[90px]">
            <span className="text-sm">
              {invoice.dueDate ? formatDate(invoice.dueDate) : "-"}
            </span>
            {showDate && (
              <span className="text-xs text-muted-foreground">
                {invoice.dueDate ? getDueDateStatus(invoice.dueDate) : "-"}
              </span>
            )}
          </div>

          <div className="w-[85px]">
            <InvoiceStatus status={invoice.status} />
          </div>

          <div className="flex-1 text-sm line-clamp-1 pr-4">
            {invoice.customer?.name}
          </div>

          <div
            className={cn(
              "w-1/4 flex justify-end text-sm",
              invoice.status === "canceled" && "line-through",
            )}
          >
            <FormatAmount
              amount={invoice.amount ?? 0}
              currency={invoice.currency ?? "USD"}
            />
          </div>
        </div>
      </li>
    </>
  );
}
