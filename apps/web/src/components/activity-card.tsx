"use client";

import { useOverridesSheet } from "@/hooks/use-overrides-sheet";
import { formatTimeAgo } from "@/lib/format";
import { useTranslations } from "next-intl";
import { FaBitbucket, FaGithub } from "react-icons/fa";
import { Skeleton } from "./ui/skeleton";

type Props = {
  id: string;
  source: string;
  content: string;
  updatedAt: Date;
  commit?: string | null;
  commitLink?: string | null;
  sourceProvider?: string | null;
  targetLanguage: string;
  sourceType: "key" | "document";
  translationKey: string;
  projectId: string;
};

export function ActivityCard({
  id,
  source,
  content,
  updatedAt,
  commit,
  commitLink,
  sourceProvider,
  targetLanguage,
  sourceType,
  translationKey,
  projectId,
}: Props) {
  const t = useTranslations("activity");
  const { setQueryStates } = useOverridesSheet();

  return (
    <button
      type="button"
      onClick={() =>
        setQueryStates({
          translationKey,
          projectId,
          locale: targetLanguage,
        })
      }
      className="border border-border relative w-full flex"
    >
      <div className="absolute -top-3.5 left-3 bg-background bg-noise px-4 py-1">
        <h3 className="text-xs uppercase text-[#878787] font-medium">
          {t(`type.${sourceType}`)}
        </h3>
      </div>

      <div className="text-secondary font-mono text-xs whitespace-nowrap overflow-hidden p-6 flex items-center justify-between w-full">
        <div className="flex items-center gap-2 overflow-hidden flex-1 w-[100px] md:w-full md:max-w-[calc(100vw-400px)] text-left">
          <span className="text-primary truncate">{source} → </span>
          <span
            className="truncate flex-1"
            title={`${targetLanguage}: ${content}`}
          >
            {targetLanguage}: {content}
          </span>
        </div>
        <div className="flex items-center gap-2 text-secondary">
          {commit && commitLink && (
            <a
              href={commitLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-secondary"
            >
              {sourceProvider === "github" && <FaGithub />}
              {sourceProvider === "bitbucket" && <FaBitbucket />}{" "}
              <span className="truncate max-w-[60px]">#{commit}</span>
            </a>
          )}

          <span>{formatTimeAgo(new Date(updatedAt))}</span>
        </div>
      </div>
    </button>
  );
}

export function ActivityCardSkeleton() {
  return (
    <div className="border border-border h-[66px]">
      <div className="text-secondary font-mono text-xs whitespace-nowrap overflow-hidden p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-4" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}
