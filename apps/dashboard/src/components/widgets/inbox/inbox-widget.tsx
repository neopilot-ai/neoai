"use client";

import { CopyInput } from "@/components/copy-input";
import { useUserQuery } from "@/hooks/use-user";
import { useTRPC } from "@/trpc/client";
import { getInboxEmail } from "@neoai/inbox";
import { useSuspenseQuery } from "@tanstack/react-query";
import { InboxList } from "./inbox-list";

export function InboxWidget() {
  const trpc = useTRPC();
  const { data: user } = useUserQuery();
  const { data } = useSuspenseQuery(trpc.inbox.get.queryOptions());

  if (!data?.data?.length) {
    return (
      <div className="flex flex-col space-y-4 items-center justify-center h-full text-center">
        <div>
          <CopyInput value={getInboxEmail(user?.team?.inboxId ?? "")} />
        </div>

        <p className="text-sm text-[#606060]">
          Use this email for online purchases to seamlessly
          <br />
          match invoices againsts transactions.
        </p>
      </div>
    );
  }

  return <InboxList data={data.data} />;
}
