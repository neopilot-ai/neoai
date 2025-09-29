"use client";

import { FilePreview } from "@/components/file-preview";
import { VaultItemTags } from "@/components/vault/vault-item-tags";
import { useDocumentParams } from "@/hooks/use-document-params";
import type { RouterOutputs } from "@api/trpc/routers/_app";
import { cn } from "@neoai/ui/cn";
import { Skeleton } from "@neoai/ui/skeleton";
import { VaultItemActions } from "./vault-item-actions";

type Props = {
  data: Partial<RouterOutputs["documents"]["get"]["data"][number]> & {
    id: string;
    name?: string | null;
    metadata: Record<string, unknown>;
    pathTokens: string[];
    title: string;
    summary: string;
  };
  small?: boolean;
};

export function VaultItem({ data, small }: Props) {
  const { setParams } = useDocumentParams();

  const isLoading = data.processingStatus === "pending";

  return (
    <div
      className={cn(
        "h-72 border relative flex text-muted-foreground p-4 flex-col gap-3 hover:bg-muted dark:hover:bg-[#141414] transition-colors duration-200 group",
        small && "h-48",
      )}
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <VaultItemActions
          id={data.id}
          filePath={data.pathTokens ?? []}
          hideDelete={small}
        />
      </div>

      <button
        type="button"
        className={cn(
          "w-[60px] h-[84px] flex items-center justify-center",
          small && "w-[45px] h-[63px]",
          (data?.metadata as { mimetype?: string })?.mimetype?.startsWith(
            "image/",
          ) && "bg-border",
        )}
        onClick={() => {
          setParams({ documentId: data.id });
        }}
      >
        {data?.metadata?.mimetype === "image/heic" && isLoading ? (
          // NOTE: We convert the heic images to jpeg in the backend, so we need to wait for the image to be processed
          // Otherwise the image will be a broken image, and the cache will not be updated
          <Skeleton className="absolute inset-0 w-full h-full" />
        ) : (
          <FilePreview
            filePath={data?.pathTokens?.join("/") ?? ""}
            mimeType={(data?.metadata as { mimetype?: string })?.mimetype ?? ""}
          />
        )}
      </button>

      <button
        type="button"
        className="flex flex-col text-left"
        onClick={() => {
          setParams({ documentId: data.id });
        }}
      >
        {
          <h2 className="text-sm text-primary line-clamp-1 mb-2 mt-3">
            {isLoading ? (
              <Skeleton className="w-[80%] h-4" />
            ) : (
              (data?.title ?? data?.name?.split("/").at(-1))
            )}
          </h2>
        }

        {isLoading ? (
          <Skeleton className="w-[50%] h-4" />
        ) : (
          <p className="text-xs text-muted-foreground line-clamp-3">
            {data?.summary}
          </p>
        )}
      </button>

      {!small && (
        <VaultItemTags
          tags={data?.documentTagAssignments ?? []}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
