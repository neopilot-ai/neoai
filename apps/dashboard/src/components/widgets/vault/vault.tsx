"use client";

import { useDocumentParams } from "@/hooks/use-document-params";
import type { RouterOutputs } from "@api/trpc/routers/_app";
import { Badge } from "@neoai/ui/badge";
import { useRouter } from "next/navigation";

type Props = {
  files: RouterOutputs["documents"]["get"]["data"];
};

export function Vault({ files }: Props) {
  const { setParams } = useDocumentParams();
  const router = useRouter();

  return (
    <ul className="bullet-none divide-y cursor-pointer overflow-auto scrollbar-hide aspect-square pb-24">
      {files?.map((file) => {
        const firstTag = file.documentTagAssignments.at(0)?.documentTag;

        return (
          <li key={file.id}>
            <div className="flex items-center py-3 justify-between">
              <span
                className="text-sm line-clamp-1 pr-8"
                onClick={() => {
                  setParams({
                    filePath: file.name,
                  });
                }}
              >
                {file.name?.split("/").at(-1)}
              </span>

              {file.documentTagAssignments.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/vault?tags=${firstTag?.id}`);
                  }}
                >
                  <Badge variant="tag-rounded" className="text-xs">
                    {firstTag?.name}
                  </Badge>
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
