"use client";

import { DocumentDetails } from "@/components/document-details";
import { useDocumentParams } from "@/hooks/use-document-params";
import { Sheet, SheetContent } from "@neoai/ui/sheet";
import React from "react";

export function DocumentSheet() {
  const { params, setParams } = useDocumentParams();

  const isOpen = Boolean(params.filePath || params.documentId);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={() => setParams({ documentId: null, filePath: null })}
    >
      <SheetContent style={{ maxWidth: 647 }}>
        <DocumentDetails />
      </SheetContent>
    </Sheet>
  );
}
