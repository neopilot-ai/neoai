"use client";

import { cn } from "@neoai/ui/cn";
import { Icons } from "@neoai/ui/icons";

type Props = {
  value: string;
  variant?: "positive" | "negative";
};

export function Status({ value, variant }: Props) {
  return (
    <div
      className={cn(
        "flex space-x-1 text-[#FF3638] items-center",
        variant === "positive" && "text-[#00C969]",
      )}
    >
      {variant === "positive" ? (
        <Icons.TrendingUp size={14} />
      ) : (
        <Icons.TrendingDown size={14} />
      )}

      <p className="text-[12px] font-medium">{value}</p>
    </div>
  );
}
