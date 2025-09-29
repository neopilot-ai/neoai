import { useTRPC } from "@/trpc/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@neoai/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AssignedUser } from "./assigned-user";

type User = {
  id: string;
  avatar_url?: string | null;
  full_name: string | null;
};

type Props = {
  selectedId?: string;
  onSelect: (user?: User) => void;
};

export function AssignUser({ selectedId, onSelect }: Props) {
  const [value, setValue] = useState<string>();
  const trpc = useTRPC();

  const { data: users } = useQuery(trpc.team.members.queryOptions());

  useEffect(() => {
    setValue(selectedId);
  }, [selectedId]);

  return (
    <Select
      value={value}
      onValueChange={(id) => {
        const found = users?.find(({ user }) => user?.id === id)?.user;

        if (found) {
          onSelect({
            id: found.id,
            full_name: found.fullName ?? null,
            avatar_url: found.avatarUrl ?? null,
          });
        } else {
          onSelect(undefined);
        }
      }}
    >
      <SelectTrigger
        id="assign"
        className="line-clamp-1 truncate"
        onKeyDown={(evt) => evt.preventDefault()}
      >
        <SelectValue placeholder="Select" />
      </SelectTrigger>

      <SelectContent className="overflow-y-auto max-h-[200px]">
        {users?.map(({ user }) => {
          return (
            <SelectItem key={user?.id} value={user?.id ?? ""}>
              <AssignedUser
                fullName={user?.fullName}
                avatarUrl={user?.avatarUrl}
              />
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
