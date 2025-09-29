"use client";

import { useProductParams } from "@/hooks/use-product-params";
import { Button } from "@neoai/ui/button";
import { Icons } from "@neoai/ui/icons";
import { Sheet, SheetContent, SheetHeader } from "@neoai/ui/sheet";
import React from "react";
import { ProductForm } from "../forms/product-form";

export function ProductCreateSheet({
  defaultCurrency,
}: { defaultCurrency: string }) {
  const { setParams, createProduct } = useProductParams();

  const isOpen = Boolean(createProduct);

  return (
    <Sheet open={isOpen} onOpenChange={() => setParams(null)}>
      <SheetContent>
        <SheetHeader className="mb-6 flex justify-between items-center flex-row">
          <h2 className="text-xl">Create Product</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setParams(null)}
            className="p-0 m-0 size-auto hover:bg-transparent"
          >
            <Icons.Close className="size-5" />
          </Button>
        </SheetHeader>

        <ProductForm defaultCurrency={defaultCurrency} />
      </SheetContent>
    </Sheet>
  );
}
